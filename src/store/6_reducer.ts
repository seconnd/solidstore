import { combineReducers } from 'redux'

import { Parameter, State, CustomAction, CustomReducer, Method, isSilent, Payload } from './0_types'
import { Store } from './5_store'

import { StoreObservable } from './1_observable'

export class Reducer extends Store {

    constructor() { super() }

    setReducer = () => {

        if (Object.keys(this.reducers).length > 0) return

    }

    setValueState = (parameter: Parameter, isSilent: isSilent = false) => {

        let { name } = parameter

        if (name.includes('_'))
            throw(`'_' cannot be used in state name.`)

        if (name.includes('$') && name !== 'history$')
            throw(`'$' cannot be used in state name.`)

        if (this.reducers[name]) return

        if (!isSilent) {
            parameter.initialState = { value: parameter.value, timestamp: Date.now() }
            parameter.inputState = parameter.initialState
        }

        // record state
        this.createRecordState(parameter)

        // real state
        this.#setActions(parameter)

        this.#injectReducer( this.#setReducer(parameter), isSilent )

    }

    #setActions = (parameter: Parameter) => {

        let actions = this.actions
        let methods = this.methods
        let observables = this.observables

        actions.set(`${parameter.name}_update`, (_state: State, action: CustomAction) => {
            return { value: action.value, timestamp: Date.now() }
        })

        if (parameter.before) {

            typeof parameter.before === 'function' ?
                methods.set(`${parameter.name}_before`, parameter.before)
                : observables.set(`${parameter.name}_before`,
                    this.#convertToObservable(parameter.before))
        }

        actions.set(`${parameter.name}_undo`, (_state: State, action: CustomAction) => {
            return { value: action.value.value, timestamp: action.value.timestamp }
        })
        if (parameter.undo) {
            observables.set(`${parameter.name}_undo`,
                this.#convertToObservable(parameter.undo))
        }

        actions.set(`${parameter.name}_redo`, (_state: State, action: CustomAction) => {
            return { value: action.value.value, timestamp: action.value.timestamp }
        })
        if (parameter.redo) {
            observables.set(`${parameter.name}_redo`,
                this.#convertToObservable(parameter.redo))
        }

        if (parameter.after)
            observables.set(`${parameter.name}_after`,
                this.#convertToObservable(parameter.after))

        if (!parameter.actions) return
        if (parameter.actions.length === 0) return

        for (let action of parameter.actions) {

            if (action.name.includes('_')) {
                console.log(action.name)
                throw(`Cannot use '_' in action name`)
            }

            if (actions.has(`${parameter.name}_${action.name}`)) {
                console.log(action.name)
                throw(`already exist action name`)
            }

            methods.set(`${parameter.name}_${action.name}`, action.method)

            actions.set(`${parameter.name}_${action.name}`,
                methods.get(`${parameter.name}_${action.name}`))
        }

    }

    #convertToObservable = (method: Method): any => {

        if (typeof method !== 'function') return method

        return new StoreObservable().subscribe(method)
    }

    #setReducer = (parameter: Parameter) => {

        let { inputState } = parameter

        let reducer: CustomReducer = (state = inputState, action: CustomAction): any => {

            if (!this.actions.has(action.type)) return state

            if (reducer.stateName !== action.type.split('_')[0]) return state

            const actionMethod = this.actions.get(action.type)

            if (!actionMethod) return state

            if (this.store.dispatched.length === 0) return state

            if (action.type.includes('_update') || action.type.includes('_undo') || action.type.includes('_redo')) {

                return actionMethod(state, action) || state

            } else if (action.type === this.store.dispatched[this.store.dispatched.length - 1].action.type) {

                if (!action.value) action.value = state.value

                let payload: Payload = {}
                if (action?.dispatched?.name) payload.target = action.dispatched.name
                if (action?.type) payload.trigger = action.type
                if (action?.dispatched?.state?.hasOwnProperty('value'))
                    payload.previous = action.dispatched.state.value
                if (action?.hasOwnProperty('value')) payload.next = action.value

                let value = actionMethod(payload) || state

                action.value = value

                return { value, timestamp: Date.now() }
            }
            
            return state
        }

        reducer.stateName = parameter.name

        parameter.reducer = reducer

        return parameter
    }

    #injectReducer = (parameter: Parameter, isSilent: isSilent) => {

        let { name, value, reducer } = parameter

        if (isSilent && parameter.initialState)
            value = parameter.initialState.value

        this.store.dispatch({ type: 'initial$_update', value: { name, value }, isSilent })

        switch (isSilent) {
            case 'undo':
                this.record.dispatch({ type: `${name}_undo` })
                break
            case 'redo':
                this.record.dispatch({ type: `${name}_redo` })
                break
        }

        this.reducers[name] = reducer!

        this.store.replaceReducer(combineReducers(this.reducers))

        this.parameters.set(name, parameter)
    }

}