import { type User, type InsertUser, type Product, type Recipe, type Review, type FAQ, type CartItem, type InsertProduct, type InsertRecipe, type InsertReview, type InsertFAQ, type InsertCartItem } from "@shared/schema";
import { randomUUID } from "crypto";
import products from "../client/src/data/products.json";
import recipes from "../client/src/data/recipes.json";
import reviews from "../client/src/data/reviews.json";
import faq from "../client/src/data/faq.json";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Recipes
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | undefined>;
  getRecipesByProduct(productId: string): Promise<Recipe[]>;
  searchRecipes(query: string): Promise<Recipe[]>;
  
  // Reviews
  getReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // FAQ
  getAllFAQ(): Promise<FAQ[]>;
  getFAQByCategory(category: string): Promise<FAQ[]>;
  searchFAQ(query: string): Promise<FAQ[]>;
  
  // Cart
  getCartItems(sessionId?: string, userId?: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId?: string, userId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Product[];
  private recipes: Recipe[];
  private reviews: Review[];
  private faqItems: FAQ[];
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.users = new Map();
    this.products = products as Product[];
    this.recipes = recipes as Recipe[];
    this.reviews = reviews as Review[];
    this.faqItems = faq as FAQ[];
    this.cartItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.products.find(p => p.slug === slug);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.usp.some(u => u.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return this.recipes;
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    return this.recipes.find(r => r.id === id);
  }

  async getRecipesByProduct(productId: string): Promise<Recipe[]> {
    return this.recipes.filter(r => r.suitableProducts.includes(productId));
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.recipes.filter(r => 
      r.title.toLowerCase().includes(lowercaseQuery) ||
      r.ingredients.some(i => i.toLowerCase().includes(lowercaseQuery)) ||
      r.steps.some(s => s.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = randomUUID();
    const newReview: Review = { ...review, id, helpful: 0, createdAt: new Date() };
    this.reviews.push(newReview);
    return newReview;
  }

  async getAllFAQ(): Promise<FAQ[]> {
    return this.faqItems;
  }

  async getFAQByCategory(category: string): Promise<FAQ[]> {
    return this.faqItems.filter(f => f.category === category);
  }

  async searchFAQ(query: string): Promise<FAQ[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.faqItems.filter(f => 
      f.question.toLowerCase().includes(lowercaseQuery) ||
      f.answer.toLowerCase().includes(lowercaseQuery) ||
      f.tags.some(t => t.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getCartItems(sessionId?: string, userId?: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => 
      item.sessionId === sessionId || item.userId === userId
    );
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { ...item, id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId?: string, userId?: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries());
    let cleared = false;
    
    for (const [id, item] of items) {
      if (item.sessionId === sessionId || item.userId === userId) {
        this.cartItems.delete(id);
        cleared = true;
      }
    }
    
    return cleared;
  }
}

export const storage = new MemStorage();
