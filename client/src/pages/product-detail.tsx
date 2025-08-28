import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Star, ShoppingCart, Check, Clock, Users, Heart, Truck, Shield, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCard from "@/components/RecipeCard";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { updateSEO, generateProductSEO } from "@/lib/seo";
import { Product, Recipe } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

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

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      quantity,
      sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),
    });
    
    toast({
      title: "장바구니 추가 완료",
      description: `${product.name}이(가) ${quantity}개 장바구니에 추가되었습니다.`,
    });
  };

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
                <div className="text-3xl font-bold text-asran-gray mb-2">
                  {product.price.toLocaleString()}원
                </div>
                <p className="text-sm text-gray-600 mb-4">부가세 포함 • 무료배송</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">수량:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-asran-amber hover:bg-yellow-500 text-asran-gray font-semibold py-3"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    장바구니 담기
                  </Button>
                  <Button variant="outline" className="px-6 border-asran-gray text-asran-gray hover:bg-asran-gray hover:text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-asran-amber mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">무료배송</p>
                  <p className="text-xs text-gray-500">5만원 이상</p>
                </div>
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
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-asran-gray mb-4">제품 사양</h3>
              <div className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium text-asran-gray">
                      {Array.isArray(value) ? value.join(", ") : value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-asran-gray mb-4">호환성</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.specs.compatible?.map((type: string) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </Card>
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

        {/* Customer Support */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-asran-gray mb-4">궁금한 점이 있으신가요?</h2>
          <p className="text-gray-600 mb-6">전문 상담사가 친절하게 안내해드립니다</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-asran-amber hover:bg-yellow-500 text-asran-gray">
              <Phone className="w-4 h-4 mr-2" />
              전화 상담: 1588-1234
            </Button>
            <Button variant="outline" className="border-asran-gray text-asran-gray hover:bg-asran-gray hover:text-white">
              온라인 문의하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}