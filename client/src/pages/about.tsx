import { useEffect } from "react";
import { CheckCircle, Award, Globe, Users, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateSEO } from "@/lib/seo";

export default function About() {
  useEffect(() => {
    updateSEO({
      title: "브랜드 소개 - 독일 기술력의 아슬란 | ASRAN",
      description: "독일의 정밀한 기술력과 합리적인 가격의 완벽한 조합. 아슬란의 브랜드 스토리와 철학을 만나보세요.",
      keywords: "아슬란, ASRAN, 브랜드, 독일 기술력, 주방용품 제조, 품질 관리",
    });
  }, []);

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-about">
      {/* Hero Section */}
      <section className="relative asran-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" data-testid="hero-title">
              독일 기술력의 <span className="text-asran-amber">아슬란</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              정밀함과 실용성을 추구하는 독일 엔지니어링 철학으로<br />
              모든 가정에 완벽한 요리 경험을 선사합니다
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 lg:py-24" data-testid="brand-story-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">브랜드 스토리</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  2010년 독일 뒤셀도르프에서 시작된 아슬란(ASRAN)은 "Advanced Steel Rational Application"의 줄임말로,
                  첨단 스틸 기술의 합리적 적용이라는 의미를 담고 있습니다.
                </p>
                <p>
                  독일의 정밀한 제조 기술과 한국인의 요리 문화를 깊이 연구하여, 
                  기능성과 디자인을 모두 만족시키는 프리미엄 주방용품을 개발해왔습니다.
                </p>
                <p>
                  우리는 단순히 제품을 판매하는 것이 아닌, 요리하는 즐거움과 
                  가족과 함께하는 소중한 시간을 만들어가는 파트너가 되고자 합니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="독일 아슬란 공장"
                className="w-full h-auto rounded-2xl shadow-2xl"
                data-testid="brand-story-image"
              />
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-asran-gray">Since 2010</p>
                <p className="text-xs text-gray-600">Made in Germany</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-gray-50" data-testid="core-values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">핵심 가치</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              아슬란이 추구하는 4가지 핵심 가치로 최고의 주방용품을 만들어갑니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "독일 기술력",
                description: "정밀한 독일 엔지니어링과 최고급 소재로 제작된 프리미엄 품질",
                color: "text-blue-600"
              },
              {
                icon: Heart,
                title: "건강한 요리",
                description: "안전한 소재와 친환경 코팅으로 가족의 건강을 생각하는 제품",
                color: "text-red-600"
              },
              {
                icon: Globe,
                title: "합리적 가격",
                description: "최고의 품질을 합리적인 가격으로 모든 가정에서 만날 수 있도록",
                color: "text-green-600"
              },
              {
                icon: Users,
                title: "사용자 중심",
                description: "실제 사용자의 니즈를 반영한 실용적이고 편리한 디자인",
                color: "text-purple-600"
              }
            ].map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <value.icon className={`w-16 h-16 mx-auto mb-4 ${value.color}`} />
                  <h3 className="text-xl font-bold text-asran-gray mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-16 lg:py-24" data-testid="manufacturing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">제조 과정</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              독일의 엄격한 품질 기준과 첨단 기술로 만들어지는 아슬란 제품의 제조 과정
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "소재 선별",
                description: "독일산 SUS410 스테인리스 스틸을 비롯한 최고급 원자재만을 엄선합니다.",
                features: ["독일산 프리미엄 스틸", "친환경 인증 소재", "내식성 테스트 통과"]
              },
              {
                step: "02", 
                title: "정밀 가공",
                description: "독일 최첨단 CNC 장비와 레이저 커팅 기술로 정밀하게 가공합니다.",
                features: ["±0.1mm 정밀도", "레이저 커팅", "3중 바닥 구조"]
              },
              {
                step: "03",
                title: "표면 처리",
                description: "특수 코팅과 폴리싱 공정을 통해 내구성과 미관을 동시에 확보합니다.",
                features: ["세라믹 논스틱 코팅", "미러 폴리싱", "스크래치 방지"]
              },
              {
                step: "04",
                title: "품질 검사",
                description: "독일 TÜV 인증 기준에 따른 31가지 품질 검사를 실시합니다.",
                features: ["열전도 테스트", "내구성 검사", "안전성 인증"]
              }
            ].map((process, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-8">
                <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl font-bold text-asran-amber mr-4">{process.step}</span>
                    <h3 className="text-2xl font-bold text-asran-gray">{process.title}</h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">{process.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {process.features.map((feature, idx) => (
                      <Badge key={idx} className="bg-asran-amber/10 text-asran-gray border-asran-amber">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <img
                    src={`/brand/${index + 1}.jpg`}
                    alt={`제조 과정 ${process.step} - ${process.title}`}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 lg:py-24 bg-gray-50" data-testid="quality-standards-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">품질 기준</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              국제 인증과 엄격한 품질 관리로 안전하고 신뢰할 수 있는 제품을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "안전 인증",
                certifications: ["TÜV SÜD 인증", "CE 마크", "ISO 9001", "FDA 승인"],
                description: "유럽과 미국의 엄격한 안전 기준을 모두 충족"
              },
              {
                icon: Award,
                title: "품질 인증",
                certifications: ["독일 품질 인증", "LFGB 테스트", "PFOA Free", "BPA Free"],
                description: "독일 현지 품질 기준과 식품 안전 규격 통과"
              },
              {
                icon: Globe,
                title: "환경 인증",
                certifications: ["REACH 규정", "RoHS 지침", "재활용 가능", "친환경 포장"],
                description: "환경을 생각하는 지속가능한 제품 개발"
              }
            ].map((standard, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <standard.icon className="w-16 h-16 mx-auto mb-4 text-asran-amber" />
                  <h3 className="text-xl font-bold text-asran-gray mb-4">{standard.title}</h3>
                  <div className="space-y-2 mb-4">
                    {standard.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="block w-full text-center">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 lg:py-24" data-testid="company-info-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">회사 정보</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                label: "설립년도",
                value: "2010년"
              },
              {
                label: "본사 위치",
                value: "독일 뒤셀도르프"
              },
              {
                label: "한국 지사",
                value: "서울특별시 강남구"
              },
              {
                label: "직원 수",
                value: "180명"
              },
              {
                label: "제품 라인",
                value: "5개 카테고리"
              },
              {
                label: "연간 생산량",
                value: "50만개"
              },
              {
                label: "품질 인증",
                value: "12개 국제 인증"
              },
              {
                label: "고객 만족도",
                value: "93.7%"
              }
            ].map((info, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-asran-amber mb-2">{info.value}</div>
                <div className="text-gray-600">{info.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}