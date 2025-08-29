import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Clock, Users, ChefHat, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecipeCard from "@/components/RecipeCard";
import { updateSEO } from "@/lib/seo";
import { insertJSONLD, generateRecipeSchema } from "@/lib/schema";
import { searchContent } from "@/lib/search";
import { Recipe, Product } from "@shared/schema";

export default function Blog() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const searchParam = params.get('search');
    const recipeParam = params.get('recipe');
    
    if (searchParam) setSearchQuery(searchParam);
    if (recipeParam) {
      // Find and open specific recipe
      // This would be implemented when recipe detail is needed
    }
  }, [location]);

  useEffect(() => {
    const title = searchQuery 
      ? `"${searchQuery}" 레시피 검색 결과 | ASRAN`
      : "레시피 & 요리팁 - 아슬란 주방용품 | ASRAN";
    
    const description = searchQuery
      ? `"${searchQuery}" 관련 레시피와 요리팁을 아슬란 주방용품으로 만나보세요.`
      : "아슬란 주방용품으로 만드는 다양한 레시피와 요리팁. 초급부터 고급까지 난이도별 요리법을 제공합니다.";

    updateSEO({ title, description, keywords: `아슬란 레시피, 요리법, 주방용품 활용, ${searchQuery}` });
  }, [searchQuery]);

  // Fetch recipes
  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["/api/recipes"],
  });

  // Fetch products for filter
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Search recipes when query exists
  const { data: searchResults } = useQuery({
    queryKey: ["/api/search", searchQuery],
    queryFn: () => searchContent(searchQuery),
    enabled: searchQuery.length > 2,
  });

  // Filter and sort recipes
  const filteredRecipes = (searchQuery.length > 2 ? searchResults?.recipes || [] : recipes)
    .filter((recipe: Recipe) => {
      if (selectedDifficulty !== "all" && recipe.difficulty !== selectedDifficulty) return false;
      if (selectedProduct !== "all" && !recipe.suitableProducts.includes(selectedProduct)) return false;
      return true;
    })
    .sort((a: Recipe, b: Recipe) => {
      switch (sortBy) {
        case "time-short":
          return a.timeMinutes - b.timeMinutes;
        case "time-long":
          return b.timeMinutes - a.timeMinutes;
        case "difficulty":
          const difficultyOrder = { "초급": 1, "중급": 2, "고급": 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        case "servings":
          return b.servings - a.servings;
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const difficulties = ["초급", "중급", "고급"];

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    
    // Update SEO for recipe
    const seoData = {
      title: `${recipe.title} 레시피 | ASRAN`,
      description: `${recipe.title} - ${recipe.difficulty} 난이도, ${recipe.timeMinutes}분 소요. ${recipe.ingredients.slice(0, 5).join(", ")} 등으로 ${recipe.servings}인분.`,
      keywords: `${recipe.title}, 레시피, ${recipe.difficulty}, ${recipe.bestWith}`,
    };
    updateSEO(seoData);
    
    // Add recipe structured data
    const relatedProducts = products.filter((product: Product) => 
      recipe.suitableProducts.includes(product.id)
    );
    insertJSONLD(generateRecipeSchema(recipe, relatedProducts));
  };

  return (
    <div className="min-h-screen bg-asran-bg" data-testid="page-blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-asran-gray mb-6">
            {searchQuery ? `"${searchQuery}" 레시피 검색 결과` : "레시피 & 요리팁"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            아슬란 주방용품으로 만드는 다양한 레시피와 요리팁을 만나보세요
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="레시피명, 재료, 요리법으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-3"
                data-testid="input-recipe-search"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger data-testid="select-difficulty">
                    <SelectValue placeholder="모든 난이도" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 난이도</SelectItem>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추천 제품</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger data-testid="select-product">
                    <SelectValue placeholder="모든 제품" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 제품</SelectItem>
                    {products.map((product: Product) => (
                      <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">최신순</SelectItem>
                    <SelectItem value="difficulty">난이도순</SelectItem>
                    <SelectItem value="time-short">시간 짧은순</SelectItem>
                    <SelectItem value="time-long">시간 긴순</SelectItem>
                    <SelectItem value="servings">인분순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDifficulty("all");
                    setSelectedProduct("all");
                    setSortBy("recent");
                  }}
                  className="w-full"
                  data-testid="button-clear-filters"
                >
                  필터 초기화
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedDifficulty !== "all" || selectedProduct !== "all") && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">활성 필터:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="cursor-pointer">
                      "{searchQuery}" ×
                    </Badge>
                  )}
                  {selectedDifficulty !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer">
                      {selectedDifficulty} ×
                    </Badge>
                  )}
                  {selectedProduct !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer">
                      {products.find((p: Product) => p.id === selectedProduct)?.name} ×
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipe Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-asran-amber mb-2">{filteredRecipes.length}</div>
              <div className="text-gray-600">레시피</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-asran-amber mb-2">
                {Math.round(filteredRecipes.reduce((sum: number, r: Recipe) => sum + r.timeMinutes, 0) / filteredRecipes.length || 0)}분
              </div>
              <div className="text-gray-600">평균 조리시간</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-asran-amber mb-2">
                {Math.round(filteredRecipes.reduce((sum: number, r: Recipe) => sum + r.servings, 0) / filteredRecipes.length || 0)}인분
              </div>
              <div className="text-gray-600">평균 인분</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-asran-amber mb-2">
                {filteredRecipes.filter((r: Recipe) => r.difficulty === "초급").length}
              </div>
              <div className="text-gray-600">초급 레시피</div>
            </CardContent>
          </Card>
        </div>

        {/* Recipes Grid */}
        {recipesLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-6 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center" data-testid="no-recipes">
              <ChefHat className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">조건에 맞는 레시피가 없습니다</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? "다른 키워드로 검색해보시거나 필터를 조정해보세요"
                  : "선택한 조건을 변경해보세요"
                }
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDifficulty("all");
                  setSelectedProduct("all");
                }}
                data-testid="button-reset-search"
              >
                검색 초기화
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              <p>{filteredRecipes.length}개의 레시피를 찾았습니다</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="recipes-grid">
              {filteredRecipes.map((recipe: Recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={handleRecipeClick}
                />
              ))}
            </div>
          </>
        )}

        {/* Recipe Detail Modal */}
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-recipe-detail">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-asran-gray">
                    {selectedRecipe.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center space-x-4 text-lg">
                    <Badge className={
                      selectedRecipe.difficulty === "초급" ? "bg-green-100 text-green-800" :
                      selectedRecipe.difficulty === "중급" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {selectedRecipe.difficulty}
                    </Badge>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedRecipe.timeMinutes}분
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {selectedRecipe.servings}인분
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-asran-gray mb-3">재료</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-asran-amber rounded-full mr-2"></div>
                          <span>{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-asran-gray mb-3">조리 과정</h4>
                    <ol className="space-y-3">
                      {selectedRecipe.steps.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-8 h-8 bg-asran-amber text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.tips.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-asran-gray mb-3">요리 팁</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-asran-amber mr-2">💡</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">추천 제품</p>
                        <p className="font-medium text-asran-amber">{selectedRecipe.bestWith}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="bg-asran-amber hover:bg-yellow-500 text-asran-gray" data-testid="button-view-products">
                          추천 제품 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
