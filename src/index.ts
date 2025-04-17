import { Basket } from './basket'
import { BasketObservable } from './basket'
import { Build } from './store'
import { StoreObservable } from './store'
import { Queue } from './queue'

const b$ = Basket.getNewRegister(Basket)
const bob$ = BasketObservable
const s$ = new Build()
const sob$ = StoreObservable
const q$ = Queue

export { b$, bob$, s$, sob$, q$ }