
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, User, Calendar } from 'lucide-react';

const BlogPosts = [
  {
    id: 1,
    title: "Celebrating Our First Fundraising Milestone",
    excerpt: "The Happiness Club has successfully raised over ₹50,000 in its first month of donations, exceeding our initial expectations.",
    author: "Dr. Priya Sharma",
    date: "2025-03-15",
    category: "Announcements",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "How Your Donations Make a Difference",
    excerpt: "Discover the impact your generous contributions have on student welfare and community development projects.",
    author: "Rahul Mehta",
    date: "2025-03-10",
    category: "Impact Stories",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Upcoming Charity Events This Summer",
    excerpt: "Join us for a series of exciting events planned for this summer to raise funds for our new campus library.",
    author: "Neha Joshi",
    date: "2025-03-05",
    category: "Events",
    image: "/placeholder.svg"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="leaderboard" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-donation-primary">Latest Updates</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-donation-primary to-purple-600">
            Blog & News
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Stay updated with the latest news, events, and stories from Nilgiri College's Happiness Club
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BlogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: post.id * 0.1 }}
            >
              <Card className="overflow-hidden h-full glass-card hover:shadow-lg transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <Badge className="absolute top-3 right-3 bg-white/90 text-donation-primary hover:bg-white">
                    {post.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User size={14} className="mr-1" />
                    <span className="mr-3">{post.author}</span>
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <button className="inline-flex items-center text-donation-primary font-medium hover:text-donation-primary/80 transition-colors">
                    Read more <ArrowRight size={16} className="ml-1" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Subscribe to our newsletter to receive the latest updates from Happiness Club
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-donation-primary focus:border-transparent" 
            />
            <button className="bg-donation-primary hover:bg-donation-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
