
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Stay updated with the latest news and events from Happiness Club
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">Blog content coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
