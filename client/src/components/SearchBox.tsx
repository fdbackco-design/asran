import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { searchContent } from "@/lib/search";

interface SearchBoxProps {
  onClose?: () => void;
  className?: string;
}

export default function SearchBox({ onClose, className }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/search", query],
    enabled: query.length > 2,
    queryFn: () => searchContent(query),
  });

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleResultClick = (type: string, id: string) => {
    if (type === "product") {
      setLocation(`/products/${id}`);
    } else if (type === "recipe") {
      setLocation(`/blog?recipe=${id}`);
    }
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className={`relative ${className}`} data-testid="search-box">
      <div className="relative">
        <Input
          type="text"
          placeholder="압력솥, 냄비..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          className="w-64 pl-10 pr-4 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
          data-testid="input-search"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-1 top-1 h-6 w-6 p-0"
            data-testid="button-close-search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length > 2 && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-4 shadow-lg z-50 bg-white" data-testid="search-results">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">검색 중...</div>
          ) : searchResults && (searchResults.products.length > 0 || searchResults.recipes.length > 0) ? (
            <div className="space-y-4">
              {/* Product Results */}
              {searchResults.products.length > 0 && (
                <div>
                  <h4 className="font-semibold text-asran-gray mb-2">제품</h4>
                  <div className="space-y-2">
                    {searchResults.products.slice(0, 3).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick("product", product.slug)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                        data-testid={`result-product-${product.slug}`}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Results */}
              {searchResults.recipes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-asran-gray mb-2">레시피</h4>
                  <div className="space-y-2">
                    {searchResults.recipes.slice(0, 3).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleResultClick("recipe", recipe.id)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                        data-testid={`result-recipe-${recipe.id}`}
                      >
                        <div className="font-medium">{recipe.title}</div>
                        <div className="text-sm text-gray-500">
                          {recipe.difficulty} • {recipe.timeMinutes}분
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Results */}
              <div className="border-t pt-2">
                <Button
                  variant="ghost"
                  onClick={() => handleSearch(query)}
                  className="w-full text-asran-amber"
                  data-testid="button-view-all-results"
                >
                  모든 검색 결과 보기
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500" data-testid="no-results">
              검색 결과가 없습니다
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
