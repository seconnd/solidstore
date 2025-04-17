export type LinkedList = any

export abstract class AbstractNode<T> {
    next!: AbstractNode<T> | null
    prev!: AbstractNode<T> | null
    value!: T

    constructor(_value: T) {}
}

export abstract class AbstractLinkedList<T> {
    protected head!: AbstractNode<T> | null
    protected tail!: AbstractNode<T> | null

    abstract push(item: T): this

    abstract unshift(item: T): this

    abstract insertAt(index: number, item: T): this

    abstract removeAt(index: number): this

    abstract pop(): { value: T | null, list: LinkedList }

    abstract shift(): { value: T | null, list: LinkedList }

    abstract find(predicate: (value: T, index: number) => boolean): T | null

    abstract findIndex(predicate: (value: T, index: number) => boolean): number

    abstract toArray(): T[]

    abstract getValue(): T | null
}