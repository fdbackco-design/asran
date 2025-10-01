import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
  showProduct?: boolean;
  className?: string;
}

export default function ReviewCard({
  review,
  showProduct = false,
  className,
}: ReviewCardProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <Card className={`${className}`} data-testid={`card-review-${review.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-asran-amber rounded-full flex items-center justify-center text-white font-bold">
            {review.author.charAt(0)}
          </div>
          <div className="ml-3">
            <p
              className="font-semibold text-asran-gray"
              data-testid={`text-author-${review.id}`}
            >
              {review.author}
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex text-asran-amber text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-current" : "stroke-current"
                    }`}
                  />
                ))}
              </div>
              <span
                className="text-sm text-gray-500"
                data-testid={`text-date-${review.id}`}
              >
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <img
              src={review.images[0]}
              alt="리뷰 이미지"
              className="w-full h-32 object-cover rounded-lg"
              data-testid={`img-review-${review.id}`}
            />
          </div>
        )}

        <p
          className="text-gray-700 mb-4"
          data-testid={`text-content-${review.id}`}
        >
          {review.content}
        </p>

        <div className="flex items-center justify-between">
          {showProduct && (
            <Badge
              variant="outline"
              className="text-asran-amber border-asran-amber"
            >
              {review.productId === "asran-pot-3set" && "아스란 냄비 3종 세트"}
              {review.productId === "asran-frypan-28" && "아스란 후라이팬 28cm"}
              {review.productId === "asran-pressure-24" && "아스란 압력솥 24cm"}
              {review.productId === "asran-knife-board-set" &&
                "아스란 칼 & 도마 세트"}
              {review.productId === "asran-cutlery-set" && "아스란 수저 세트"}
            </Badge>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-asran-amber"
              data-testid={`button-helpful-${review.id}`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              도움됨 {review.helpful}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
