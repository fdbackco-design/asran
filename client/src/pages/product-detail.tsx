import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Star, Check, Clock, Users, Heart, Truck, Shield, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/RecipeCard";
import { updateSEO, generateProductSEO } from "@/lib/seo";
import { Product, Recipe } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["/api/products", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: !!slug,
  });

  // Fetch related recipes
  const { data: recipes = [] } = useQuery({
    queryKey: ["/api/recipes", product?.id],
    queryFn: async () => {
      const response = await fetch(`/api/recipes?product=${product.id}`);
      return response.json();
    },
    enabled: !!product?.id,
  });

  useEffect(() => {
    if (product) {
      const seoData = generateProductSEO(product);
      updateSEO(seoData);
    }
  }, [product]);


  if (productLoading) {
    return (
      <div className="min-h-screen bg-asran-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-asran-amber mx-auto mb-4"></div>
          <p className="text-gray-600">제품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-asran-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">제품을 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 제품이 존재하지 않거나 더 이상 판매되지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="page-product-detail">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl p-8 shadow-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0] || "https://via.placeholder.com/600x600?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-asran-amber' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-asran-amber text-asran-gray">{product.category}</Badge>
                <h1 className="text-4xl font-bold text-asran-gray mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">({product.reviewCount}개 리뷰)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-asran-gray">제품 특징</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.usp.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-asran-gray mb-4">더 많은 제품 특징</h3>
                <div className="grid grid-cols-1 gap-4">
                  {product.usp.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-asran-gray">{feature}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {index === 0 && "최고급 독일 기술로 제작된 프리미엄 품질"}
                          {index === 1 && "뛰어난 열전도와 보온성을 자랑하는 3중 구조"}
                          {index === 2 && "모든 종류의 쿡탑에서 사용 가능"}
                          {index === 3 && "사용과 보관이 편리한 경량 설계"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-asran-amber mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">품질보증</p>
                  <p className="text-xs text-gray-500">2년 A/S</p>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 text-asran-amber mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">독일 기술</p>
                  <p className="text-xs text-gray-500">프리미엄 품질</p>
                </div>
                <div className="text-center">
                  <Check className="w-6 h-6 text-asran-amber mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">안전 인증</p>
                  <p className="text-xs text-gray-500">KC 인증 완료</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Product Specifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-asran-gray text-center mb-12">제품 상세 정보</h2>
          
          {/* Detail Image */}
          <div className="mb-12">
            <img
              src="/pot/detail.png"
              alt="제품 상세 정보"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          
        </div>

        {/* Recipe Recommendations */}
        {recipes.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-asran-gray text-center mb-4">추천 레시피</h2>
            <p className="text-gray-600 text-center mb-12">이 제품으로 만들 수 있는 맛있는 요리들</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.slice(0, 6).map((recipe: Recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-asran-gray">{recipe.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.timeMinutes}분</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{recipe.servings}인분</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        주재료: {recipe.ingredients.slice(0, 3).join(", ")}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}