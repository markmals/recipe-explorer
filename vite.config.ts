import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tsconfigPaths from "vite-plugin-tsconfig-paths"

export default defineConfig({
    plugins: [
        solid({
            babel: {
                plugins: [
                    [
                        "@babel/plugin-proposal-decorators",
                        { version: "2023-05", decoratorsBeforeExport: true },
                    ],
                ],
            },
        }),
        tsconfigPaths(),
    ],
})
