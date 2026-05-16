"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getPublicPostsAction } from '@/app/admin/actions';

export function LiveDemo() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPublicPostsAction();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div id="live-demo" className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {posts.map((post, index) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
          className="w-full relative group"
        >
          <div className={`absolute inset-0 bg-gradient-to-tr ${index % 2 === 0 ? 'from-indigo-500/20 to-blue-500/20' : 'from-purple-500/20 to-pink-500/20'} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
          <div className="relative w-full aspect-[16/9] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.4)] duration-500">
            {post.url && (
              <iframe 
                title={post.title || "Live Demo"} 
                className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
                src={post.url} 
                allowFullScreen={true}>
              </iframe>
            )}

            {/* Interactive Overlay */}
            <Link 
              href={`/template/${post.id}`} 
              className="absolute inset-0 z-10 bg-[#050505]/20 hover:bg-[#050505]/10 flex items-center justify-center transition-colors duration-300 group/overlay"
            >
              <div className={`px-6 py-3 rounded-full ${index % 2 === 0 ? 'bg-indigo-600' : 'bg-purple-600'} shadow-xl opacity-0 group-hover/overlay:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/overlay:translate-y-0 text-white font-medium`}>
                <BarChart3 className="w-5 h-5" />
                {post.title || "Click to Interact & Purchase"}
              </div>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
