import Fuse from "fuse.js";
import { Product, Recipe } from "@shared/schema";

// Search configuration
const productSearchOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "category", weight: 0.3 },
    { name: "usp", weight: 0.2 },
    { name: "recipeTags", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
};

const recipeSearchOptions = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "ingredients", weight: 0.3 },
    { name: "steps", weight: 0.2 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
};

// Search function for products and recipes
export async function searchContent(query: string) {
  try {
    // Fetch products and recipes data
    const [productsResponse, recipesResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/recipes"),
    ]);

    const [products, recipes] = await Promise.all([
      productsResponse.json(),
      recipesResponse.json(),
    ]);

    // Create Fuse instances
    const productFuse = new Fuse(products, productSearchOptions);
    const recipeFuse = new Fuse(recipes, recipeSearchOptions);

    // Perform searches
    const productResults = productFuse.search(query);
    const recipeResults = recipeFuse.search(query);

    return {
      products: productResults.map(result => result.item),
      recipes: recipeResults.map(result => result.item),
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      products: [],
      recipes: [],
    };
  }
}

// Search function specifically for FAQ
export async function searchFAQ(query: string) {
  try {
    const response = await fetch(`/api/faq?search=${encodeURIComponent(query)}`);
    const faqItems = await response.json();

    const fuse = new Fuse(faqItems, {
      keys: [
        { name: "question", weight: 0.5 },
        { name: "answer", weight: 0.3 },
        { name: "tags", weight: 0.2 },
      ],
      threshold: 0.3,
      includeScore: true,
    });

    return fuse.search(query).map(result => result.item);
  } catch (error) {
    console.error("FAQ search error:", error);
    return [];
  }
}
