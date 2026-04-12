import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fixImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1665413793087-d58c23e3a177?w=1200&q=80';
  if (url.includes('unsplash.com') && !url.includes('?')) {
    return `${url}?w=1200&q=80`;
  }
  return url;
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API}/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600 text-lg">Article not found.</p>
          <Button
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to All Articles
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-96 w-full overflow-hidden bg-orange-50 mt-16">
        <img
          src={fixImageUrl(blog.image)}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1665413793087-d58c23e3a177?w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Badge className="bg-orange-600 text-white border-0 mb-3">
            {blog.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <Button
            variant="ghost"
            className="mb-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 -ml-2"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft size={16} className="mr-2" />
            All Articles
          </Button>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <User size={15} />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={15} />
              <span>{blog.date}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <Button
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={() => navigate('/blog')}
            >
              <ArrowLeft size={16} className="mr-2" />
              All Articles
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => navigate('/')}
            >
              Book a Tour
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
