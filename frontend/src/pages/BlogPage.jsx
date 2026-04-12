import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Fix Unsplash image URLs by appending size params
const fixImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1665413793087-d58c23e3a177?w=800&q=80';
  if (url.includes('unsplash.com') && !url.includes('?')) {
    return `${url}?w=800&q=80`;
  }
  return url;
};

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API}/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Varanasi <span className="text-orange-600">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the rich culture, spiritual traditions, and timeless wisdom of the eternal city through our curated articles and travel guides.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post) => (
                  <Card
                    key={post.id}
                    className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-orange-50">
                      <img
                        src={fixImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1665413793087-d58c23e3a177?w=800&q=80';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-600 text-white border-0">
                          {post.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <CardHeader className="flex-grow">
                      <CardTitle className="text-2xl text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-4 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {post.date}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        variant="ghost"
                        className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Read Full Article
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {blogs.length > 0 && (
                <div className="mt-16 text-center">
                  <p className="text-gray-500 mb-4">More articles coming soon!</p>
                  <Link to="/">
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
