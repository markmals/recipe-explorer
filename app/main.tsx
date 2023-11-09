import { ErrorBoundary, render } from "solid-js/web"
import { Router } from "@solidjs/router"
import * as Root from "./root.tsx"

import "./tailwind.css"

// Initialize database before rendering
// await RecipesController.shared.seedDB()

render(
    () => (
        <Router>
            <ErrorBoundary fallback={error => <Root.ErrorBoundary error={error} />}>
                <Root.App />
            </ErrorBoundary>
        </Router>
    ),
    document.getElementById("app")!,
)
