import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Search, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import CustomerServiceForm from "@/components/CustomerServiceForm";
import { updateSEO } from "@/lib/seo";
import { searchFAQ } from "@/lib/search";
import { FAQ } from "@shared/schema";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    updateSEO({
      title: "고객센터 - FAQ와 1:1 문의 | ASRAN",
      description: "아슬란 제품 사용법, 배송, 교환/환불 등 자주 묻는 질문과 1:1 문의 서비스를 제공합니다.",
      keywords: "아슬란 고객센터, FAQ, 문의하기, 사용법, 배송, 교환, 환불",
    });
  }, []);

  // Fetch FAQ data
  const { data: allFAQ = [], isLoading } = useQuery({
    queryKey: ["/api/faq"],
  });

  // Search FAQ
  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/faq/search", searchQuery],
    queryFn: () => searchFAQ(searchQuery),
    enabled: searchQuery.length > 2,
  });

  // Filter FAQ by category and search
  const filteredFAQ = searchQuery.length > 2 
    ? searchResults
    : allFAQ.filter((faq: FAQ) => 
        selectedCategory === "all" || faq.category === selectedCategory
      );

  const categories = [
    { id: "all", name: "전체", count: allFAQ.length },
    { id: "사용법", name: "사용법", count: allFAQ.filter((f: FAQ) => f.category === "사용법").length },
    { id: "관리법", name: "관리법", count: allFAQ.filter((f: FAQ) => f.category === "관리법").length },
    { id: "배송/반품", name: "배송/반품", count: allFAQ.filter((f: FAQ) => f.category === "배송/반품").length },
  ];

  const toggleFAQ = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-support">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">고객센터</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            궁금한 점이 있으시다면 FAQ를 먼저 확인해보시거나, 1:1 문의를 통해 도움을 받으세요
          </p>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Phone className="w-12 h-12 text-asran-amber mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-asran-gray mb-2">전화 문의</h3>
              <p className="text-gray-600 mb-2">02-1234-5678</p>
              <p className="text-sm text-gray-500">평일 9:00-18:00</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <MessageCircle className="w-12 h-12 text-asran-amber mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-asran-gray mb-2">1:1 문의</h3>
              <p className="text-gray-600 mb-2">온라인 문의</p>
              <p className="text-sm text-gray-500">평균 2시간 내 답변</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Mail className="w-12 h-12 text-asran-amber mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-asran-gray mb-2">이메일 문의</h3>
              <p className="text-gray-600 mb-2">support@asran.co.kr</p>
              <p className="text-sm text-gray-500">평일 24시간 내 답변</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-asran-gray flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  자주 묻는 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-6">
                  <Input
                    type="text"
                    placeholder="궁금한 내용을 검색해보세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-faq-search"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={selectedCategory === category.id ? "bg-asran-amber hover:bg-yellow-500 text-asran-gray" : ""}
                      data-testid={`button-category-${category.id}`}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>

                {/* FAQ List */}
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse border rounded-lg p-4">
                        <div className="bg-gray-200 h-6 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredFAQ.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-faq-results">
                    <p className="text-gray-600 mb-4">
                      {searchQuery.length > 2 
                        ? "검색 결과가 없습니다."
                        : "해당 카테고리에 FAQ가 없습니다."
                      }
                    </p>
                    {searchQuery.length > 2 && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery("")}
                        data-testid="button-clear-search"
                      >
                        검색 초기화
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="faq-list">
                    {filteredFAQ.map((faq: FAQ) => (
                      <Collapsible
                        key={faq.id}
                        open={openItems.has(faq.id)}
                        onOpenChange={() => toggleFAQ(faq.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-4 border rounded-lg hover:bg-gray-50 h-auto"
                            data-testid={`button-faq-${faq.id}`}
                          >
                            <div className="text-left">
                              <div className="flex items-center mb-1">
                                <span className="font-semibold text-asran-gray">{faq.question}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {faq.category}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>도움됨 {faq.helpful}</span>
                                <div className="flex space-x-1">
                                  {faq.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {openItems.has(faq.id) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex space-x-1">
                                {faq.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-asran-amber hover:text-yellow-600"
                                data-testid={`button-helpful-${faq.id}`}
                              >
                                도움됨 {faq.helpful}
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer Service Form */}
          <div>
            <CustomerServiceForm />

            {/* Operating Hours */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-asran-gray flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  운영 시간
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">평일</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">토요일</span>
                  <span className="font-medium">09:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일요일/공휴일</span>
                  <span className="font-medium text-red-600">휴무</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    점심시간: 12:00 - 13:00<br />
                    1:1 문의는 24시간 접수 가능하며, 순차적으로 답변드립니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
