import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CreditCard, Truck, Shield, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { updateSEO } from "@/lib/seo";

interface OrderForm {
  // Customer Info
  name: string;
  email: string;
  phone: string;
  
  // Shipping Address
  zipCode: string;
  address: string;
  detailAddress: string;
  
  // Payment Info
  paymentMethod: string;
  
  // Order Notes
  orderNotes: string;
  
  // Agreements
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    paymentMethod: "",
    orderNotes: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  useEffect(() => {
    updateSEO({
      title: "주문/결제 - 아슬란 주방용품 | ASRAN",
      description: "아슬란 주방용품 주문을 완료하세요. 안전한 결제 시스템과 빠른 배송 서비스를 제공합니다.",
      keywords: "주문, 결제, 아슬란, 주방용품, 안전결제, 배송",
    });
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      setLocation("/cart");
    }
  }, [items, setLocation]);

  const shippingCost = totalPrice >= 50000 ? 0 : 3000;
  const finalTotal = totalPrice + shippingCost;

  const updateForm = (field: keyof OrderForm, value: string | boolean) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      'name', 'email', 'phone', 'zipCode', 'address', 'paymentMethod'
    ] as (keyof OrderForm)[];
    
    for (const field of required) {
      if (!orderForm[field]) {
        toast({
          title: "필수 정보 누락",
          description: "모든 필수 항목을 입력해주세요.",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!orderForm.agreeTerms || !orderForm.agreePrivacy) {
      toast({
        title: "약관 동의 필요",
        description: "필수 약관에 동의해주세요.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      toast({
        title: "주문 완료",
        description: "주문이 성공적으로 완료되었습니다. 확인 이메일을 발송해드렸습니다.",
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "주문 실패",
        description: "주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-checkout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/cart")}
            className="mb-4"
            data-testid="button-back-to-cart"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            장바구니로 돌아가기
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-4" data-testid="page-title">
            주문/결제
          </h1>
          <p className="text-lg text-gray-600">
            주문 정보를 입력하고 결제를 완료하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-6 h-6 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  주문자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      value={orderForm.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="홍길동"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">휴대폰 번호 *</Label>
                    <Input
                      id="phone"
                      value={orderForm.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="010-1234-5678"
                      data-testid="input-phone"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderForm.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="example@email.com"
                    data-testid="input-email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-6 h-6 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  배송지 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">우편번호 *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="zipCode"
                        value={orderForm.zipCode}
                        onChange={(e) => updateForm('zipCode', e.target.value)}
                        placeholder="12345"
                        data-testid="input-zipcode"
                      />
                      <Button variant="outline" data-testid="button-find-address">
                        주소 찾기
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={orderForm.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="서울시 강남구 테헤란로 123"
                    data-testid="input-address"
                  />
                </div>
                <div>
                  <Label htmlFor="detailAddress">상세주소</Label>
                  <Input
                    id="detailAddress"
                    value={orderForm.detailAddress}
                    onChange={(e) => updateForm('detailAddress', e.target.value)}
                    placeholder="상세주소를 입력하세요"
                    data-testid="input-detail-address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-6 h-6 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  결제 방법
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={orderForm.paymentMethod} onValueChange={(value) => updateForm('paymentMethod', value)}>
                  <SelectTrigger data-testid="select-payment-method">
                    <SelectValue placeholder="결제 방법을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">신용/체크카드</SelectItem>
                    <SelectItem value="bank-transfer">계좌이체</SelectItem>
                    <SelectItem value="virtual-account">가상계좌</SelectItem>
                    <SelectItem value="phone-payment">휴대폰결제</SelectItem>
                    <SelectItem value="kakao-pay">카카오페이</SelectItem>
                    <SelectItem value="naver-pay">네이버페이</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-6 h-6 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  배송 요청사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderForm.orderNotes}
                  onChange={(e) => updateForm('orderNotes', e.target.value)}
                  placeholder="배송 시 요청사항이 있으시면 입력해주세요"
                  rows={3}
                  data-testid="textarea-order-notes"
                />
              </CardContent>
            </Card>

            {/* Agreements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-6 h-6 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  약관 동의
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree-terms"
                    checked={orderForm.agreeTerms}
                    onCheckedChange={(checked) => updateForm('agreeTerms', checked as boolean)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="agree-terms" className="text-sm">
                    이용약관에 동의합니다 (필수)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree-privacy"
                    checked={orderForm.agreePrivacy}
                    onCheckedChange={(checked) => updateForm('agreePrivacy', checked as boolean)}
                    data-testid="checkbox-privacy"
                  />
                  <Label htmlFor="agree-privacy" className="text-sm">
                    개인정보 수집 및 이용에 동의합니다 (필수)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree-marketing"
                    checked={orderForm.agreeMarketing}
                    onCheckedChange={(checked) => updateForm('agreeMarketing', checked as boolean)}
                    data-testid="checkbox-marketing"
                  />
                  <Label htmlFor="agree-marketing" className="text-sm">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
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
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3" data-testid={`checkout-item-${item.id}`}>
                      <img
                        src={item.product?.images?.[0] || "/placeholder-product.jpg"}
                        alt={item.product?.name || "상품"}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.product?.name}</div>
                        <div className="text-xs text-gray-500">수량: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium">
                        ₩{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상품 금액</span>
                    <span data-testid="text-checkout-subtotal">₩{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">배송비</span>
                    <span data-testid="text-checkout-shipping">
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
                    <span className="text-asran-gray" data-testid="text-checkout-total">
                      ₩{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full bg-asran-amber hover:bg-yellow-500 text-asran-gray py-4 text-lg"
                  data-testid="button-submit-order"
                >
                  {isSubmitting ? (
                    "주문 처리 중..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      ₩{finalTotal.toLocaleString()} 결제하기
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 mr-2 text-asran-amber" />
                    <span>SSL 보안 결제</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2 text-asran-amber" />
                    <span>2-3일 내 배송</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 mr-2 text-asran-amber" />
                    <span>30일 무조건 교환/환불</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
