import { Product, Recipe, Review, FAQ } from "@shared/schema";
import productsData from "../data/products.json";
import recipesData from "../data/recipes.json";
import reviewsData from "../data/reviews.json";
import faqData from "../data/faq.json";

// Static data with proper typing
const products: Product[] = productsData as any;
const recipes: Recipe[] = recipesData as any;
const reviews: Review[] = reviewsData as any;
const faq: FAQ[] = faqData as any;

// Helper function for case-insensitive search
const matchesQuery = (text: string, query: string): boolean => {
  return text.toLowerCase().includes(query.toLowerCase());
};

// Product-related functions
export const getAllProducts = (): Promise<Product[]> => {
  return Promise.resolve(products);
};

export const getProductBySlug = (slug: string): Promise<Product | undefined> => {
  return Promise.resolve(products.find(p => p.slug === slug));
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return Promise.resolve(products.find(p => p.id === id));
};

export const getProductsByCategory = (category: string): Promise<Product[]> => {
  return Promise.resolve(products.filter(p => p.category === category));
};

export const searchProducts = (query: string): Promise<Product[]> => {
  if (!query) return Promise.resolve(products);
  
  const lowercaseQuery = query.toLowerCase();
  return Promise.resolve(products.filter(p => 
    matchesQuery(p.name, lowercaseQuery) ||
    matchesQuery(p.category, lowercaseQuery) ||
    p.usp.some(u => matchesQuery(u, lowercaseQuery))
  ));
};

// Recipe-related functions
export const getAllRecipes = (): Promise<Recipe[]> => {
  return Promise.resolve(recipes);
};

export const getRecipeById = (id: string): Promise<Recipe | undefined> => {
  return Promise.resolve(recipes.find(r => r.id === id));
};

export const getRecipesByProduct = (productId: string): Promise<Recipe[]> => {
  return Promise.resolve(recipes.filter(r => r.suitableProducts.includes(productId)));
};

export const searchRecipes = (query: string): Promise<Recipe[]> => {
  if (!query) return Promise.resolve(recipes);
  
  const lowercaseQuery = query.toLowerCase();
  return Promise.resolve(recipes.filter(r => 
    matchesQuery(r.title, lowercaseQuery) ||
    r.ingredients.some(i => matchesQuery(i, lowercaseQuery)) ||
    r.steps.some(s => matchesQuery(s, lowercaseQuery))
  ));
};

// Review-related functions
export const getAllReviews = (): Promise<Review[]> => {
  return Promise.resolve(reviews);
};

export const getReviewsByProduct = (productId: string): Promise<Review[]> => {
  return Promise.resolve(reviews.filter(r => r.productId === productId));
};

// FAQ-related functions
export const getAllFAQ = (): Promise<FAQ[]> => {
  return Promise.resolve(faq);
};

export const getFAQByCategory = (category: string): Promise<FAQ[]> => {
  return Promise.resolve(faq.filter(f => f.category === category));
};

export const searchFAQ = (query: string): Promise<FAQ[]> => {
  if (!query) return Promise.resolve(faq);
  
  const lowercaseQuery = query.toLowerCase();
  return Promise.resolve(faq.filter(f => 
    matchesQuery(f.question, lowercaseQuery) ||
    matchesQuery(f.answer, lowercaseQuery) ||
    f.tags.some(t => matchesQuery(t, lowercaseQuery))
  ));
};

// Advanced search functionality
export const searchContent = (query: string): Promise<{
  products: Product[];
  recipes: Recipe[];
  faq: FAQ[];
}> => {
  if (!query) {
    return Promise.resolve({
      products: [],
      recipes: [],
      faq: [],
    });
  }

  const lowercaseQuery = query.toLowerCase();
  
  return Promise.resolve({
    products: products.filter(p => 
      matchesQuery(p.name, lowercaseQuery) ||
      matchesQuery(p.category, lowercaseQuery) ||
      p.usp.some(u => matchesQuery(u, lowercaseQuery))
    ),
    recipes: recipes.filter(r => 
      matchesQuery(r.title, lowercaseQuery) ||
      r.ingredients.some(i => matchesQuery(i, lowercaseQuery)) ||
      r.steps.some(s => matchesQuery(s, lowercaseQuery))
    ),
    faq: faq.filter(f => 
      matchesQuery(f.question, lowercaseQuery) ||
      matchesQuery(f.answer, lowercaseQuery) ||
      f.tags.some(t => matchesQuery(t, lowercaseQuery))
    ),
  });
};

// Category helpers
export const getUniqueCategories = (): Promise<string[]> => {
  const categories = products.map(p => p.category);
  return Promise.resolve(Array.from(new Set(categories)));
};

export const getFAQCategories = (): Promise<string[]> => {
  const categories = faq.map(f => f.category);
  return Promise.resolve(Array.from(new Set(categories)));
};

// Recipe difficulty levels
export const getRecipeDifficulties = (): Promise<string[]> => {
  const difficulties = recipes.map(r => r.difficulty);
  return Promise.resolve(Array.from(new Set(difficulties)));
};

// Product stats helpers
export const getProductStats = (): Promise<{
  totalProducts: number;
  totalRecipes: number;
  totalReviews: number;
  averageRating: number;
}> => {
  return Promise.resolve({
    totalProducts: products.length,
    totalRecipes: recipes.length,
    totalReviews: reviews.length,
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
  });
};