import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CheckCircle, Star, Clock, Users, ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import RecipeCard from "@/components/RecipeCard";
import ReviewCard from "@/components/ReviewCard";
import { updateSEO, generateHomeSEO } from "@/lib/seo";
import { insertJSONLD, generateOrganizationSchema } from "@/lib/schema";
import { Product, Recipe, Review } from "@shared/schema";
import { getAllProducts, getAllRecipes, getAllReviews } from "@/lib/dataClient";

export default function Home() {
  // Fetch data for homepage
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });

  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
  });

  // SEO setup
  useEffect(() => {
    const seoData = generateHomeSEO();
    updateSEO(seoData);
    insertJSONLD(generateOrganizationSchema());
  }, []);

  // Get featured content
  const featuredProducts = products.slice(0, 3);
  const featuredRecipes = recipes.slice(0, 3);
  const featuredReviews = allReviews.slice(0, 3);

  // Calculate review statistics
  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0,
        ) / allReviews.length
      : 4.87;
  const totalReviews = allReviews.length || 523;
  const satisfactionRate = 93.7;

  return (
    <div className="min-h-screen" data-testid="page-home">
      {/* Hero Section */}
      <section className="relative" data-testid="hero-section">
        <img
          src="/asranbanner1.png"
          alt="아슬란 주방용품"
          className="w-full h-auto"
          data-testid="hero-image"
        />
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-32">
          <Link href="/products/asran-pot-3set">
            <Button
              className="bg-asran-amber hover:bg-yellow-500 text-asran-gray px-2 py-1 text-[10px] h-6 text-xs sm:px-8 sm:py-4 sm:text-lg sm:h-auto font-semibold shadow-lg"
              data-testid="button-view-pot-set"
            >
              제품 보러가기
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Categories */}
      <section
        className="py-8 sm:py-12 lg:py-24"
        data-testid="product-categories-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-asran-gray mb-4 sm:mb-6 px-4">
              프리미엄 주방용품 컬렉션
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              독일 기술력으로 제작된 아슬란의 주방용품으로 요리의 새로운 차원을
              경험하세요
            </p>
          </div>

          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/categories">
              <Button
                className="bg-asran-gray hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                data-testid="button-view-all-products"
              >
                모든 제품 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recipe Integration */}
      <section
        className="py-8 sm:py-12 lg:py-24 bg-gray-50"
        data-testid="recipe-integration-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-asran-gray mb-4 sm:mb-6 px-4">
              레시피와 함께하는 완벽한 요리
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              각 제품에 최적화된 레시피로 누구나 쉽게 맛있는 요리를 만들 수
              있습니다
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {recipesLoading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-white rounded-2xl p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="bg-gray-200 h-4 rounded mb-2"></div>
                          <div className="bg-gray-200 h-6 rounded mb-2"></div>
                          <div className="bg-gray-200 h-4 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {featuredRecipes.map((recipe: Recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-asran-gray mb-4 sm:mb-6">
                    레시피 검색하기
                  </h3>

                  <div className="relative mb-4 sm:mb-6">
                    <Input
                      type="text"
                      placeholder="요리명, 재료, 조리법을 검색하세요..."
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl text-sm sm:text-lg"
                      data-testid="input-recipe-search"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const query = e.currentTarget.value.trim();
                          if (query) {
                            window.location.href = `/blog?search=${encodeURIComponent(query)}`;
                          }
                        }
                      }}
                    />
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 absolute left-3 sm:left-4 top-3 sm:top-4" />
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">인기 검색어</p>
                    <div className="flex flex-wrap gap-2">
                      {["김치찌개", "파스타", "갈비찜", "스테이크"].map(
                        (tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            className="hover:bg-asran-amber hover:text-white hover:border-asran-amber"
                            data-testid={`button-tag-${tag}`}
                            onClick={() => {
                              window.location.href = `/blog?search=${encodeURIComponent(tag)}`;
                            }}
                          >
                            #{tag}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-asran-amber">
                        {recipes.length || 247}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">전체 레시피</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-asran-amber">
                        초급-중급
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">평균 난이도</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Preview */}
      <section className="py-8 sm:py-12 lg:py-24" data-testid="reviews-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-asran-gray mb-4 sm:mb-6 px-4">
              고객들의 진솔한 후기
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              실제 사용하신 고객들의 생생한 후기와 요리 사진을 확인해보세요
            </p>
          </div>

          {/* Rating Overview */}
          <Card className="mb-8 sm:mb-12">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-asran-amber mb-2">
                    {averageRating.toFixed(2)}
                  </div>
                  <div className="flex justify-center text-asran-amber mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">전체 평균 별점</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {totalReviews}개 리뷰 기준
                  </p>
                </div>

                <div>
                  <div className="space-y-1 sm:space-y-2">
                    {[
                      { stars: 5, percentage: 78 },
                      { stars: 4, percentage: 16 },
                      { stars: 3, percentage: 4 },
                      { stars: 2, percentage: 1 },
                      { stars: 1, percentage: 1 },
                    ].map(({ stars, percentage }) => (
                      <div key={stars} className="flex items-center">
                        <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">
                          {stars}★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 mx-2 sm:mx-3">
                          <div
                            className="bg-asran-amber h-1.5 sm:h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 w-8 sm:w-12">
                          {percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-asran-gray mb-2 sm:mb-3 text-sm sm:text-base">
                    고객 만족 키워드
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {[
                      "가벼움",
                      "인덕션호환",
                      "균등가열",
                      "내구성",
                      "세척편의",
                    ].map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="text-xs"
                      >
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Reviews */}
          {reviewsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="bg-gray-200 h-4 rounded mb-1"></div>
                      <div className="bg-gray-200 h-3 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-gray-200 h-20 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.map((review: Review) => (
                <ReviewCard key={review.id} review={review} showProduct />
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Link href="/reviews">
              <Button
                className="bg-asran-gray hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                data-testid="button-view-all-reviews"
              >
                모든 후기 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
