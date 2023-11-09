import { star, bookOpen, arrowDownOnSquare } from "solid-heroicons/solid"
import { Recipe as MelaRecipe } from "./recipe-decoder"

export class Recipe {
    id: string
    data: MelaRecipe
    folders: RecipeFolder[]

    get source(): URL | undefined {
        if (this.data.link) return new URL(this.data.link)
    }

    constructor(recipe: MelaRecipe, folders: RecipeFolder[] = []) {
        this.id = recipe.id
        this.data = recipe
        this.folders = folders
    }
}

export class RecipeFolder {
    id: string
    name: string
    icon?: string

    constructor(name: string, icon?: string) {
        this.id = name === "All Recipes" ? "/" : name.toLowerCase().split(" ").join("-")
        this.name = name
        this.icon = icon
    }

    static readonly allRecipes = new RecipeFolder("All Recipes", "book")
    static readonly favorites = new RecipeFolder("Favorites", "star.fill")
}

export type { MelaRecipe }

export const iconMap = {
    "star.fill": star,
    book: bookOpen,
    "square.and.arrow.down.on.square": arrowDownOnSquare,
}
