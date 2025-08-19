import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema, insertFAQSchema, insertCartItemSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Recipes API
  app.get("/api/recipes", async (req, res) => {
    try {
      const { product, search } = req.query;
      
      let recipes;
      if (search) {
        recipes = await storage.searchRecipes(search as string);
      } else if (product) {
        recipes = await storage.getRecipesByProduct(product as string);
      } else {
        recipes = await storage.getAllRecipes();
      }
      
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await storage.getRecipeById(id);
      
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  });

  // Reviews API
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await storage.getReviewsByProduct(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // FAQ API
  app.get("/api/faq", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let faqItems;
      if (search) {
        faqItems = await storage.searchFAQ(search as string);
      } else if (category) {
        faqItems = await storage.getFAQByCategory(category as string);
      } else {
        faqItems = await storage.getAllFAQ();
      }
      
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ error: "Failed to fetch FAQ" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      const { sessionId, userId } = req.query;
      const cartItems = await storage.getCartItems(sessionId as string, userId as string);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const { sessionId, userId } = req.query;
      const success = await storage.clearCart(sessionId as string, userId as string);
      res.json({ success });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // CS Macro API for recipe suggestions
  app.post("/api/cs/suggestions", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      // Search for related recipes and FAQ
      const recipes = await storage.searchRecipes(query);
      const faqItems = await storage.searchFAQ(query);
      
      const suggestions = {
        recipes: recipes.slice(0, 3),
        faq: faqItems.slice(0, 2),
      };
      
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
