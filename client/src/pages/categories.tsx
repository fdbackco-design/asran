import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { updateSEO } from "@/lib/seo";

export default function Categories() {
  useEffect(() => {
    updateSEO({
      title: "제품 카테고리 - 아슬란 주방용품 | ASRAN",
      description:
        "독일 기술력의 프리미엄 주방용품을 카테고리별로 만나보세요. 냄비 3종 세트, 프라이팬, 칼&도마, 압력솥, 수저세트.",
      keywords:
        "아슬란, 주방용품, 카테고리, 냄비, 프라이팬, 압력솥, 칼, 도마, 수저세트",
      openGraph: {
        title: "제품 카테고리 - 아슬란 주방용품",
        description:
          "독일 기술력의 프리미엄 주방용품을 카테고리별로 만나보세요.",
        type: "website",
      },
    });
  }, []);

  const categories = [
    {
      id: "pot-sets",
      name: "냄비 3종",
      description: "독일 기술력으로 완성된 프리미엄 냄비 세트",
      features: ["3중 바닥구조", "인덕션 호환", "균일한 열전도"],
      image: "/pot/title.jpeg",
      category: "냄비 3종 세트",
      productSlug: "asran-pot-3set",
      productCount: 1,
    },
    {
      id: "frying-pans",
      name: "프라이팬",
      description: "논스틱 코팅과 튼튼한 내구성을 자랑하는 프라이팬",
      features: ["세라믹 논스틱", "긁힘 방지", "고온 조리 가능"],
      image:
        "https://images.unsplash.com/photo-1556909045-4d394c0e6ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "후라이팬",
      productSlug: "asran-frypan-28",
      productCount: 1,
    },
    {
      id: "knife-cutting-board",
      name: "칼, 도마",
      description: "전문가 수준의 칼과 위생적인 도마 세트",
      features: ["독일강 재질", "인체공학적 손잡이", "항균 도마"],
      image:
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "칼&도마",
      productSlug: "asran-knife-board-set",
      productCount: 1,
    },
    {
      id: "pressure-cookers",
      name: "압력솥",
      description: "빠르고 안전한 조리를 위한 고품질 압력솥",
      features: ["다중 안전장치", "빠른 조리", "영양소 보존"],
      image: "/pressure/cut.jpeg",
      category: "압력솥",
      productSlug: "asran-pressure-24",
      productCount: 1,
    },
    {
      id: "cutlery-sets",
      name: "수저세트",
      description: "고급스러운 스테인리스 스틸 수저 세트",
      features: ["316 스테인리스", "세련된 디자인", "식기세척기 호환"],
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "수저세트",
      productSlug: "asran-cutlery-set",
      productCount: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-categories">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1
            className="text-4xl lg:text-5xl font-bold text-asran-gray mb-6"
            data-testid="page-title"
          >
            제품 소개
          </h1>
          <div className="w-24 h-1 bg-asran-amber mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            혁신적인 기술과 디자인을 바탕으로 한 FeedBack의 저희 브랜드들을
            소개합니다.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            각 브랜드는 고유한 가치와 비전을 가지고 고객에게 최고의 경험을
            제공합니다.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-asran-gray text-center mb-12">
            ASRAN 제품 카테고리
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                data-testid={`card-category-${category.id}`}
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-asran-gray">
                    {category.productCount}개 제품
                  </div>
                </div>

                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-asran-gray mb-3 group-hover:text-asran-amber transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {category.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="w-1.5 h-1.5 bg-asran-amber rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/products/${category.productSlug}`}
                  >
                    <Button
                      className="w-full bg-asran-amber hover:bg-yellow-500 text-asran-gray font-medium transition-colors group"
                      data-testid={`button-view-${category.id}`}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      제품 보기
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h3 className="text-2xl font-bold text-asran-gray mb-4">
            독일 기술력의 프리미엄 주방용품을 만나보세요
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            ASRAN의 모든 제품은 엄격한 품질 기준과 독일의 전통적인 제조 기술을
            바탕으로 만들어집니다. 당신의 주방을 더욱 특별하게 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                className="bg-asran-amber hover:bg-yellow-500 text-asran-gray font-semibold px-8 py-3"
                data-testid="button-all-products"
              >
                전체 제품 보기
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-asran-gray text-asran-gray hover:bg-asran-gray hover:text-white px-8 py-3"
                data-testid="button-recipes"
              >
                레시피 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
