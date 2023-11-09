import { Icon } from "solid-heroicons"
import { chevronDown, chevronUp } from "solid-heroicons/solid"
import { ColumnDef, flexRender } from "@tanstack/solid-table"
import { cx } from "cva"
import { For, Show } from "solid-js"
import { useReciepsController } from "~/lib/recipes/controller"
import { MelaRecipe } from "~/lib/recipes/recipe"

// TODO: Set an initial width on columns
// TODO: Adjustable column widths

export const columns: ColumnDef<MelaRecipe>[] = [
    {
        accessorFn: data => data.title,
        id: "title",
        header: () => "Title",
        cell: info => info.getValue(),
    },
    {
        accessorFn: data => data.link,
        id: "source",
        header: () => "Source",
        cell: (info: any) => (
            <a
                class="text-blue-600 visited:text-purple-600 hover:text-blue-700 hover:visited:text-purple-700"
                href={info.getValue()}
            >
                {info.getValue()}
            </a>
        ),
    },
    {
        accessorFn: data => data.totalTime,
        id: "total-time",
        header: () => "Total Time",
        cell: info => info.getValue(),
    },
    {
        accessorFn: data => data.categories,
        id: "categories",
        header: () => "Categories",
        cell: (info: any) => info.getValue().join(", "),
    },
    {
        accessorFn: data => data?.wantToCook,
        id: "want-to-cook",
        header: () => "Want To Cook",
        cell: info => (info.getValue() ? "✅" : "❌"),
    },
    {
        accessorFn: data => data?.favorite,
        id: "favorite",
        header: () => "Favorite",
        cell: info => (info.getValue() ? "✅" : "❌"),
    },
]

export function RecipeTable() {
    let controller = useReciepsController()

    return (
        <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                        <For each={controller.table.getHeaderGroups()}>
                            {headerGroup => (
                                <tr>
                                    <For each={headerGroup.headers}>
                                        {header => (
                                            <th
                                                colSpan={header.colSpan}
                                                scope="col"
                                                class="whitespace-nowrap px-8 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 lg:px-3"
                                            >
                                                <Show when={!header.isPlaceholder}>
                                                    <div
                                                        class={cx(
                                                            "flex flex-row gap-2",
                                                            header.column.getCanSort() &&
                                                                "cursor-pointer select-none",
                                                        )}
                                                        onClick={() =>
                                                            header.column.toggleSorting(
                                                                undefined,
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                        {{
                                                            asc: (
                                                                <Icon
                                                                    path={chevronUp}
                                                                    class="h-4 w-4"
                                                                />
                                                            ),
                                                            desc: (
                                                                <Icon
                                                                    path={chevronDown}
                                                                    class="h-4 w-4"
                                                                />
                                                            ),
                                                        }[header.column.getIsSorted() as string] ??
                                                            null}
                                                    </div>
                                                </Show>
                                            </th>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <For each={controller.table.getRowModel().rows.slice(0, 10)}>
                            {row => (
                                <tr>
                                    <For each={row.getVisibleCells()}>
                                        {(cell, idx) => (
                                            <td
                                                class={cx(
                                                    "whitespace-nowrap px-2 py-2 text-sm text-gray-900",
                                                    idx() === 0 && "sm:pl-6",
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
