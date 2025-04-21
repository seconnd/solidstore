import { Middleware } from 'redux'
import { Dispatched, CustomAction, CustomStore, Method, Payload } from './0_types'
import { Field } from './2_field'

export class SetMiddleware extends Field{

    constructor() { super() }

    setMiddleware = (): Middleware | void =>{

        if (this.store) return

        // Now only returned rxjs middleware
        return (_store: any) => (next: any) => (action: any) => {

            const name: string = action.type.split('_')[0]

            let dispatched: Dispatched = {
                name,
                state: (this.store as CustomStore).getState()[name],
                action
            }

            action.dispatched = {
                name: dispatched.name,
                state: dispatched.state,
                type: action.type
            }

            let result: CustomAction | undefined

            let payload: Payload = {
                target: dispatched.name,
                trigger: action.type
            }
            if (dispatched.state?.value) payload.previous = dispatched.state.value
            if (action?.value) payload.next = action.value

            if (action.type.includes('_undo') || action.type.includes('_redo')) {
            } else if (this.observables.has(`${name}_before`)) {

                this.observables.get(`${name}_before`)!.next(payload)

            } else if (this.methods.has(`${name}_before`)) {

                const method: Method | undefined = this.methods.get(`${name}_before`)

                if (method) {

                    let returned = method(payload)

                    if (returned !== action.value) action.value = returned

                    result = this.#verifyAction(action)
                    result.dispatched = action.dispatched
                }

            }

            (this.store as CustomStore).dispatched!.push(dispatched)

            if (result) action = result

            return next(action)

        }
    }

    #verifyAction = (action: CustomAction): CustomAction => {

        if (!action.hasOwnProperty('type')) throw('No exist action.type property.')

        if (typeof action.type !== 'string') throw(`action.type is not 'string' type.`)

        if (!action.hasOwnProperty('value')) throw('No exist action.value property.')

        return action
    }
}