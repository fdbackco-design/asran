import { Link } from "wouter";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {


  return (
    <Card className={`group cursor-pointer hover:shadow-2xl asran-hover-lift ${className}`} data-testid={`card-product-${product.slug}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${product.slug}`}
          />
          {/* Bestseller Badge */}
          {product.reviewCount > 400 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-asran-amber text-asran-gray" data-testid="badge-bestseller">
                베스트셀러
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-asran-gray mb-2" data-testid={`text-product-name-${product.slug}`}>
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4" data-testid={`text-product-category-${product.slug}`}>
            {product.category}
          </p>
          
          {/* USP Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.usp.slice(0, 2).map((usp, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {usp}
              </Badge>
            ))}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-asran-amber mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "fill-current" : "stroke-current"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600" data-testid={`text-rating-${product.slug}`}>
              {product.rating} ({product.reviewCount}개 리뷰)
            </span>
          </div>
          
          </CardContent>
      </Link>
    </Card>
  );
}
