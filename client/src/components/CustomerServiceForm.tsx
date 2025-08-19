import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FormData {
  type: string;
  title: string;
  content: string;
  email?: string;
}

export default function CustomerServiceForm() {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    title: "",
    content: "",
    email: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get suggestions when content changes
  const { data: suggestions } = useQuery({
    queryKey: ["/api/cs/suggestions", formData.content],
    enabled: formData.content.length > 10 && formData.type === "레시피 문의",
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/cs/suggestions", {
        query: formData.content,
      });
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/cs/inquiry", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "문의 접수 완료",
        description: "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.",
      });
      setFormData({ type: "", title: "", content: "", email: "" });
      setShowSuggestions(false);
    },
    onError: () => {
      toast({
        title: "오류",
        description: "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title || !formData.content) {
      toast({
        title: "필수 항목 누락",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Show suggestions for recipe inquiries with sufficient content
    if (field === "content" && formData.type === "레시피 문의" && value.length > 10) {
      setShowSuggestions(true);
    } else if (field === "content" && value.length <= 10) {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card data-testid="cs-form">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-asran-gray">1:1 문의하기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="type">문의 유형 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateFormData("type", value)}
              >
                <SelectTrigger data-testid="select-inquiry-type">
                  <SelectValue placeholder="선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="제품 문의">제품 문의</SelectItem>
                  <SelectItem value="레시피 문의">레시피 문의</SelectItem>
                  <SelectItem value="배송 문의">배송 문의</SelectItem>
                  <SelectItem value="교환/환불">교환/환불</SelectItem>
                  <SelectItem value="사용법 문의">사용법 문의</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                placeholder="문의 제목을 입력해주세요"
                data-testid="input-title"
              />
            </div>

            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="답변 받을 이메일 주소"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="content">문의 내용 *</Label>
              <Textarea
                id="content"
                rows={5}
                value={formData.content}
                onChange={(e) => updateFormData("content", e.target.value)}
                placeholder="궁금한 점을 자세히 적어주세요. 레시피 관련 문의시 관련 레시피를 자동으로 추천해드립니다."
                data-testid="textarea-content"
              />
            </div>

            {/* Auto-suggestion Preview */}
            {showSuggestions && suggestions && (suggestions.recipes.length > 0 || suggestions.faq.length > 0) && (
              <Card className="bg-asran-amber/10 border-asran-amber" data-testid="suggestions-card">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-5 h-5 text-asran-amber mr-2" />
                    <h4 className="font-semibold text-asran-gray">💡 추천 답변</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    관련 레시피와 가이드를 먼저 확인해보세요:
                  </p>
                  <div className="space-y-2">
                    {suggestions.recipes.map((recipe: any) => (
                      <div key={recipe.id} className="text-sm text-asran-amber">
                        • {recipe.title} ({recipe.bestWith} 권장)
                      </div>
                    ))}
                    {suggestions.faq.map((faq: any) => (
                      <div key={faq.id} className="text-sm text-asran-amber">
                        • {faq.question}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              className="w-full bg-asran-amber hover:bg-yellow-500 text-asran-gray"
              disabled={submitMutation.isPending}
              data-testid="button-submit-inquiry"
            >
              {submitMutation.isPending ? "문의 중..." : "문의하기"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>평균 답변 시간</span>
              <span className="font-semibold text-asran-amber">2시간 이내</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
