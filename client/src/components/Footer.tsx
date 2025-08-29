import { Link } from "wouter";

import AsranLogo from "./AsranLogo";

export default function Footer() {
  return (
    <footer className="bg-asran-gray text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <AsranLogo width="150" height="36" className="h-9" />
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              독일의 정밀한 기술력과 합리적인 가격으로<br />
              모든 가정에 완벽한 요리 경험을 선사합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">빠른 링크</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-asran-amber transition-colors">
                  제품 카탈로그
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-asran-amber transition-colors">
                  레시피 모음
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-asran-amber transition-colors">
                  브랜드 스토리
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-asran-amber transition-colors">
                  고객 후기
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  사용 가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">고객 서비스</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  배송 정보
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  교환/환불
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  1:1 문의
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-asran-amber transition-colors">
                  A/S 신청
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2024 ASRAN. 모든 권리 보유.</p>
              <p className="mt-1">사업자등록번호: 123-45-67890 | 통신판매업신고번호: 2024-서울강남-1234</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-asran-amber transition-colors">
                개인정보처리방침
              </Link>
              <Link href="#" className="hover:text-asran-amber transition-colors">
                이용약관
              </Link>
              <Link href="#" className="hover:text-asran-amber transition-colors">
                입점문의
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
