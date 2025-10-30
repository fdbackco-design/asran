import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import CustomerServiceForm from "@/components/CustomerServiceForm";
import { updateSEO } from "@/lib/seo";
import { FAQ } from "@shared/schema";
import { getAllFAQ, searchFAQ } from "@/lib/dataClient";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    updateSEO({
      title: "고객센터 - FAQ와 1:1 문의 | ASRAN",
      description:
        "아스란 제품 사용법, 배송, 교환/환불 등 자주 묻는 질문과 1:1 문의 서비스를 제공합니다.",
      keywords: "아스란 고객센터, FAQ, 문의하기, 사용법, 배송, 교환, 환불",
    });
  }, []);

  // Fetch FAQ data
  const { data: allFAQ = [], isLoading } = useQuery({
    queryKey: ["faq"],
    queryFn: getAllFAQ,
  });

  // Search FAQ
  const { data: searchResults = [] } = useQuery({
    queryKey: ["faq", "search", searchQuery],
    queryFn: () => searchFAQ(searchQuery),
    enabled: searchQuery.length > 2,
  });

  // Filter FAQ by category and search
  const filteredFAQ =
    searchQuery.length > 2
      ? searchResults
      : allFAQ.filter(
          (faq: FAQ) =>
            selectedCategory === "all" || faq.category === selectedCategory,
        );

  const categories = [
    { id: "all", name: "전체", count: allFAQ.length },
    {
      id: "사용법",
      name: "사용법",
      count: allFAQ.filter((f: FAQ) => f.category === "사용법").length,
    },
    {
      id: "관리법",
      name: "관리법",
      count: allFAQ.filter((f: FAQ) => f.category === "관리법").length,
    },
    {
      id: "배송/반품",
      name: "배송/반품",
      count: allFAQ.filter((f: FAQ) => f.category === "배송/반품").length,
    },
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
        {/* Customer Service Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {/* ✅ 배경 이미지 */}
          <img
            src="/build.jpg" // 배경 이미지 경로 (public/assets에 저장)
            alt="ASRAN A/S Center"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* ✅ 반투명 오버레이 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

          {/* ✅ 콘텐츠 영역 */}
          <div className="relative z-10 text-center text-white py-16 px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              고객 지원 안내
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              아래 연락처로 빠르게 도와드리겠습니다.
            </p>

            {/* Customer Service Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center mb-10">
              {/* 제품 고장·불량 관련 CS */}
              <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-asran-amber mr-2" />
                  <span className="text-2xl font-bold text-white tracking-wide">
                    고객센터 (A/S)
                  </span>
                </div>
                <span className="text-3xl font-bold text-white">
                  031-429-8570
                </span>
                <p className="text-white/70 mt-2 text-sm text-center leading-relaxed">
                  제품 고장 및 불량 문의는 <br /> 고객센터로 연락 부탁드립니다.
                </p>
              </div>

              {/* B2B 문의 */}
              <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-asran-amber mr-2" />
                  <span className="text-2xl font-bold text-white tracking-wide">
                    B2B 납품 문의
                  </span>
                </div>
                <span className="text-3xl font-bold text-white">
                  070-8211-1761
                </span>

                <div className="mt-2 text-sm text-white/80">
                  담당자:{" "}
                  <span className="font-medium text-white">손성훈 이사</span>
                </div>
                <a
                  href="mailto:fdbackteams@gmail.com"
                  className="text-white underline text-sm mt-1"
                >
                  fdbackteams@gmail.com
                </a>
                <p className="text-white/70 mt-2 text-sm text-center leading-relaxed">
                  대량 구매 및 납품 문의는 <br /> 담당자에게 연락 부탁드립니다.
                </p>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="text-white/90 mb-8">
              <div className="text-lg font-medium">
                운영시간 : AM 10:00 ~ PM 18:00
              </div>
              <div className="text-base text-white/70 mt-1">
                점심시간 PM 12:30 ~ PM 13:30
              </div>
            </div>

            {/* CTA Button */}
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
              A/S 센터 자세히 보기
            </Button>
          </div>

          {/* 아래 그라디언트 여백 */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* FAQ Section */}
        <div className="w-full">
          <div className="w-full">
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
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={
                        selectedCategory === category.id
                          ? "bg-asran-amber hover:bg-yellow-500 text-asran-gray"
                          : ""
                      }
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
                      <div
                        key={i}
                        className="animate-pulse border rounded-lg p-4"
                      >
                        <div className="bg-gray-200 h-6 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredFAQ.length === 0 ? (
                  <div
                    className="text-center py-8"
                    data-testid="no-faq-results"
                  >
                    <p className="text-gray-600 mb-4">
                      {searchQuery.length > 2
                        ? "검색 결과가 없습니다."
                        : "해당 카테고리에 FAQ가 없습니다."}
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
                                <span className="font-semibold text-asran-gray">
                                  {faq.question}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {faq.category}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>도움됨 {faq.helpful}</span>
                                <div className="flex space-x-1">
                                  {faq.tags.slice(0, 2).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs"
                                    >
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
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
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
        </div>
      </div>
    </div>
  );
}
