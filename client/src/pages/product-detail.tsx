import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Star, ShoppingCart, Share2, Heart, CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RecipeCard from "@/components/RecipeCard";
import ReviewCard from "@/components/ReviewCard";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { updateSEO, generateProductSEO } from "@/lib/seo";
import { insertJSONLD, generateProductSchema, generateRecipeSchema } from "@/lib/schema";
import { Product, Recipe, Review } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch product data
  const { data: product, isLoading: productLoading, error } = useQuery({
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

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/reviews", product?.id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${product.id}`);
      return response.json();
    },
    enabled: !!product?.id,
  });

  // SEO and structured data
  useEffect(() => {
    if (product) {
      const seoData = generateProductSEO(product);
      updateSEO(seoData);
      insertJSONLD(generateProductSchema(product, reviews));
    }
  }, [product, reviews]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      quantity: 1,
      sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),
    });
    
    toast({
      title: "장바구니 추가",
      description: `${product.name}이(가) 장바구니에 추가되었습니다.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `${product?.name} - ${product?.usp.join(", ")}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크 복사됨",
        description: "제품 링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-asran-bg" data-testid="page-product-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-2xl mb-4"></div>
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 h-20 w-20 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              <div className="bg-gray-200 h-12 rounded w-1/3"></div>
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-asran-bg flex items-center justify-center" data-testid="page-product-error">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">제품을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 제품이 존재하지 않거나 삭제되었습니다.</p>
          <Button onClick={() => history.back()}>이전 페이지로</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                data-testid="img-product-main"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-asran-amber" : "border-gray-200"
                    }`}
                    data-testid={`button-image-${index}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-asran-amber border-asran-amber">
                {product.category}
              </Badge>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={handleShare} data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-wishlist">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-4" data-testid="text-product-name">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-asran-amber mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? "fill-current" : "stroke-current"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-asran-gray mr-2">{product.rating}</span>
              <span className="text-gray-600">({product.reviewCount}개 리뷰)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-asran-gray" data-testid="text-price">
                ₩{product.price.toLocaleString()}
              </span>
              <p className="text-gray-600 mt-2">50,000원 이상 무료배송</p>
            </div>

            {/* USP Badges */}
            <div className="mb-6">
              <h3 className="font-semibold text-asran-gray mb-3">주요 특징</h3>
              <div className="flex flex-wrap gap-2">
                {product.usp.map((usp, index) => (
                  <Badge key={index} className="bg-asran-amber/10 text-asran-gray border-asran-amber">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {usp}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="bg-asran-amber hover:bg-yellow-500 text-asran-gray px-8 py-4 text-lg flex-1"
                data-testid="button-add-cart"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                장바구니 담기
              </Button>
              <Button
                variant="outline"
                className="border-asran-gray text-asran-gray hover:bg-asran-gray hover:text-white px-8 py-4 text-lg"
                data-testid="button-buy-now"
              >
                바로 구매
              </Button>
            </div>

            {/* Quick Specs */}
            {typeof product.specs === 'object' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-asran-gray mb-3">제품 사양</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600">{key}:</span>
                      <span className="ml-2 font-medium">
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="w-full" data-testid="product-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">상세정보</TabsTrigger>
            <TabsTrigger value="reviews">리뷰 ({reviews.length})</TabsTrigger>
            <TabsTrigger value="recipes">레시피 ({recipes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-8" data-testid="tab-details">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-asran-gray mb-6">제품 상세 정보</h3>
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {product.name}은(는) 독일의 정밀한 기술력으로 제작된 프리미엄 주방용품입니다. 
                    {product.usp.join(", ")} 등의 뛰어난 특징으로 완벽한 요리 경험을 제공합니다.
                  </p>

                  <h4 className="text-xl font-semibold text-asran-gray mb-4">주요 특징</h4>
                  <ul className="space-y-2 mb-6">
                    {product.usp.map((usp, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-asran-amber mr-2" />
                        <span>{usp}</span>
                      </li>
                    ))}
                  </ul>

                  {typeof product.specs === 'object' && (
                    <>
                      <h4 className="text-xl font-semibold text-asran-gray mb-4">상세 사양</h4>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(product.specs).map(([key, value]) => (
                            <div key={key}>
                              <dt className="font-medium text-gray-900">{key}</dt>
                              <dd className="text-gray-600">
                                {Array.isArray(value) ? value.join(", ") : String(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8" data-testid="tab-reviews">
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">아직 등록된 리뷰가 없습니다.</p>
                    <Button className="mt-4" data-testid="button-write-review">
                      첫 번째 리뷰 작성하기
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review: Review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-8" data-testid="tab-recipes">
            <div className="space-y-6">
              {recipes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">이 제품과 관련된 레시피가 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-asran-gray mb-4">
                      {product.name}(으)로 만드는 추천 레시피
                    </h3>
                    <p className="text-gray-600">
                      이 제품에 최적화된 레시피로 더욱 맛있는 요리를 만들어보세요
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {recipes.map((recipe: Recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onViewRecipe={setSelectedRecipe}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recipe Detail Modal */}
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-recipe">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-asran-gray">
                    {selectedRecipe.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center space-x-4 text-lg">
                    <Badge className="bg-green-100 text-green-800">
                      {selectedRecipe.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedRecipe.timeMinutes}분
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {selectedRecipe.servings}인분
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-asran-gray mb-3">재료</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-asran-amber mr-2" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-asran-gray mb-3">조리 과정</h4>
                    <ol className="space-y-3">
                      {selectedRecipe.steps.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-8 h-8 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.tips.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-asran-gray mb-3">요리 팁</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-asran-amber mr-2">💡</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-600">추천 제품</p>
                      <p className="font-medium text-asran-amber">{selectedRecipe.bestWith}</p>
                    </div>
                    <Button 
                      onClick={handleAddToCart}
                      className="bg-asran-amber hover:bg-yellow-500 text-asran-gray"
                      data-testid="button-recipe-add-cart"
                    >
                      이 레시피 장보기
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
