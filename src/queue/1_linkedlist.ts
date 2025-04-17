import { AbstractNode, AbstractLinkedList } from './0_types.js'

class Node<T> extends AbstractNode<T> {
    public next: Node<T> | null = null
    public prev: Node<T> | null = null
    public value: T

    constructor(value: T) {
        super(value)
        this.value = value
    }
}

export class Queue<T> extends AbstractLinkedList<T> {

    protected head: Node<T> | null = null
    protected tail: Node<T> | null = null

    push(item: T): this {

        const newNode = new Node(item)

        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {

            newNode.prev = this.tail

            if (this.tail) {
                this.tail.next = newNode
            }

            this.tail = newNode
        }

        return this
    }

    unshift(item: T): this {

        const newNode = new Node(item)

        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            newNode.next = this.head
            this.head.prev = newNode
            this.head = newNode
        }

        return this
    }

    insertAt(index: number, item: T): this {

        if (index <= 0) return this.unshift(item)

        let current = this.head
        let currentIndex = 0

        while (current && currentIndex < index) {
            current = current.next
            currentIndex++
        }

        const newNode = new Node(item)

        if (current) {

            newNode.prev = current.prev
            newNode.next = current

            if (current.prev) {
                current.prev.next = newNode
            }

            current.prev = newNode

            if (current === this.head) {
                this.head = newNode
            }
        } else {
            return this.push(item)
        }

        return this
    }

    removeAt(index: number): this {

        if (index < 0) return this

        let current = this.head
        let currentIndex = 0

        while (current && currentIndex < index) {
            current = current.next
            currentIndex++
        }

        if (!current) return this

        if (current.prev) {
            current.prev.next = current.next
        } else {
            this.head = current.next
        }

        if (current.next) {
            current.next.prev = current.prev
        } else {
            this.tail = current.prev
        }

        return this
    }

    pop(): { value: T | null, list: Queue<T> } {

        if (!this.tail) return { value: null, list: this }

        const value = this.tail.value

        if (this.tail.prev) {
            this.tail = this.tail.prev
            this.tail.next = null
        } else {
            this.head = null
            this.tail = null
        }

        return { value, list: this }
    }

    shift(): { value: T | null, list: Queue<T> } {

        if (!this.head) return { value: null, list: this }

        const value = this.head.value

        if (this.head.next) {
            this.head = this.head.next
            this.head.prev = null
        } else {
            this.head = null
            this.tail = null
        }

        return { value, list: this }
    }

    find(predicate: (value: T, index: number) => boolean): T | null {

        let current = this.head
        let index = 0

        while (current) {

            if (predicate(current.value, index)) return current.value

            current = current.next
            index++
        }

        return null
    }

    findIndex(predicate: (value: T, index: number) => boolean): number {

        let current = this.head
        let index = 0

        while (current) {

            if (predicate(current.value, index)) return index

            current = current.next
            index++
        }

        return -1
    }

    toArray(): T[] {

        const result: T[] = []
        let current = this.head

        while (current) {
            result.push(current.value)
            current = current.next
        }

        return result
    }

    getValue(): T | null {
        return this.head ? this.head.value : null
    }
}