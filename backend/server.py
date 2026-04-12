from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import (
    Package, Booking, BookingCreate, BookingStatus, BookingStatusUpdate,
    Blog, BlogCreate, BlogUpdate, Contact, ContactCreate,
    AdminLogin, Admin, AdminInDB, Token, ConfigResponse,
    Service, ServiceCategory
)
from auth import (
    verify_password, get_password_hash, create_access_token, get_current_admin
)
from seed_data import INITIAL_PACKAGES, INITIAL_BLOGS, SERVICE_CATEGORIES, BOAT_SERVICES, CAB_SERVICES
from email_service import send_booking_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with error handling
try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
    db = client[os.environ.get('DB_NAME', 'gofers_db')]
    logger = logging.getLogger(__name__)
    logger.info(f"Connected to MongoDB: {mongo_url}")
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

# Create the main app without a prefix
app = FastAPI(title="Gofers Varanasi Tourism API")

# CORS Configuration - MUST be before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== HELPER ====================

def clean_doc(doc):
    """Remove MongoDB _id field so it doesn't break serialization"""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    try:
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


# ==================== SERVICES ====================

@api_router.get("/services/categories", response_model=List[ServiceCategory])
async def get_service_categories():
    categories = await db.service_categories.find().to_list(100)
    return [clean_doc(c) for c in categories]

@api_router.get("/services/all/list", response_model=List[Service])
async def get_all_services():
    services = await db.services.find({"active": True}).to_list(500)
    return [clean_doc(s) for s in services]

@api_router.get("/services/{category_id}", response_model=List[Service])
async def get_services_by_category(category_id: str):
    services = await db.services.find({"categoryId": category_id, "active": True}).to_list(100)
    return [clean_doc(s) for s in services]


# ==================== PACKAGES ====================

@api_router.get("/packages", response_model=List[Package])
async def get_packages():
    packages = await db.packages.find({"active": True}).to_list(100)
    return [clean_doc(p) for p in packages]

@api_router.get("/packages/{package_id}", response_model=Package)
async def get_package(package_id: str):
    package = await db.packages.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return clean_doc(package)


# ==================== BOOKINGS ====================

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    package = await db.packages.find_one({"id": booking_data.packageId})
    if not package:
        service = await db.services.find_one({"id": booking_data.packageId})
        if not service:
            raise HTTPException(status_code=404, detail="Package/Service not found")
        package = service

    final_price = package.get("price", package.get("priceStart", 0))
    if booking_data.includeGhatWalk and package.get("hasOptionalGhatWalk"):
        final_price = package.get("priceWithGhatWalk", package.get("price", 0))

    booking = Booking(
        id=f"booking_{int(datetime.utcnow().timestamp())}",
        packageId=booking_data.packageId,
        packageName=package["name"],
        customerName=booking_data.customerName,
        email=booking_data.email,
        phone=booking_data.phone,
        travelDate=booking_data.travelDate,
        guests=booking_data.guests,
        includeGhatWalk=booking_data.includeGhatWalk,
        finalPrice=final_price,
        message=booking_data.message,
        status=BookingStatus.pending
    )

    await db.bookings.insert_one(booking.dict())

    try:
        send_booking_email(booking.dict())
    except Exception as e:
        logger.error(f"Email notification failed: {str(e)}")

    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(admin: str = Depends(get_current_admin)):
    bookings = await db.bookings.find().sort("createdAt", -1).to_list(1000)
    return [clean_doc(b) for b in bookings]

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, admin: str = Depends(get_current_admin)):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return clean_doc(booking)

@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    admin: str = Depends(get_current_admin)
):
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking status updated successfully"}


# ==================== BLOGS ====================

@api_router.get("/blogs", response_model=List[Blog])
async def get_blogs(published: Optional[bool] = True):
    """Get all published blogs"""
    query = {}
    if published is not None:
        # Match both Python True and MongoDB stored true/True
        query = {"published": {"$in": [True, "true", 1]}}
    blogs = await db.blogs.find(query).to_list(100)
    return [clean_doc(b) for b in blogs]

@api_router.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog(blog_id: str):
    """Get single blog by custom id field"""
    blog = await db.blogs.find_one({"id": blog_id})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return clean_doc(blog)

