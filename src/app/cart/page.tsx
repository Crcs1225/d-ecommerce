'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type CartItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
};

const sampleCartItems: CartItem[] = [
  {
    id: 1,
    name: "4Wrd By Dressberry",
    description: "Black Solid Noughties Spaghetti Top",
    price: 767.36,
    quantity: 1,
    image: "/api/placeholder/80/80",
    category: "Tops"
  },
  {
    id: 2,
    name: "Aahwan",
    description: "White Bralette Crop Top",
    price: 499.50,
    quantity: 2,
    image: "/api/placeholder/80/80",
    category: "Tops"
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setCartItems(sampleCartItems);
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    setTimeout(() => {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      setIsUpdating(false);
    }, 300);
  };

  const removeItem = (id: number) => {
    setIsUpdating(true);
    setTimeout(() => {
      setCartItems(prev => prev.filter(item => item.id !== id));
      setIsUpdating(false);
    }, 400);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return <CartLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-4 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
            {cartItems.length > 0 
              ? `Review your ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`
              : "Your cart is empty"
            }
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items - Mobile First */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 lg:p-6"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                  Cart Items ({cartItems.length})
                </h2>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium"
                >
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </motion.div>
              </div>

              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500">Add some products to get started!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ 
                            duration: 0.4,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 120
                          }}
                          whileHover={{ 
                            scale: isMobile ? 1 : 1.02,
                            transition: { duration: 0.2 }
                          }}
                          className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200"
                        >
                          {/* Product Image - Smaller on mobile */}
                          <motion.div
                            whileHover={{ scale: isMobile ? 1 : 1.1 }}
                            className="flex-shrink-0"
                          >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-lg flex items-center justify-center">
                              <span className="text-lg sm:text-xl lg:text-2xl">👕</span>
                            </div>
                          </motion.div>

                          {/* Product Info - Stacked on mobile */}
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-grow min-w-0">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                  {item.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                                <p className="text-green-600 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
                                  ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              
                              {/* Remove Button - Top right on mobile */}
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)}
                                className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                title="Remove item"
                              >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            </div>

                            {/* Quantity Controls - Full width on mobile */}
                            <div className="flex items-center justify-between mt-3 sm:mt-4">
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                Quantity:
                              </span>
                              <div className="flex items-center gap-2 sm:gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                >
                                  -
                                </motion.button>
                                
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base"
                                >
                                  {item.quantity}
                                </motion.span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>

                            {/* Item Total - Mobile only */}
                            {isMobile && (
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-700">Item Total:</span>
                                <span className="text-green-600 font-semibold">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary - Appears first on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Shipping</span>
                  <span>₹{cartItems.length > 0 ? '50.00' : '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <motion.span
                      key={calculateTotal()}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-green-600"
                    >
                      ₹{(calculateTotal() + (cartItems.length > 0 ? 50 : 0) + (calculateTotal() * 0.18)).toFixed(2)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Checkout Button - Larger on mobile */}
              <motion.button
                whileHover={{ 
                  scale: isMobile ? 1 : 1.02,
                  boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                disabled={cartItems.length === 0 || isUpdating}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 text-base sm:text-lg ${
                  cartItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isUpdating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : cartItems.length === 0 ? (
                  'Cart is Empty'
                ) : (
                  `Proceed to Checkout`
                )}
              </motion.button>

              {/* Continue Shopping */}
              <motion.button
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 py-2 sm:py-3 px-6 border border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base"
              >
                Continue Shopping
              </motion.button>

              {/* Mobile-only quick actions */}
              {isMobile && cartItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCartItems([])}
                      className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg font-medium text-sm border border-red-200"
                    >
                      Clear All
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm border border-blue-200"
                    >
                      Save for Later
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Loading Overlay for Updates */}
        <AnimatePresence>
          {isUpdating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <div className="flex space-x-2 justify-center mb-4">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                    className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Updating cart...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Mobile-optimized CartLoading component
export function CartLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </motion.div>
        
        <div className="flex space-x-1 sm:space-x-2 justify-center mb-3 sm:mb-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium"
        >
          Loading your cart...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}