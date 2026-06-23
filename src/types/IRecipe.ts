export interface IRecipe {
  _id?: string;
  name: string;
  image: string;
  preparationTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
  servings: number;
}