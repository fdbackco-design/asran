import { Product, Recipe, Review, FAQ } from "@shared/schema";

// Cache for loaded data
let dataCache: {
  products?: Product[];
  recipes?: Recipe[];
  reviews?: Review[];
  faq?: FAQ[];
} = {};

// Helper function to fetch JSON data
const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`/data/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Data loaders with caching
const loadProducts = async (): Promise<Product[]> => {
  if (!dataCache.products) {
    dataCache.products = await fetchData<Product[]>('products');
  }
  return dataCache.products;
};

const loadRecipes = async (): Promise<Recipe[]> => {
  if (!dataCache.recipes) {
    dataCache.recipes = await fetchData<Recipe[]>('recipes');
  }
  return dataCache.recipes;
};

const loadReviews = async (): Promise<Review[]> => {
  if (!dataCache.reviews) {
    dataCache.reviews = await fetchData<Review[]>('reviews');
  }
  return dataCache.reviews;
};

const loadFAQ = async (): Promise<FAQ[]> => {
  if (!dataCache.faq) {
    dataCache.faq = await fetchData<FAQ[]>('faq');
  }
  return dataCache.faq;
};

// Helper function for case-insensitive search
const matchesQuery = (text: string, query: string): boolean => {
  return text.toLowerCase().includes(query.toLowerCase());
};

// Product-related functions
export const getAllProducts = async (): Promise<Product[]> => {
  return await loadProducts();
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const products = await loadProducts();
  return products.find(p => p.slug === slug);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await loadProducts();
  return products.find(p => p.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await loadProducts();
  return products.filter(p => p.category === category);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const products = await loadProducts();
  if (!query) return products;
  
  const lowercaseQuery = query.toLowerCase();
  return products.filter(p => 
    matchesQuery(p.name, lowercaseQuery) ||
    matchesQuery(p.category, lowercaseQuery) ||
    p.usp.some(u => matchesQuery(u, lowercaseQuery))
  );
};

// Recipe-related functions
export const getAllRecipes = async (): Promise<Recipe[]> => {
  return await loadRecipes();
};

export const getRecipeById = async (id: string): Promise<Recipe | undefined> => {
  const recipes = await loadRecipes();
  return recipes.find(r => r.id === id);
};

export const getRecipesByProduct = async (productId: string): Promise<Recipe[]> => {
  const recipes = await loadRecipes();
  return recipes.filter(r => r.suitableProducts.includes(productId));
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  const recipes = await loadRecipes();
  if (!query) return recipes;
  
  const lowercaseQuery = query.toLowerCase();
  return recipes.filter(r => 
    matchesQuery(r.title, lowercaseQuery) ||
    r.ingredients.some(i => matchesQuery(i, lowercaseQuery)) ||
    r.steps.some(s => matchesQuery(s, lowercaseQuery))
  );
};

// Review-related functions
export const getAllReviews = async (): Promise<Review[]> => {
  return await loadReviews();
};

export const getReviewsByProduct = async (productId: string): Promise<Review[]> => {
  const reviews = await loadReviews();
  return reviews.filter(r => r.productId === productId);
};

// FAQ-related functions
export const getAllFAQ = async (): Promise<FAQ[]> => {
  return await loadFAQ();
};

export const getFAQByCategory = async (category: string): Promise<FAQ[]> => {
  const faq = await loadFAQ();
  return faq.filter(f => f.category === category);
};

export const searchFAQ = async (query: string): Promise<FAQ[]> => {
  const faq = await loadFAQ();
  if (!query) return faq;
  
  const lowercaseQuery = query.toLowerCase();
  return faq.filter(f => 
    matchesQuery(f.question, lowercaseQuery) ||
    matchesQuery(f.answer, lowercaseQuery) ||
    f.tags.some(t => matchesQuery(t, lowercaseQuery))
  );
};

// Advanced search functionality
export const searchContent = async (query: string) => {
  if (!query) {
    return {
      products: [],
      recipes: [],
      faq: [],
    };
  }

  return {
    products: await searchProducts(query),
    recipes: await searchRecipes(query),
    faq: await searchFAQ(query),
  };
};

// Category helpers
export const getUniqueCategories = async (): Promise<string[]> => {
  const products = await loadProducts();
  const categories = products.map(p => p.category);
  return Array.from(new Set(categories));
};

export const getFAQCategories = async (): Promise<string[]> => {
  const faq = await loadFAQ();
  const categories = faq.map(f => f.category);
  return Array.from(new Set(categories));
};

// Recipe difficulty levels
export const getRecipeDifficulties = async (): Promise<string[]> => {
  const recipes = await loadRecipes();
  const difficulties = recipes.map(r => r.difficulty);
  return Array.from(new Set(difficulties));
};

// Product stats helpers
export const getProductStats = async () => {
  const products = await loadProducts();
  const recipes = await loadRecipes();
  const reviews = await loadReviews();
  
  return {
    totalProducts: products.length,
    totalRecipes: recipes.length,
    totalReviews: reviews.length,
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
  };
};