import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { updateSEO } from "@/lib/seo";
import { Product } from "@shared/schema";
import {
  getAllProducts,
  searchProducts,
  getProductsByCategory,
} from "@/lib/dataClient";

export default function Products() {
  const [location] = useLocation();
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    if (categoryParam) setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
  }, [location]);

  // SEO setup
  useEffect(() => {
    const title = category
      ? `${category} - 아스란 주방용품 | ASRAN`
      : search
        ? `"${search}" 검색 결과 | ASRAN`
        : "모든 제품 - 아스란 주방용품 | ASRAN";

    const description = category
      ? `${category} 카테고리의 프리미엄 독일 주방용품을 만나보세요. 인덕션 호환, 무료배송.`
      : search
        ? `"${search}" 관련 아스란 주방용품 검색 결과입니다.`
        : "독일 기술력의 프리미엄 주방용품 전체 카탈로그. 냄비, 후라이팬, 압력솥 등 다양한 제품을 만나보세요.";

    updateSEO({
      title,
      description,
      keywords: `아스란, 주방용품, ${category}, ${search}`,
      openGraph: {
        title,
        description,
        type: "website",
      },
    });
  }, [category, search]);

  // Fetch all products
  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Filter products based on category and search
  const products = useMemo(() => {
    let filtered = allProducts;

    // Apply category filter
    if (category && category !== "전체") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.usp.some((u) => u.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  }, [allProducts, category, search]);

  // Sort products
  const sortedProducts = [...products].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "popular":
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const categories = [
    "냄비 3종 세트",
    "후라이팬",
    "압력솥",
    "칼&도마",
    "수저세트",
  ];

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl lg:text-4xl font-bold text-asran-gray mb-4"
            data-testid="page-title"
          >
            {category || (search ? `"${search}" 검색 결과` : "모든 제품")}
          </h1>
          {search && (
            <p className="text-lg text-gray-600">
              {products.length}개의 제품을 찾았습니다
            </p>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="모든 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <Input
                type="text"
                placeholder="제품명, 특징으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="rating">별점순</SelectItem>
                  <SelectItem value="reviews">리뷰순</SelectItem>
                  <SelectItem value="price-low">가격낮은순</SelectItem>
                  <SelectItem value="price-high">가격높은순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보기
              </label>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(category || search) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  활성 필터:
                </span>
                {category && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setCategory("")}
                    data-testid="badge-filter-category"
                  >
                    {category} ×
                  </Badge>
                )}
                {search && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearch("")}
                    data-testid="badge-filter-search"
                  >
                    "{search}" ×
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-4"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" data-testid="error-state">
            <p className="text-lg text-gray-600 mb-4">
              제품을 불러오는 중 오류가 발생했습니다.
            </p>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-lg text-gray-600 mb-4">
              {search || category
                ? "검색 조건에 맞는 제품을 찾을 수 없습니다."
                : "등록된 제품이 없습니다."}
            </p>
            <Button
              onClick={() => {
                setCategory("");
                setSearch("");
              }}
              data-testid="button-clear-filters"
            >
              필터 초기화
            </Button>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              data-testid="products-grid"
            >
              {sortedProducts.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-12 text-center text-gray-600">
              <p>{sortedProducts.length}개의 제품을 표시 중입니다</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
