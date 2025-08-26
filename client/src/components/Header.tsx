import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import SearchBox from "./SearchBox";
import AsranLogo from "./AsranLogo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();

  const navigation = [
    { name: "제품", href: "/products", hasDropdown: true },
    { name: "레시피", href: "/blog" },
    { name: "브랜드 소개", href: "/about" },
    { name: "고객 후기", href: "/reviews" },
    { name: "고객센터", href: "/support" },
  ];

  const productCategories = [
    { name: "냄비 3종", href: "/products?category=냄비 3종 세트" },
    { name: "프라이팬", href: "/products?category=후라이팬" },
    { name: "칼, 도마", href: "/products?category=칼&도마" },
    { name: "압력솥", href: "/products?category=압력솥" },
    { name: "수저세트", href: "/products?category=수저세트" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location?.startsWith(href)) return true;
    return false;
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      className="bg-white shadow-sm border-b sticky top-0 z-50"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <AsranLogo width="120" height="30" className="h-8" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div key={item.name} className="relative group">
                  <button
                    className={`flex items-center transition-colors font-medium ${
                      isActive(item.href)
                        ? "text-asran-gray"
                        : "text-gray-600 hover:text-asran-amber"
                    }`}
                    onMouseEnter={() => setIsProductDropdownOpen(true)}
                    onMouseLeave={() => setIsProductDropdownOpen(false)}
                    data-testid={`button-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProductDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                      onMouseEnter={() => setIsProductDropdownOpen(true)}
                      onMouseLeave={() => setIsProductDropdownOpen(false)}
                    >
                      <Link
                        href="/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-asran-amber font-medium border-b border-gray-100"
                        onClick={() => setIsProductDropdownOpen(false)}
                      >
                        전체 제품 보기
                      </Link>
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-asran-amber"
                          onClick={() => setIsProductDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors font-medium ${
                    isActive(item.href)
                      ? "text-asran-gray"
                      : "text-gray-600 hover:text-asran-amber"
                  }`}
                  data-testid={`link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              {isSearchOpen ? (
                <SearchBox onClose={() => setIsSearchOpen(false)} />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  data-testid="button-search"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="sm:hidden">
                <Input
                  type="text"
                  placeholder="김치찌개, 파스타, 스테이크..."
                  className="w-full"
                  data-testid="input-mobile-search"
                />
              </div>

              {/* Mobile Navigation */}
              {navigation.map((item) => (
                item.hasDropdown ? (
                  <div key={item.name} className="space-y-2">
                    <Link
                      href={item.href}
                      className={`transition-colors font-medium block ${
                        isActive(item.href)
                          ? "text-asran-gray"
                          : "text-gray-600 hover:text-asran-amber"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid={`link-mobile-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-4 space-y-2">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="block text-sm text-gray-500 hover:text-asran-amber"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors font-medium ${
                      isActive(item.href)
                        ? "text-asran-gray"
                        : "text-gray-600 hover:text-asran-amber"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`link-mobile-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
