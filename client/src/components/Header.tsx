import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import SearchBox from "./SearchBox";
import AsranLogo from "./AsranLogo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();
  const { items } = useCart();

  const navigation = [
    { name: "제품", href: "/products" },
    { name: "레시피", href: "/blog" },
    { name: "브랜드 소개", href: "/about" },
    { name: "고객 후기", href: "/reviews" },
    { name: "고객센터", href: "/support" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location?.startsWith(href)) return true;
    return false;
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <AsranLogo width="120" height="30" className="h-8" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
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

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" data-testid="button-cart">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-asran-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    data-testid="text-cart-count"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
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
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
