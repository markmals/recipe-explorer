import { unzip } from "unzipit"

export interface Recipe {
    /**
     * The unique ID of the recipe.
     *
     * If `link` is a URL, then ID is `link` without the protocol at the beginning.
     *
     * If `link` is not a URL, then ID is a UUID.
     */
    id: string
    date: Date
    images: string[]
    title?: string
    yield?: string
    cookTime?: string
    prepTime?: string
    totalTime?: string
    /** Also "source"; can be a URL or plain text */
    link?: string
    text?: string
    ingredients?: string
    instructions?: string
    notes?: string
    nutrition?: string
    /** An array of tags */
    categories: string[]
    wantToCook: boolean
    favorite: boolean
}

export namespace RecipeDecoder {
    /**
     * Converts a Swift time interval (as encoded to JSON with `Swift.JSONEncoder`)
     * to a JavaScript Date.
     *
     * Since Mela is written in Swift, this is needed to convert their encoded dates to JS Dates.
     *
     * @see https://stackoverflow.com/a/52001521
     *
     * @param { number } timeInterval - A Swift time interval; seconds since 2001-01-01.
     *
     * @returns { Date } A Date representing the Swift time interval.
     *
     */
    function timeIntervalToDate(timeInterval: number): Date {
        let swiftOffset = Date.UTC(2001, 0, 1) // 978307200000
        return new Date(swiftOffset + timeInterval * 1000)
    }

    async function decodeFromJSON(text: string): Promise<Recipe> {
        type ParsedRecipe = Omit<Recipe, "date"> & { date?: number }

        // '.melarecipe' files are really just JSON files with the `ParsedRecipe` schema
        let parsedRecipe = JSON.parse(text) as ParsedRecipe
        let date = timeIntervalToDate(parsedRecipe.date!)
        delete parsedRecipe.date

        return { ...parsedRecipe, date }
    }

    async function decodeFromZip(data: ArrayBuffer): Promise<Recipe[]> {
        // '.melarecipes' files are really just ZIP archives containing '.melarecipe' files
        let zip = await unzip(data)
        let recipes = await Promise.all(
            Object.entries(zip.entries).map(async ([_name, entry]) => await entry.json()),
        )
        return await Promise.all(recipes.map(async recipe => await decodeFromJSON(recipe)))
    }

    export async function readFromFile(file: File): Promise<Recipe | Recipe[]> {
        if (file.name.endsWith(".melarecipe")) {
            return await decodeFromJSON(await file.text())
        } else if (file.name.endsWith(".melarecipes")) {
            let recipes = await decodeFromZip(await file.arrayBuffer())
            console.log(recipes)
            return recipes
        }

        throw new Error("Can only decode files of type .melarecipe or .melarecipes")
    }
}
