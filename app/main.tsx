import { ErrorBoundary, render } from "solid-js/web"
import { Router } from "@solidjs/router"
import * as Root from "./root.tsx"

import "./tailwind.css"
import { RecipesControllerProvider } from "./lib/recipes/controller.tsx"

render(
    () => (
        <Router>
            <ErrorBoundary fallback={error => <Root.ErrorBoundary error={error} />}>
                <RecipesControllerProvider>
                    <Root.App />
                </RecipesControllerProvider>
            </ErrorBoundary>
        </Router>
    ),
    document.getElementById("app")!,
)
