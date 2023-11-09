import { cx } from "cva"
import { Icon } from "solid-heroicons"
import { arrowDownOnSquare } from "solid-heroicons/solid"
import { useReciepsController } from "~/lib/recipes/controller"

export function ImportButton() {
    let controller = useReciepsController()

    return (
        <label>
            <input
                type="file"
                name="file"
                hidden
                onChange={async event => {
                    let e = event as unknown as Event & { target: HTMLInputElement }
                    let file = e.target.files?.[0]
                    if (file) await controller.importRecipes(file)
                }}
            />
            <div class="flex w-full flex-row items-center justify-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <Icon
                    path={arrowDownOnSquare}
                    class={cx("text-gray-400 group-hover:text-indigo-600", "h-5 w-5 shrink-0")}
                />
                Import Recipes
            </div>
        </label>
    )
}
