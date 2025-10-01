"use client";

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import type { Variants } from "framer-motion";


export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const statsVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    }
  };



  return (
    <section id="about" className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                About Our Story
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Revolutionizing
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  E-commerce Experience
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                At <span className="font-semibold text-green-600">Daddy&apos;s Shop</span>, we&apos;re not just another 
                marketplace. We&apos;re a technology-driven platform that combines cutting-edge AI with 
                human-centric design to deliver exceptional shopping experiences.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "AI-Powered Recommendations",
                  description: "Smart algorithms that learn your preferences"
                },
                {
                  icon: "🛡️",
                  title: "Secure & Trusted",
                  description: "100% secure payments and buyer protection"
                },
                {
                  icon: "⚡",
                  title: "Lightning Fast Delivery",
                  description: "Same-day delivery in most metropolitan areas"
                },
                {
                  icon: "🌟",
                  title: "Premium Quality",
                  description: "Curated selection of high-quality products"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats & Visual */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "50K+", label: "Happy Customers", delay: 0 },
                { number: "100+", label: "Brand Partners", delay: 100 },
                { number: "24/7", label: "Support", delay: 200 },
                { number: "99.9%", label: "Uptime", delay: 300 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={statsVariants}
                  className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Mission Statement */}
            <motion.div
              variants={itemVariants}
              className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-green-50 leading-relaxed">
                To make online shopping effortless, enjoyable, and accessible to everyone 
                while supporting local businesses and sustainable practices.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Products
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all duration-200">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}