@api_router.post("/blogs", response_model=Blog)
async def create_blog(blog_data: BlogCreate, admin: str = Depends(get_current_admin)):
    blog = Blog(
        id=f"blog_{int(datetime.utcnow().timestamp())}",
        title=blog_data.title,
        excerpt=blog_data.excerpt,
        content=blog_data.content,
        author=blog_data.author,
        date=datetime.utcnow().strftime("%d %b %Y"),
        image=blog_data.image,
        category=blog_data.category,
        published=blog_data.published
    )
    await db.blogs.insert_one(blog.dict())
    return blog

@api_router.patch("/blogs/{blog_id}", response_model=Blog)
async def update_blog(
    blog_id: str,
    blog_data: BlogUpdate,
    admin: str = Depends(get_current_admin)
):
    update_data = {k: v for k, v in blog_data.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()

    result = await db.blogs.update_one(
        {"id": blog_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")

    blog = await db.blogs.find_one({"id": blog_id})
    return clean_doc(blog)

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin: str = Depends(get_current_admin)):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}


# ==================== CONTACTS ====================

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    contact = Contact(
        id=f"contact_{int(datetime.utcnow().timestamp())}",
        name=contact_data.name,
        email=contact_data.email,
        phone=contact_data.phone,
        message=contact_data.message
    )
    await db.contacts.insert_one(contact.dict())
    return contact

@api_router.get("/contacts", response_model=List[Contact])
async def get_contacts(admin: str = Depends(get_current_admin)):
    contacts = await db.contacts.find().sort("createdAt", -1).to_list(1000)
    return [clean_doc(c) for c in contacts]


# ==================== ADMIN AUTH ====================

@api_router.post("/admin/login", response_model=Token)
async def admin_login(credentials: AdminLogin):
    admin = await db.admins.find_one({"username": credentials.username})
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": admin["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/admin/me", response_model=Admin)
async def get_current_admin_info(admin_username: str = Depends(get_current_admin)):
    admin = await db.admins.find_one({"username": admin_username})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    admin.pop("password", None)
    return clean_doc(admin)


# ==================== CONFIG ====================

@api_router.get("/config", response_model=ConfigResponse)
async def get_config():
    whatsapp_number = os.environ.get("WHATSAPP_NUMBER", "919876543210")
    return {"whatsappNumber": whatsapp_number}


# ==================== DATABASE INITIALIZATION ====================

@api_router.post("/init-db")
async def initialize_database():
    existing_packages = await db.packages.count_documents({})
    if existing_packages > 0:
        return {"message": "Database already initialized"}

    await db.service_categories.insert_many(SERVICE_CATEGORIES)
    await db.services.insert_many(BOAT_SERVICES)
    await db.services.insert_many(CAB_SERVICES)
    await db.packages.insert_many(INITIAL_PACKAGES)
    await db.blogs.insert_many(INITIAL_BLOGS)

    admin = AdminInDB(
        id=f"admin_{int(datetime.utcnow().timestamp())}",
        username="admin",
        email="admin@gofers.com",
        password=get_password_hash("admin123"),
        role="admin"
    )
    await db.admins.insert_one(admin.dict())
    return {"message": "Database initialized successfully with all services and packages"}


@api_router.post("/reset-db")
async def reset_database():
    await db.packages.delete_many({})
    await db.services.delete_many({})
    await db.service_categories.delete_many({})
    await db.bookings.delete_many({})
    await db.blogs.delete_many({})
    await db.contacts.delete_many({})
    await db.admins.delete_many({})

    await db.service_categories.insert_many(SERVICE_CATEGORIES)
    await db.services.insert_many(BOAT_SERVICES)
    await db.services.insert_many(CAB_SERVICES)
    await db.packages.insert_many(INITIAL_PACKAGES)
    await db.blogs.insert_many(INITIAL_BLOGS)

    admin = AdminInDB(
        id=f"admin_{int(datetime.utcnow().timestamp())}",
        username="admin",
        email="admin@gofers.com",
        password=get_password_hash("admin123"),
        role="admin"
    )
    await db.admins.insert_one(admin.dict())
    return {"message": "Database reset and reinitialized successfully with all services"}


# ==================== DOWNLOAD ====================

from fastapi.responses import FileResponse

@api_router.get("/download-project")
async def download_project():
    zip_path = "/app/gofers-varanasi-tourism.zip"
    if os.path.exists(zip_path):
        return FileResponse(
            path=zip_path,
            filename="gofers-varanasi-tourism.zip",
            media_type="application/zip"
        )
    else:
        raise HTTPException(status_code=404, detail="Zip file not found")


# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
