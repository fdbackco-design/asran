import { useEffect } from "react";
import { Link } from "wouter";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { updateSEO } from "@/lib/seo";

export default function Cart() {
  const { items, isLoading, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    updateSEO({
      title: "장바구니 - 아슬란 주방용품 | ASRAN",
      description: "선택하신 아슬란 주방용품을 확인하고 주문하세요. 50,000원 이상 무료배송.",
      keywords: "장바구니, 주문, 아슬란, 주방용품, 무료배송",
    });
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      toast({
        title: "상품 삭제",
        description: "장바구니에서 상품이 삭제되었습니다.",
      });
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "상품 삭제",
      description: "장바구니에서 상품이 삭제되었습니다.",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "장바구니 비우기",
      description: "장바구니가 비워졌습니다.",
    });
  };

  const shippingCost = totalPrice >= 50000 ? 0 : 3000;
  const finalTotal = totalPrice + shippingCost;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-asran-bg" data-testid="page-cart-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 h-8 rounded w-1/4"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-cart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-4" data-testid="page-title">
            장바구니
          </h1>
          <p className="text-lg text-gray-600">
            선택하신 상품들을 확인하고 주문을 진행하세요
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <Card className="text-center py-16" data-testid="empty-cart">
            <CardContent>
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-bold text-asran-gray mb-4">장바구니가 비어있습니다</h2>
              <p className="text-gray-600 mb-8">
                아슬란의 프리미엄 주방용품을 담아보세요
              </p>
              <Link href="/products">
                <Button className="bg-asran-amber hover:bg-yellow-500 text-asran-gray px-8 py-4 text-lg" data-testid="button-shop-now">
                  제품 둘러보기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold text-asran-gray">
                    상품 목록 ({totalItems}개)
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700"
                    data-testid="button-clear-cart"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    전체 삭제
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product?.images?.[0] || "/placeholder-product.jpg"}
                          alt={item.product?.name || "상품"}
                          className="w-20 h-20 object-cover rounded-lg"
                          data-testid={`img-cart-item-${item.id}`}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-asran-gray" data-testid={`text-item-name-${item.id}`}>
                          {item.product?.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.product?.category}</p>
                        
                        {/* USP Badges */}
                        {item.product?.usp && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.product.usp.slice(0, 2).map((usp, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {usp}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-asran-gray" data-testid={`text-item-total-${item.id}`}>
                          ₩{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₩{(item.product?.price || 0).toLocaleString()} × {item.quantity}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">배송 정보</span>
                    <div className="text-right">
                      {shippingCost === 0 ? (
                        <div className="text-asran-amber font-semibold">무료배송</div>
                      ) : (
                        <div>
                          <div className="text-gray-600">배송비: ₩{shippingCost.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            ₩{(50000 - totalPrice).toLocaleString()} 더 주문하면 무료배송
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-asran-gray">주문 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">상품 금액</span>
                      <span data-testid="text-subtotal">₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">배송비</span>
                      <span data-testid="text-shipping">
                        {shippingCost === 0 ? (
                          <span className="text-asran-amber font-semibold">무료</span>
                        ) : (
                          `₩${shippingCost.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-asran-gray">총 결제 금액</span>
                      <span className="text-asran-gray" data-testid="text-total">
                        ₩{finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {shippingCost > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">무료배송까지</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-asran-amber h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((totalPrice / 50000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-asran-amber">
                        ₩{(50000 - totalPrice).toLocaleString()} 더 주문하세요!
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button 
                        className="w-full bg-asran-amber hover:bg-yellow-500 text-asran-gray py-4 text-lg"
                        data-testid="button-checkout"
                      >
                        주문하기
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                        계속 쇼핑하기
                      </Button>
                    </Link>
                  </div>

                  {/* Benefits */}
                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-asran-amber rounded-full mr-2"></div>
                      <span>30일 무조건 교환/환불</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-asran-amber rounded-full mr-2"></div>
                      <span>안전한 결제 시스템</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-asran-amber rounded-full mr-2"></div>
                      <span>품질보증 A/S 서비스</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
