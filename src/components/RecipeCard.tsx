import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@heroui/react/card";
import { Clock } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

type RecipeCardProps = {
  readonly _id: string;
  readonly name: string;
  readonly image: string;
  readonly preparationTime: number;
  readonly difficulty: "Easy" | "Medium" | "Hard";
};

const difficultyConfig = {
  Easy: { label: "Fácil", class: "bg-emerald-50 text-emerald-600" },
  Medium: { label: "Media", class: "bg-amber-50 text-amber-600" },
  Hard: { label: "Difícil", class: "bg-rose-50 text-rose-600" },
};

export default function RecipeCard({ _id, name, image, preparationTime, difficulty }: RecipeCardProps) {
  const config = difficultyConfig[difficulty];

  return (
    <div className="relative group">
      <Link href={`/recipes/${_id}`}>
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100/50 overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <CardContent className="pb-1 pt-3">
            <CardTitle className="text-base font-semibold truncate">{name}</CardTitle>
          </CardContent>
          <CardFooter className="flex items-center justify-between pt-0 pb-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              {preparationTime} min
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${config.class}`}>
              {config.label}
            </span>
          </CardFooter>
        </Card>
      </Link>
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton recipeId={_id} />
      </div>
    </div>
  );
}
