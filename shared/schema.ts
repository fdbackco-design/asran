import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  slug: text("slug").notNull().unique(),
  price: integer("price").notNull(),
  usp: jsonb("usp").$type<string[]>().notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  specs: jsonb("specs").notNull(),
  recipeTags: jsonb("recipe_tags").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  suitableProducts: jsonb("suitable_products").$type<string[]>().notNull(),
  bestWith: text("best_with").notNull(),
  difficulty: text("difficulty").notNull(),
  timeMinutes: integer("time_minutes").notNull(),
  servings: integer("servings").notNull(),
  ingredients: jsonb("ingredients").$type<string[]>().notNull(),
  steps: jsonb("steps").$type<string[]>().notNull(),
  tips: jsonb("tips").$type<string[]>().notNull(),
  schema: text("schema").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: text("product_id").notNull(),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  images: jsonb("images").$type<string[]>(),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faq = pgTable("faq", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  category: text("category").notNull(),
  helpful: integer("helpful").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});


export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products);
export const insertRecipeSchema = createInsertSchema(recipes);
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertFAQSchema = createInsertSchema(faq).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type FAQ = typeof faq.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertFAQ = z.infer<typeof insertFAQSchema>;
