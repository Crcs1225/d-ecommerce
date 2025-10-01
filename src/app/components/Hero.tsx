"use client";

import { ReactNode } from "react";
import { motion, backOut, easeOut } from "framer-motion";
import { useInView } from "react-intersection-observer";


export default function Hero({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  // Fixed floatVariants - removed the problematic structure
  const blobVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.7,
      transition: {
        duration: 1.5,
        ease: easeOut
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: backOut
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      {/* Floating Shapes with Motion */}
      <motion.div
        variants={blobVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
        className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 mb-2 shadow-sm"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-green-700">Trusted by 10,000+ customers worldwide</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Premium Products
          <motion.span
            variants={itemVariants}
            className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          >
            For Modern Living
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Discover curated collections of high-quality products with 
          <span className="font-semibold text-green-600"> AI-powered recommendations </span> 
          tailored just for you
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          className="flex justify-center items-center gap-8 mb-8 flex-wrap"
        >
          {[
            { number: "1K+", label: "Products" },
            { number: "100%", label: "Quality Assured" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Children (CTA Buttons/Search) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Fixed with direct animation props */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </motion.section>
  );
}