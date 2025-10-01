"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  chatService, 
  conversationStorage, 
  handleApiError,
  useChatbotApi,
  type ChatMessage, 
  type ChatResponse,
  type Product 
} from "../lib/chatbot-api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20,
    transition: { duration: 0.3 }
  }
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const typingDotVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 }
};

const iconVariants = {
  open: { rotate: 45 },
  closed: { rotate: 0 }
};

// Helper function to format message text with proper lists
const formatMessageText = (text: string) => {
  // Split the text by lines
  const lines = text.split('\n');
  const formattedLines: JSX.Element[] = [];
  
  let inList = false;
  let listItems: JSX.Element[] = [];

  lines.forEach((line, index) => {
    // Check if this line is a list item (starts with * or -)
    const isListItem = /^[*•-]\s+.+/.test(line.trim());
    
    if (isListItem) {
      if (!inList) {
        inList = true;
      }
      // Remove the asterisk/dash and trim
      const listItemText = line.trim().replace(/^[*•-]\s+/, '');
      listItems.push(
        <li key={index} className="ml-4 mb-1">
          {listItemText}
        </li>
      );
    } else {
      // If we were in a list and now we're not, push the list
      if (inList && listItems.length > 0) {
        formattedLines.push(
          <ul key={`list-${index}`} className="ml-4 my-2 list-disc space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      
      // Add regular text line
      if (line.trim()) {
        formattedLines.push(
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      } else if (index > 0 && index < lines.length - 1) {
        // Add empty line for spacing between paragraphs
        formattedLines.push(<br key={`br-${index}`} />);
      }
    }
  });

  // If we ended while still in a list, push the remaining list items
  if (inList && listItems.length > 0) {
    formattedLines.push(
      <ul key={`list-end`} className="ml-4 my-2 list-disc space-y-1">
        {listItems}
      </ul>
    );
  }

  return formattedLines.length > 0 ? formattedLines : text;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { apiStatus, checkHealth } = useChatbotApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when component mounts or opens
  useEffect(() => {
    const initializeConversation = async () => {
      if (open) {
        // Check if we have an existing conversation
        const savedConversationId = conversationStorage.getCurrentConversationId();
        const savedMessages = savedConversationId 
          ? conversationStorage.getConversation(savedConversationId)
          : [];

        if (savedMessages.length > 0) {
          setMessages(savedMessages);
          setConversationId(savedConversationId);
        } else {
          // Start with welcome message
          const welcomeMessage: ChatMessage = { 
            sender: "bot", 
            text: "Hello! I'm your shopping assistant. How can I help you today? 🛍️" 
          };
          setMessages([welcomeMessage]);
          conversationStorage.saveConversation('temp', [welcomeMessage]);
        }

        // Check API health
        await checkHealth();
      }
    };

    initializeConversation();
  }, [open, checkHealth]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setSuggestedQuestions([]);

    try {
      const botResponse: ChatResponse = await chatService.sendUserMessage(
        input,
        undefined, // Let backend handle conversation history
        "anonymous",
        conversationId || undefined
      );
      
      // Update conversation ID if this is a new conversation
      if (!conversationId && botResponse.conversation_id) {
        setConversationId(botResponse.conversation_id);
        conversationStorage.setCurrentConversationId(botResponse.conversation_id);
      }

      // Add bot response to messages
      const botMessage: ChatMessage = { sender: "bot", text: botResponse.response };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Save to local storage
      if (botResponse.conversation_id) {
        conversationStorage.saveConversation(botResponse.conversation_id, finalMessages);
      }
      
      // Update suggested questions
      if (botResponse.suggested_questions && botResponse.suggested_questions.length > 0) {
        setSuggestedQuestions(botResponse.suggested_questions);
      } else {
        const quickReplies = await chatService.getQuickReplies(botResponse.intent);
        setSuggestedQuestions(quickReplies);
      }

      // Handle product recommendations
      if (botResponse.relevant_products && botResponse.relevant_products.length > 0) {
        await handleProductRecommendations(botResponse.relevant_products);
      }

    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage: ChatMessage = { 
        sender: "bot", 
        text: handleApiError(error)
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to conversation
      if (conversationId) {
        const currentMessages = [...messages, userMessage, errorMessage];
        conversationStorage.saveConversation(conversationId, currentMessages);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleProductRecommendations = async (products: Product[]) => {
    if (products.length === 0) return;

    // Create a product summary message with proper formatting
    const productSummary = products.map(product => 
      `• ${product.name} - $${product.price} (${product.in_stock ? 'In Stock' : 'Out of Stock'})`
    ).join('\n');

    const productMessage: ChatMessage = {
      sender: "bot",
      text: `Here are some products you might like:\n${productSummary}\n\nWould you like more details about any of these?`
    };

    setMessages(prev => [...prev, productMessage]);

    // Update local storage
    if (conversationId) {
      const currentMessages = [...messages, productMessage];
      conversationStorage.saveConversation(conversationId, currentMessages);
    }

    // Update suggested questions to include product-specific options
    const productQuestions = [
      "Show me more details",
      "Similar products",
      "Price range options",
      "Check availability"
    ];
    setSuggestedQuestions(prev => [...productQuestions, ...prev.slice(0, 2)]);
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    if (conversationId) {
      conversationStorage.clearConversation(conversationId);
    }
    setMessages([{ sender: "bot", text: "Hello! I'm your shopping assistant. How can I help you today? 🛍️" }]);
    setConversationId(null);
    setSuggestedQuestions([]);
  };

  // Default quick replies for initial state
  const defaultQuickReplies = [
    "Best sellers",
    "Current deals",
    "Shipping info",
    "Return policy"
  ];

  const quickReplies = suggestedQuestions.length > 0 ? suggestedQuestions : defaultQuickReplies;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white w-80 h-96 md:w-96 md:h-[480px] shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm">🤖</span>
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">Shopping Assistant</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-green-100 text-xs">
                        {apiStatus === 'online' ? 'Online • AI Powered' : 
                         apiStatus === 'offline' ? 'Offline • Limited' : 
                         'Checking status...'}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${
                        apiStatus === 'online' ? 'bg-green-400 animate-pulse' :
                        apiStatus === 'offline' ? 'bg-red-400' :
                        'bg-yellow-400 animate-pulse'
                      }`} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {/* Clear conversation button */}
                  {messages.length > 1 && (
                    <motion.button
                      title="Clear conversation"
                      onClick={clearConversation}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  )}
                  <motion.button
                    title="Close"
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] rounded-2xl p-3 whitespace-pre-wrap ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <div className="text-sm">
                        {formatMessageText(message.text)}
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-400"}`}>
                      {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <motion.div
                        variants={typingDotVariants}
                        animate="animate"
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        variants={typingDotVariants}
                        animate="animate"
                        transition={{ delay: 0.1 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        variants={typingDotVariants}
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length > 0 && apiStatus === 'online' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 bg-gray-50 border-t border-gray-100"
              >
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <motion.input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={
                      apiStatus === 'online' 
                        ? "Ask about products, shipping, returns..." 
                        : "Chat is currently offline..."
                    }
                    disabled={isTyping || apiStatus !== 'online'}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    title="Send"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping || apiStatus !== 'online'}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {apiStatus === 'online' 
                  ? "Powered by AI • Your data is secure" 
                  : "Chat service temporarily unavailable"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setOpen(!open)}
        className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all ${
          apiStatus === 'offline' ? 'opacity-75' : ''
        }`}
      >
        <motion.div
          variants={iconVariants}
          animate={open ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}