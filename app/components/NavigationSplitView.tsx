import { JSX } from "solid-js"

export namespace NavigationSplitView {
    export interface Props {
        sidebar: JSX.Element
        detail: JSX.Element
        toolbar?: JSX.Element
    }
}

export function NavigationSplitView(props: NavigationSplitView.Props) {
    return (
        <>
            <div>
                <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
                    <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 pt-12">
                        <nav class="flex flex-1 flex-col">
                            <ul role="list" class="flex flex-1 flex-col justify-between gap-y-7">
                                <li>{props.sidebar}</li>
                                <li>{props.toolbar}</li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <main class="py-10 lg:pl-56">
                    <div class="sm:px-2 lg:pl-8 lg:pr-4">{props.detail}</div>
                </main>
            </div>
        </>
    )
}
