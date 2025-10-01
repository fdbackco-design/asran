import { Product, Recipe, Review } from "@shared/schema";

// SEO Meta Tags Generation
export function generateProductSEO(product: Product) {
  return {
    title: `${product.name} - ${product.category} | ASRAN`,
    description: `${product.name}: ${product.usp.join(", ")}. ₩${product.price.toLocaleString()}. ${product.reviewCount}개 리뷰 평균 ${product.rating}점. 무료배송.`,
    keywords: [
      product.name,
      product.category,
      ...product.usp,
      ...product.recipeTags,
      "독일 기술력",
      "주방용품",
      "인덕션",
    ].join(", "),
    openGraph: {
      title: `${product.name} | ASRAN`,
      description: `${product.usp.join(", ")} - ₩${product.price.toLocaleString()}`,
      image: product.images[0],
      type: "product",
    },
  };
}

export function generateRecipeSEO(recipe: Recipe) {
  return {
    title: `${recipe.title} 레시피 - ${recipe.difficulty} ${recipe.timeMinutes}분 | ASRAN`,
    description: `${recipe.title} 만들기: ${recipe.ingredients.slice(0, 5).join(", ")} 등으로 ${recipe.servings}인분, ${recipe.timeMinutes}분 소요. ${recipe.bestWith} 추천.`,
    keywords: [
      recipe.title,
      ...recipe.ingredients.slice(0, 10),
      recipe.difficulty,
      "레시피",
      "요리",
      recipe.bestWith,
    ].join(", "),
    openGraph: {
      title: `${recipe.title} | ASRAN 레시피`,
      description: `${recipe.difficulty} 난이도, ${recipe.timeMinutes}분, ${recipe.servings}인분`,
      type: "article",
    },
  };
}

export function generateHomeSEO() {
  return {
    title: "아스란(ASRAN) - 독일 기술력의 프리미엄 주방용품",
    description:
      "독일 기술력과 합리적 가격을 자랑하는 아스란 주방용품. 냄비 세트, 후라이팬, 압력솥으로 완벽한 요리를 경험하세요. 50,000원 이상 무료배송.",
    keywords:
      "아스란, ASRAN, 독일 주방용품, 냄비, 후라이팬, 압력솥, 인덕션 호환, 프리미엄 주방용품",
    openGraph: {
      title: "ASRAN - 독일 기술력의 프리미엄 주방용품",
      description: "독일 기술력과 합리적 가격의 완벽한 조합",
      image: "https://www.asrankitchen.com/asran-logo.png",
      type: "website",
      url: "https://www.asrankitchen.com",
    },
  };
}

// Update document head with SEO data
export function updateSEO(
  seoData: ReturnType<
    | typeof generateProductSEO
    | typeof generateRecipeSEO
    | typeof generateHomeSEO
  >,
) {
  // Update title
  document.title = seoData.title;

  // Update or create meta tags
  const updateMeta = (name: string, content: string, property = false) => {
    const attribute = property ? "property" : "name";
    let meta = document.querySelector(
      `meta[${attribute}="${name}"]`,
    ) as HTMLMetaElement;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }

    meta.content = content;
  };

  updateMeta("description", seoData.description);
  if ("keywords" in seoData) {
    updateMeta("keywords", seoData.keywords);
  }

  // Open Graph tags
  if (seoData.openGraph) {
    updateMeta("og:title", seoData.openGraph.title, true);
    updateMeta("og:description", seoData.openGraph.description, true);
    updateMeta("og:type", seoData.openGraph.type, true);
    updateMeta("og:site_name", "ASRAN", true);

    if ("image" in seoData.openGraph && seoData.openGraph.image) {
      updateMeta("og:image", seoData.openGraph.image, true);
      updateMeta("og:image:width", "1200", true);
      updateMeta("og:image:height", "630", true);
      updateMeta(
        "og:image:alt",
        "ASRAN - 독일 기술력의 프리미엄 주방용품",
        true,
      );
    }

    if ("url" in seoData.openGraph && seoData.openGraph.url) {
      updateMeta("og:url", seoData.openGraph.url, true);
    }
  }

  // 카카오톡 특화 메타 태그
  updateMeta("og:locale", "ko_KR", true);
}
