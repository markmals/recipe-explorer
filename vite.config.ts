import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tsconfigPaths from "vite-plugin-tsconfig-paths"
import typescript from "@rollup/plugin-typescript"

export default defineConfig({
    plugins: [solid(), tsconfigPaths(), typescript()],
})
