import { A, useLocation, useMatch } from "@solidjs/router"
import { cx } from "cva"
import { Icon } from "solid-heroicons"
import { For, JSX, Show, createEffect } from "solid-js"
import { useReciepsController } from "~/lib/recipes/controller"
import { RecipeFolder, iconMap } from "~/lib/recipes/recipe"

export function Label(props: { icon: string; isActive?: boolean; children: JSX.Element }) {
    const icon = iconMap[props.icon as keyof typeof iconMap]
    return (
        <span class="flex flex-row gap-2">
            <Icon
                path={icon}
                class={cx(
                    props.isActive
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                    "h-6 w-6 shrink-0",
                )}
            />

            {props.children}
        </span>
    )
}

export function Badge(props: { children: JSX.Element }) {
    return (
        <span class="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {" "}
            {props.children}
        </span>
    )
}

export function FolderList() {
    let controller = useReciepsController()
    let href = (folder: RecipeFolder) =>
        folder.name === RecipeFolder.allRecipes.name
            ? "/"
            : folder.name.toLowerCase().split(" ").join("-")
    let isActive = (folder: RecipeFolder) => Boolean(useMatch(() => href(folder))())

    let location = useLocation()

    createEffect(() => {
        let path = location.pathname
        if (path.length > 1) path = path.slice(1)
        controller.selectedFolder = path
    })

    return (
        <ul role="list" class="-mx-2 space-y-1">
            <For each={controller.allFolders}>
                {folder => (
                    <li>
                        <A
                            href={href(folder)}
                            class={cx(
                                isActive(folder)
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                        >
                            <Show when={folder.icon} fallback={<span>{folder.name}</span>}>
                                <Label icon={folder.icon!} isActive={isActive(folder)}>
                                    {folder.name}
                                </Label>
                            </Show>
                            <Badge>{controller.recipeCount(folder)}</Badge>
                        </A>
                    </li>
                )}
            </For>
        </ul>
    )
}
