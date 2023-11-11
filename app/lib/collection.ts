import { createEffect, createResource, untrack } from "solid-js"
import { StorageEngine } from "./storage-engine"
import { createStore, reconcile } from "solid-js/store"

export interface ToString {
    toString(): string
}

export interface Identifiable {
    id: ToString
}

export type CollectionOptions<Item> = Item extends Identifiable
    ? {
          storage: StorageEngine<Item>
          initialValue?: Item[]
      }
    : {
          storage: StorageEngine<Item>
          cacheIdentifier: keyof Item
          initialValue?: Item[]
      }

interface _CollectionOptions<Item> {
    storage: StorageEngine<Item>
    cacheIdentifier: keyof Item | undefined
    initialValue: Item[] | undefined
}

interface Collection<Item> {
    get items(): Item[]
    get isEmpty(): boolean
    get count(): number
    add(item: Item | Item[]): Promise<void>
    delete(item: Item | Item[]): Promise<void>
    clear(): Promise<void>
}

export function createCollection<Item>(options: CollectionOptions<Item>): Collection<Item> {
    const [items, setItems] = createStore<Item[]>([])

    const {
        initialValue,
        storage: storageEngine,
        cacheIdentifier: cacheId = "id" as keyof Item,
    } = options as _CollectionOptions<Item>

    async function init() {
        if (initialValue !== undefined) {
            return initialValue
        } else {
            return await storageEngine.get()
        }
    }

    // TODO: Make `init` a blocking operating so I can initialize the database before rendering the UI?
    // Populate the collection with any existing database data
    const [initialized] = createResource(init)
    createEffect(() => {
        const value = initialized()
        if (value) setItems(reconcile(value))
    })

    async function persist(item: Item | Item[]) {
        if (Array.isArray(item)) {
            let items = item
            for (const item of items) {
                await persist(item)
            }
        } else {
            let identifier = (item[cacheId] as ToString).toString()
            await storageEngine.set(identifier, item)
        }
    }

    async function deletePersisted(item: Item | Item[]) {
        if (Array.isArray(item)) {
            let items = item
            for (const item of items) {
                await deletePersisted(item)
            }
        } else {
            let identifier = (item[cacheId] as ToString).toString()
            await storageEngine.delete(identifier)
        }
    }

    return {
        get items() {
            return items
        },
        get isEmpty() {
            return items.length === 0
        },
        get count() {
            return items.length
        },
        async add(item) {
            let currentValuesMap = new Map<string, Item>()

            if (Array.isArray(item)) {
                let addedItemsMap = new Map<string, Item>()

                // Deduplicate items passed into `add(items)` by taking advantage
                // of the fact that a Map can't have duplicate keys.
                for (let newItem of item) {
                    let identifier = (newItem[cacheId] as ToString).toString()
                    addedItemsMap.set(identifier, newItem)
                }

                // Take the current items array and turn it into a Map.
                for (let currentItem of untrack(() => items)) {
                    currentValuesMap.set((currentItem[cacheId] as ToString).toString(), currentItem)
                }

                // Add the new items into the dictionary representation of our items.
                for (let [key, newItem] of addedItemsMap) {
                    currentValuesMap.set(key, newItem)
                }

                // We persist only the newly added items, rather than rewriting all of the items
                await persist(Array.from(addedItemsMap.values()))
            } else {
                let identifier = (item[cacheId] as ToString).toString()

                for (let currentItem of untrack(() => items)) {
                    currentValuesMap.set((currentItem[cacheId] as ToString).toString(), currentItem)
                }

                currentValuesMap.set(identifier, item)

                // We persist only the newly added item, rather than rewriting all of the items
                await persist(item)
            }

            setItems(reconcile(Array.from(currentValuesMap.values())))
        },
        async delete(item) {
            let values: Item[] = Array.isArray(item) ? item : [item]
            await deletePersisted(item)
            setItems(
                reconcile(
                    untrack(() => items).filter(
                        currentItem =>
                            !values
                                .map(i => String(i[cacheId]))
                                .includes((currentItem[cacheId] as ToString).toString()),
                    ),
                ),
            )
        },
        async clear() {
            await storageEngine.clear()
            setItems([])
        },
    }
}
