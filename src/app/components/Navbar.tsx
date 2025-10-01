"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  // Simulated auth state (replace with real auth context or props)
  const [user, setUser] = useState<{ firstname: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    // Add your get started logic here
    console.log("Get Started clicked");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Daddy&apos;s Shop
            </div>
          </div>

          {/* Navigation Links - Centered - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/#about"
                className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/#contact"
                className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </div>
          </div>

          {/* Right Section: Cart + User - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Navigation - Simple Link */}
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-green-500 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9"
                />
              </svg>
              {/* Example badge */}
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center">
                2
              </span>
            </Link>

            {/* User / Get Started */}
            {user ? (
              <span className="font-medium text-gray-700">
                {user.firstname}
              </span>
            ) : (
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-500 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile menu button - Only visible on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-green-500 p-2 transition-colors"
            >
              {isMobileMenuOpen ? (
                // Close icon (X)
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger menu icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Animated dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 py-4 border-t border-gray-100' : 'max-h-0'
        }`}>
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 py-2"
            >
              Home
            </Link>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#about"
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 py-2"
            >
              About
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#contact"
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 py-2"
            >
              Contact
            </a>
            
            {/* Cart in mobile menu */}
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center text-gray-600 hover:text-green-500 font-medium transition-colors duration-200 py-2"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9"
                />
              </svg>
              Cart
              <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                2
              </span>
            </Link>

            {/* User / Get Started in mobile menu */}
            {user ? (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium py-2">
                  Hello, {user.firstname}
                </span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  handleGetStarted();
                  closeMobileMenu();
                }}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-700 transition-all duration-200 shadow-sm text-center"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}