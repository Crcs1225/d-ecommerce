// types.ts
export interface ChatMessage {
  sender: string;
  text: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  user_id?: string;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  suggested_questions: string[];
  relevant_products: Product[];
  intent: string;
  confidence: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  tags: string[];
  features: string[];
  image_url?: string;
}

export interface SearchRequest {
  query: string;
  category?: string;
  max_results?: number;
}

export interface Conversation {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// api-client.ts
// FIX: Use HTTP instead of HTTPS and correct port 7860
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:7860";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ChatbotApiClient {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(id);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, `HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    if (!text) {
      throw new ApiError(response.status, 'Empty response from server');
    }
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', e);
      throw new ApiError(response.status, `Invalid JSON response: ${text.substring(0, 100)}`);
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.fetchWithTimeout(`${API_URL}/chat`, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return this.handleResponse<ChatResponse>(response);
  }

  async getProducts(category?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', '20');
    
    const url = `${API_URL}/products?${params.toString()}`;
    const response = await this.fetchWithTimeout(url, { method: "GET" });
    return this.handleResponse<Product[]>(response);
  }

  async getProduct(productId: string): Promise<Product> {
    const response = await this.fetchWithTimeout(`${API_URL}/products/${productId}`, { method: "GET" });
    return this.handleResponse<Product>(response);
  }

  async searchProducts(request: SearchRequest): Promise<Product[]> {
    const response = await this.fetchWithTimeout(`${API_URL}/search`, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return this.handleResponse<Product[]>(response);
  }

  async getAvailableIntents(): Promise<{ intents: string[] }> {
    const response = await this.fetchWithTimeout(`${API_URL}/intents`, { method: "GET" });
    return this.handleResponse<{ intents: string[] }>(response);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await this.fetchWithTimeout(`${API_URL}/conversations/${userId}`, { method: "GET" });
    return this.handleResponse<Conversation[]>(response);
  }

  async healthCheck(): Promise<{ message: string; status: string }> {
    // Use the root endpoint for health check since it returns the expected format
    const response = await this.fetchWithTimeout(`${API_URL}/`, { method: "GET" });
    return this.handleResponse<{ message: string; status: string }>(response);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<{ message: string; product_id: string }> {
    const response = await this.fetchWithTimeout(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(product),
    });
    return this.handleResponse<{ message: string; product_id: string }>(response);
  }

  async getCategories(): Promise<{ categories: string[] }> {
    const response = await this.fetchWithTimeout(`${API_URL}/categories`, { method: "GET" });
    return this.handleResponse<{ categories: string[] }>(response);
  }
}

// Create singleton instance
export const chatbotApi = new ChatbotApiClient();

// Utility functions for common operations
export const chatService = {
  async sendUserMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [], 
    userId?: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    return chatbotApi.sendMessage({
      message,
      conversation_history: conversationHistory,
      user_id: userId,
      conversation_id: conversationId,
    });
  },

  async getProductRecommendations(category?: string): Promise<Product[]> {
    return chatbotApi.getProducts(category);
  },

  async searchProducts(query: string, category?: string, maxResults = 5): Promise<Product[]> {
    return chatbotApi.searchProducts({
      query,
      category,
      max_results: maxResults,
    });
  },

  async getQuickReplies(intent?: string): Promise<string[]> {
    const defaultReplies = ["Best sellers", "Current deals", "Shipping info", "Return policy"];
    
    if (intent === "product_inquiry") {
      return ["Show me electronics", "Clothing items", "Home & garden", "All categories"];
    } else if (intent === "shipping") {
      return ["Shipping costs", "Delivery time", "International shipping", "Track my order"];
    } else if (intent === "support") {
      return ["Contact support", "Store locations", "Business hours", "Technical help"];
    } else if (intent === "pricing") {
      return ["Do you offer discounts?", "What's the return policy?", "Any bundle deals?"];
    } else if (intent === "returns") {
      return ["How do I return an item?", "What's your warranty policy?", "Do you offer exchanges?"];
    }
    
    return defaultReplies;
  },

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return chatbotApi.getConversations(userId);
  },

  async checkApiHealth(): Promise<boolean> {
    try {
      await chatbotApi.healthCheck();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await chatbotApi.getCategories();
      return response.categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return ['electronics', 'clothing', 'home', 'beauty', 'sports', 'books'];
    }
  },
};

// Hook for React components
import { useState, useEffect, useCallback } from 'react';

export const useChatbotApi = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setApiStatus('checking');
    try {
      const isHealthy = await chatService.checkApiHealth();
      setApiStatus(isHealthy ? 'online' : 'offline');
      return isHealthy;
    } catch {
      setApiStatus('offline');
      return false;
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const sendMessage = async (
    message: string, 
    conversationId?: string, 
    userId: string = 'anonymous'
  ): Promise<ChatResponse> => {
    return chatService.sendUserMessage(message, [], userId, conversationId);
  };

  const getProducts = async (category?: string): Promise<Product[]> => {
    return chatService.getProductRecommendations(category);
  };

  const searchProducts = async (query: string, category?: string): Promise<Product[]> => {
    return chatService.searchProducts(query, category);
  };

  const getConversations = async (userId: string): Promise<Conversation[]> => {
    return chatService.getUserConversations(userId);
  };

  const createProduct = async (product: Omit<Product, 'id'>): Promise<{ message: string; product_id: string }> => {
    return chatbotApi.createProduct(product);
  };

  const getCategories = async (): Promise<string[]> => {
    return chatService.getCategories();
  };

  return {
    sendMessage,
    getProducts,
    searchProducts,
    getConversations,
    createProduct,
    getCategories,
    checkHealth,
    apiStatus,
  };
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Server error. Please try again later.";
      case 408:
        return "Request timeout. Please check your connection.";
      default:
        return `Error: ${error.message}`;
    }
  }
  
  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return "Network error. Please check your internet connection and ensure the server is running.";
    }
    if (error.message.includes('SSL')) {
      return "Connection error. Please ensure you're using the correct protocol (HTTP vs HTTPS).";
    }
    return error.message;
  }
  
  return "An unexpected error occurred.";
};

// Local storage utilities for conversation persistence
export const conversationStorage = {
  getConversation(conversationId: string): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`conversation_${conversationId}`);
    return stored ? JSON.parse(stored) : [];
  },

  saveConversation(conversationId: string, messages: ChatMessage[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`conversation_${conversationId}`, JSON.stringify(messages));
  },

  getCurrentConversationId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('current_conversation_id');
  },

  setCurrentConversationId(conversationId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_conversation_id', conversationId);
  },

  clearConversation(conversationId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`conversation_${conversationId}`);
    const currentId = this.getCurrentConversationId();
    if (currentId === conversationId) {
      localStorage.removeItem('current_conversation_id');
    }
  },
};

// Example usage types and constants
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME: 'home',
  BEAUTY: 'beauty',
  SPORTS: 'sports',
  BOOKS: 'books',
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

export const CHAT_INTENTS = {
  PRODUCT_INQUIRY: 'product_inquiry',
  PRICING: 'pricing',
  SHIPPING: 'shipping',
  RETURNS: 'returns',
  SUPPORT: 'support',
  GREETING: 'greeting',
  UNKNOWN: 'unknown',
} as const;

export type ChatIntent = typeof CHAT_INTENTS[keyof typeof CHAT_INTENTS];