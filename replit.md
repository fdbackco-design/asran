# Overview

This is a modern full-stack e-commerce web application for ASRAN, a German kitchenware brand. The application features a React frontend with Express backend, showcasing premium kitchen products with integrated recipes, customer reviews, and progressive web app capabilities. Built with TypeScript and modern web technologies, it provides a comprehensive shopping experience with SEO optimization and structured data support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and development server
- **Routing**: Wouter for client-side routing with pages for home, products, product details, blog (recipes), reviews, support, cart, and checkout
- **State Management**: TanStack React Query for server state management and custom React Context for cart functionality
- **UI Library**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **PWA Support**: Service worker implementation with manifest.json for progressive web app capabilities and offline functionality

## Backend Architecture
- **Framework**: Express.js with TypeScript for type safety
- **Data Layer**: Drizzle ORM with PostgreSQL database schema definitions, but currently using in-memory storage with JSON data files as fallback
- **API Design**: RESTful endpoints for products, recipes, reviews, FAQ, cart management, and customer service
- **Development Setup**: Vite middleware integration for seamless development experience with hot module replacement

## Database Design
- **Schema**: Well-structured PostgreSQL schema with tables for users, products, recipes, reviews, FAQ, and cart items
- **Relationships**: Foreign key relationships between products and reviews, recipes linked to suitable products
- **Data Types**: JSON columns for flexible data like product specifications, recipe ingredients, and user-generated content

## SEO and Performance
- **SEO Optimization**: Dynamic meta tag generation, Open Graph protocol support, and structured data (Schema.org) for products and recipes
- **Search Functionality**: Fuse.js integration for fuzzy search across products, recipes, and FAQ content
- **Caching Strategy**: Service worker caching for static assets and API responses with cache-first strategy for better performance

## External Dependencies

- **Database**: PostgreSQL with Neon serverless database (@neondatabase/serverless)
- **Search**: Fuse.js for client-side fuzzy search functionality
- **UI Components**: Extensive Radix UI component library for accessible, unstyled components
- **Validation**: Zod for schema validation and type-safe data handling
- **Styling**: Tailwind CSS with custom design tokens and shadcn/ui component system
- **Development Tools**: TypeScript, ESLint, Prettier for code quality and consistency
- **Image Hosting**: External image services (Unsplash, Pixabay) for product and recipe imagery