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
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ChatbotApiClient {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new ApiError(response.status, `API error: ${response.statusText}`);
    }
    return response.json();
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.fetchWithTimeout(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<ChatResponse>(response);
  }

  async getProducts(category?: string): Promise<Product[]> {
    const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
    
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
    });

    return this.handleResponse<Product[]>(response);
  }

  async getProduct(productId: string): Promise<Product> {
    const response = await this.fetchWithTimeout(`${API_URL}/products/${productId}`, {
      method: "GET",
    });

    return this.handleResponse<Product>(response);
  }

  async searchProducts(request: SearchRequest): Promise<Product[]> {
    const response = await this.fetchWithTimeout(`${API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<Product[]>(response);
  }

  async getAvailableIntents(): Promise<{ intents: string[] }> {
    const response = await this.fetchWithTimeout(`${API_URL}/intents`, {
      method: "GET",
    });

    return this.handleResponse<{ intents: string[] }>(response);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await this.fetchWithTimeout(`${API_URL}/conversations/${userId}`, {
      method: "GET",
    });

    return this.handleResponse<Conversation[]>(response);
  }

  async healthCheck(): Promise<{ message: string; status: string }> {
    const response = await this.fetchWithTimeout(`${API_URL}/`, {
      method: "GET",
    });

    return this.handleResponse<{ message: string; status: string }>(response);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<{ message: string; product_id: string }> {
    const response = await this.fetchWithTimeout(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    return this.handleResponse<{ message: string; product_id: string }>(response);
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

  async getProductRecommendations(category: string): Promise<Product[]> {
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
    } catch {
      return false;
    }
  },
};

// Hook for React components
import { useState, useEffect, useCallback } from 'react';

export const useChatbotApi = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      await chatbotApi.healthCheck();
      setApiStatus('online');
      return true;
    } catch {
      setApiStatus('offline');
      return false;
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const sendMessage = async (
    message: string, 
    conversationId?: string, 
    userId: string = 'anonymous'
  ): Promise<ChatResponse> => {
    return chatService.sendUserMessage(message, [], userId, conversationId);
  };

  const getProducts = async (category?: string): Promise<Product[]> => {
    return chatService.getProductRecommendations(category || '');
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

  return {
    sendMessage,
    getProducts,
    searchProducts,
    getConversations,
    createProduct,
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
      default:
        return `Error: ${error.message}`;
    }
  }
  
  if (error instanceof Error) {
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
    if (this.getCurrentConversationId() === conversationId) {
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