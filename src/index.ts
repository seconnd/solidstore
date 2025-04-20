import { Basket } from './basket'
import { BasketObservable } from './basket'
import { Build } from './store'
import { StoreObservable } from './store'

const b$ = Basket.getNewRegister(Basket)
const bob$ = BasketObservable
const s$ = new Build()
const sob$ = StoreObservable

export { b$, bob$, s$, sob$ }