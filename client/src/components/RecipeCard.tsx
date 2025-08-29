import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe?: (recipe: Recipe) => void;
  className?: string;
}

export default function RecipeCard({ recipe, onViewRecipe, className }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "초급":
        return "bg-green-100 text-green-800";
      case "중급":
        return "bg-yellow-100 text-yellow-800";
      case "고급":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={`hover:shadow-xl transition-shadow cursor-pointer ${className}`} data-testid={`card-recipe-${recipe.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Recipe Image */}
          <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-asran-amber/10 rounded-xl flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-asran-amber" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getDifficultyColor(recipe.difficulty)} data-testid={`badge-difficulty-${recipe.id}`}>
                {recipe.difficulty}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span data-testid={`text-time-${recipe.id}`}>{recipe.timeMinutes}분</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span data-testid={`text-servings-${recipe.id}`}>{recipe.servings}인분</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-asran-gray mb-2" data-testid={`text-recipe-title-${recipe.id}`}>
              {recipe.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3" data-testid={`text-recipe-ingredients-${recipe.id}`}>
              주재료: {recipe.ingredients.slice(0, 3).join(", ")}
              {recipe.ingredients.length > 3 && " 외"}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-asran-amber font-medium" data-testid={`text-best-with-${recipe.id}`}>
                {recipe.bestWith}
              </span>
              {onViewRecipe && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRecipe(recipe)}
                  className="text-asran-amber hover:text-yellow-600"
                  data-testid={`button-view-recipe-${recipe.id}`}
                >
                  레시피 보기 →
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
