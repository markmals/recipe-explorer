import { SignalOptions, createEffect, createMemo, createSignal } from "solid-js"

type ClassAccessorDecorator<Host, Value> = (
    value: ClassAccessorDecoratorTarget<Host, Value>,
    context: ClassAccessorDecoratorContext<Host, Value>,
) => ClassAccessorDecoratorResult<Host, Value>

type ClassGetterDecorator<Value> = (
    value: () => Value,
    context: ClassGetterDecoratorContext<Object, Value>,
) => (() => Value) | void

type ClassMethodDecorator<Value> = (
    value: () => Value,
    context: ClassMethodDecoratorContext<Object, () => Value>,
) => (() => Value) | void

export function signal<T>(options?: SignalOptions<T>): ClassAccessorDecorator<Object, T> {
    return (_value, context) => {
        if (context.static) {
            throw new Error("@signal() can only be applied to instance members.")
        }

        if (typeof context.name === "symbol") {
            throw new Error("@signal() cannot be applied to symbol-named properties.")
        }

        const [get, set] = createSignal<T>(undefined as T, options)

        return {
            init(initialValue) {
                set(initialValue as any)
                return get()
            },
            get() {
                return get()
            },
            set(newValue) {
                set(newValue as any)
            },
        }
    }
}

export function memo<T>(): ClassGetterDecorator<T> {
    return (value, context) => {
        if (context.static) {
            throw new Error("@memo() can only be applied to instance members.")
        }

        if (typeof context.name === "symbol") {
            throw new Error("@memo() cannot be applied to symbol-named properties.")
        }

        let get: (() => T) | undefined
        let bound!: () => T

        context.addInitializer(function () {
            bound = value.bind(this)
        })

        return () => {
            if (!get) {
                get = createMemo<T>(() => bound())
            }

            return get()
        }
    }
}

export function effect(): ClassMethodDecorator<void> {
    return (value, context) => {
        if (context.static) {
            throw new Error("@effect() can only be applied to instance members.")
        }

        if (typeof context.name === "symbol") {
            throw new Error("@effect() cannot be applied to symbol-named properties.")
        }

        let bound!: () => void

        context.addInitializer(function () {
            bound = value.bind(this)
        })

        createEffect(() => bound())

        // return () => {
        //     return bound()
        // }
    }
}

// class Foo {
//     @signal() accessor foo = ""

//     @memo()
//     get bar() {
//         return this.foo.length
//     }

//     @effect()
//     logBars() {
//         console.log(this.bar)
//     }

//     constructor() {
//         this.foo = "Hello"
//         this.foo = "Goodbye"
//     }
// }
