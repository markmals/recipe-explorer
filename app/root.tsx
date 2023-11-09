import { NavigationSplitView } from "./components/NavigationSplitView"
import { FolderList } from "./components/FolderList"
import { RecipeTable } from "./components/RecipeTable"
import { ImportButton } from "./components/ImportButton"
import { RecipesControllerProvider } from "./lib/recipes/controller"

export function App() {
    return (
        <RecipesControllerProvider>
            <NavigationSplitView
                sidebar={<FolderList />}
                detail={<RecipeTable />}
                toolbar={<ImportButton />}
            />
        </RecipesControllerProvider>
    )
}

export function ErrorBoundary(props: { error: unknown }) {
    console.log(props.error)
    // @ts-expect-error
    return props.error.message || props.error.statusText
}
