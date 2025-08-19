import { Product, Recipe, Review } from "@shared/schema";

// Schema.org structured data generation
export function generateProductSchema(product: Product, reviews?: Review[]) {
  const aggregateRating = reviews?.length ? {
    "@type": "AggregateRating",
    "ratingValue": product.rating,
    "reviewCount": product.reviewCount,
  } : undefined;

  const reviewSchemas = reviews?.slice(0, 5).map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author,
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
    },
    "reviewBody": review.content,
    "datePublished": review.createdAt,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": `${product.name} - ${product.usp.join(", ")}`,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "ASRAN",
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "ASRAN",
      },
    },
    "aggregateRating": aggregateRating,
    "review": reviewSchemas,
    "category": product.category,
    "additionalProperty": product.usp.map(usp => ({
      "@type": "PropertyValue",
      "name": "특징",
      "value": usp,
    })),
  };
}

export function generateRecipeSchema(recipe: Recipe, relatedProducts?: Product[]) {
  const recipeIngredients = recipe.ingredients.map(ingredient => ({
    "@type": "RecipeIngredient",
    "text": ingredient,
  }));

  const recipeInstructions = recipe.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "text": step,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "description": `${recipe.title} - ${recipe.difficulty} 난이도, ${recipe.timeMinutes}분 소요`,
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipeInstructions,
    "totalTime": `PT${recipe.timeMinutes}M`,
    "recipeYield": `${recipe.servings}인분`,
    "cookingMethod": recipe.bestWith,
    "recipeCuisine": "Korean",
    "keywords": recipe.title,
    "author": {
      "@type": "Organization",
      "name": "ASRAN",
    },
    "nutrition": {
      "@type": "NutritionInformation",
      "servingSize": `${recipe.servings}인분`,
    },
    "tool": relatedProducts?.map(product => ({
      "@type": "HowToTool",
      "name": product.name,
    })),
    "tips": recipe.tips,
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASRAN",
    "description": "독일 기술력의 프리미엄 주방용품 브랜드",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-2-1234-5678",
      "contactType": "Customer Service",
      "availableLanguage": ["Korean", "English"],
    },
    "sameAs": [
      "https://www.instagram.com/asran_official",
      "https://www.facebook.com/asran.kitchen",
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressLocality": "Seoul",
    },
  };
}

// Insert JSON-LD script into document head
export function insertJSONLD(schema: any) {
  if (typeof window === 'undefined') return;

  // Remove existing JSON-LD script
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Create new JSON-LD script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
