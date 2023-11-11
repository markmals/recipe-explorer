import { NavigationSplitView } from "./components/NavigationSplitView"
import { FolderList } from "./components/FolderList"
import { RecipeTable } from "./components/RecipeTable"
import { ImportButton } from "./components/ImportButton"
// import { useReciepsController } from "~/lib/recipes/controller"

export function App() {
    // Initialize database
    // let controller = useReciepsController()
    // controller.seedDB()

    return (
        <NavigationSplitView
            sidebar={<FolderList />}
            detail={<RecipeTable />}
            toolbar={<ImportButton />}
        />
    )
}

export function ErrorBoundary(props: { error: unknown }) {
    console.log(props.error)
    return (
        <>
            <p>Error!</p>
            {/* @ts-expect-error */}
            {props.error.message || props.error.statusText}
        </>
    )
}
