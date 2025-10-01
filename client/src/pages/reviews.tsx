import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Filter, Camera, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReviewCard from "@/components/ReviewCard";
import { updateSEO } from "@/lib/seo";
import { Product, Review } from "@shared/schema";
import { getAllProducts, getAllReviews } from "@/lib/dataClient";

export default function Reviews() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [showPhotosOnly, setShowPhotosOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    updateSEO({
      title: "고객 후기 - 아스란 주방용품 | ASRAN",
      description:
        "아스란 주방용품을 실제 사용하신 고객들의 진솔한 후기와 평점을 확인해보세요. 평균 4.87점의 높은 만족도.",
      keywords: "아스란 후기, 고객 리뷰, 주방용품 평점, 사용 후기, 별점",
    });
  }, []);

  // Fetch all products for filter
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // Fetch all reviews
  const { data: allReviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
  });

  // Filter and sort reviews
  const filteredReviews = allReviews
    .filter((review: Review) => {
      if (selectedProduct !== "all" && review.productId !== selectedProduct)
        return false;
      if (
        selectedRating !== "all" &&
        review.rating !== parseInt(selectedRating)
      )
        return false;
      if (showPhotosOnly && (!review.images || review.images.length === 0))
        return false;
      return true;
    })
    .sort((a: Review, b: Review) => {
      switch (sortBy) {
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  // Calculate review statistics
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0,
        ) / totalReviews
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = allReviews.filter(
      (review: Review) => review.rating === rating,
    ).length;
    return {
      rating,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  const photoReviewsCount = allReviews.filter(
    (review: Review) => review.images && review.images.length > 0,
  ).length;

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">
            고객 후기
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            아스란 제품을 실제 사용하신 고객들의 생생한 후기를 확인해보세요
          </p>
        </div>

        {/* Review Statistics */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Overall Rating */}
              <div className="text-center">
                <div
                  className="text-5xl font-bold text-asran-amber mb-2"
                  data-testid="average-rating"
                >
                  {averageRating.toFixed(2)}
                </div>
                <div className="flex justify-center text-asran-amber mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(averageRating) ? "fill-current" : "stroke-current"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">전체 평균 별점</p>
                <p
                  className="text-sm text-gray-500 mt-1"
                  data-testid="total-reviews"
                >
                  {totalReviews}개 리뷰 기준
                </p>
              </div>

              {/* Rating Distribution */}
              <div>
                <h4 className="font-semibold text-asran-gray mb-4">
                  별점 분포
                </h4>
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">
                        {rating}★
                      </span>
                      <Progress
                        value={percentage}
                        className="flex-1 mx-3 h-2"
                      />
                      <span className="text-sm text-gray-600 w-12">
                        {Math.round(percentage)}%
                      </span>
                      <span className="text-sm text-gray-500 w-12">
                        ({count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className="font-semibold text-asran-gray mb-4">
                  리뷰 통계
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">포토 리뷰</span>
                    <span className="font-semibold text-asran-gray">
                      {photoReviewsCount}개 (
                      {Math.round((photoReviewsCount / totalReviews) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">평균 도움됨</span>
                    <span className="font-semibold text-asran-gray">
                      {Math.round(
                        allReviews.reduce(
                          (sum: number, r: Review) => sum + r.helpful,
                          0,
                        ) / totalReviews,
                      )}
                      개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">만족도</span>
                    <span className="font-semibold text-asran-amber">
                      {Math.round(
                        (allReviews.filter((r: Review) => r.rating >= 4)
                          .length /
                          totalReviews) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              {/* Product Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품
                </label>
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger data-testid="select-product-filter">
                    <SelectValue placeholder="모든 제품" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 제품</SelectItem>
                    {products.map((product: Product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  별점
                </label>
                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger data-testid="select-rating-filter">
                    <SelectValue placeholder="모든 별점" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 별점</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5점)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4점)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3점)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2점)</SelectItem>
                    <SelectItem value="1">⭐ (1점)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Photo Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포토 리뷰
                </label>
                <Button
                  variant={showPhotosOnly ? "default" : "outline"}
                  onClick={() => setShowPhotosOnly(!showPhotosOnly)}
                  className="w-full justify-start"
                  data-testid="button-photo-filter"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  포토만 보기
                </Button>
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
                    <SelectItem value="recent">최신순</SelectItem>
                    <SelectItem value="rating-high">별점 높은순</SelectItem>
                    <SelectItem value="rating-low">별점 낮은순</SelectItem>
                    <SelectItem value="helpful">도움됨 순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct("all");
                    setSelectedRating("all");
                    setShowPhotosOnly(false);
                    setSortBy("recent");
                  }}
                  className="w-full"
                  data-testid="button-clear-filters"
                >
                  필터 초기화
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedProduct !== "all" ||
              selectedRating !== "all" ||
              showPhotosOnly) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">
                    활성 필터:
                  </span>
                  {selectedProduct !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer">
                      {
                        products.find((p: Product) => p.id === selectedProduct)
                          ?.name
                      }{" "}
                      ×
                    </Badge>
                  )}
                  {selectedRating !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer">
                      {selectedRating}점 ×
                    </Badge>
                  )}
                  {showPhotosOnly && (
                    <Badge variant="secondary" className="cursor-pointer">
                      포토 리뷰 ×
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews List */}
        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="bg-gray-200 h-4 rounded mb-1"></div>
                      <div className="bg-gray-200 h-3 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-gray-200 h-20 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center" data-testid="no-reviews">
              <div className="text-gray-400 mb-4">
                <Star className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                조건에 맞는 리뷰가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                다른 조건으로 검색해보시거나 필터를 초기화해보세요
              </p>
              <Button
                onClick={() => {
                  setSelectedProduct("all");
                  setSelectedRating("all");
                  setShowPhotosOnly(false);
                }}
                data-testid="button-reset-filters"
              >
                필터 초기화
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 text-gray-600">
              <p>{filteredReviews.length}개의 리뷰를 찾았습니다</p>
            </div>

            {/* Reviews Grid */}
            <div className="grid gap-6" data-testid="reviews-list">
              {filteredReviews.map((review: Review) => (
                <ReviewCard key={review.id} review={review} showProduct />
              ))}
            </div>

            {/* Load More */}
            {filteredReviews.length >= 20 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  data-testid="button-load-more"
                >
                  더 많은 리뷰 보기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
