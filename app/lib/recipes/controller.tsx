import { createContext, JSX, useContext } from "solid-js"
import { createCollection } from "../collection"
import { memo, signal } from "../decorators"
import { IndexedDBStorageEngine } from "../storage-engine"
import { Recipe, RecipeFolder } from "./recipe"
import { RecipeDecoder } from "./recipe-decoder"
import invariant from "tiny-invariant"
import { SortingState } from "@tanstack/solid-table"

export class RecipesController {
    recipes = createCollection<Recipe>({
        storage: new IndexedDBStorageEngine({
            databaseName: "recipe-explorer",
            storeName: "recipes",
        }),
    })

    @signal() accessor selectedFolder = RecipeFolder.allRecipes.id
    @signal() accessor query = ""
    @signal() accessor sorting: SortingState = [{ id: "title", desc: false }]

    @memo()
    get displayedRecipes() {
        return this.recipes.items
            .filter(recipe => {
                if (this.selectedFolder !== RecipeFolder.allRecipes.id) {
                    return recipe.folders.map(folder => folder.id).includes(this.selectedFolder)
                }

                return true
            })
            .filter(Boolean)
            .map(recipe => recipe.data)
    }

    @memo()
    get folders() {
        let array: RecipeFolder[] = []
        let folders = this.recipes.items.flatMap(recipe => recipe?.folders).filter(Boolean)
        let set = new Set(folders.map(f => f.id))

        for (let id of set) {
            array.push(folders.find(folder => folder.id === id)!)
        }

        return array.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name)).filter(Boolean)
    }

    recipeCount(folder: RecipeFolder): number {
        return folder.id === RecipeFolder.allRecipes.id
            ? this.recipes.count
            : this.recipes.items.filter(recipe => recipe.folders.map(f => f.id).includes(folder.id))
                  .length
    }

    async importRecipes(file: File) {
        let container = await RecipeDecoder.readFromFile(file)

        if (Array.isArray(container)) {
            await this.recipes.add(container.map(recipe => new Recipe(recipe)))
        } else {
            await this.recipes.add(new Recipe(container))
        }
    }

    async seedDB() {
        await this.recipes.clear()

        let seeds = [
            new Recipe(
                {
                    id: crypto.randomUUID(),
                    date: new Date(),
                    images: [],
                    title: "Stuffing-Crusted Fish",
                    totalTime: "1 hr",
                    link: "https://bonappetit.com/stuffing-crusted-fish",
                    categories: ["Seafood", "Fish"],
                    wantToCook: true,
                    favorite: true,
                },
                [new RecipeFolder("Holiday 2023")],
            ),
            new Recipe(
                {
                    id: crypto.randomUUID(),
                    date: new Date(),
                    images: [],
                    title: "Thanksgiving Turkey Club Sandwich",
                    totalTime: "30 min",
                    link: "https://bonappetit.com/turkey-club",
                    categories: ["Turkey", "Poultry"],
                    wantToCook: true,
                    favorite: false,
                },
                [new RecipeFolder("Holiday 2023"), new RecipeFolder("Best Sandwiches")],
            ),
        ]

        await this.recipes.add(seeds)
        console.log("seeded db with", this.recipes.count, "entries")
    }
}

export const RecipesControllerContext = createContext<RecipesController>()

export function RecipesControllerProvider(props: { children: JSX.Element }) {
    return (
        <RecipesControllerContext.Provider value={new RecipesController()}>
            {props.children}
        </RecipesControllerContext.Provider>
    )
}

export function useReciepsController(): RecipesController {
    const controller = useContext(RecipesControllerContext)
    invariant(controller, "Could not find ReciepsController context")
    return controller
}
