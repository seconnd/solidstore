import { legacy_createStore as createStore, combineReducers } from 'redux'
import undoable, { includeAction } from 'redux-undo'

import { Dispatched, Parameter, State, CustomAction, CustomReducer, CustomStore } from './0_types'

import { SetMiddleware } from './3_middleware'

export class Record extends SetMiddleware {

    declare protected record: CustomStore
    declare protected store: CustomStore

    constructor() { super() }

    setRecord = () => {
        this.#create()
        this.#adaptDispatch()
        this.#setSubscribe()
    }

    #create = () => {

        if (this.record) return

        this.record = createStore(
            combineReducers({start$: (state = {}) => state})
        )
    }

    #adaptDispatch = () => {
        this.record.dispatch0 = this.record.dispatch
        this.record.dispatched = null

        this.record.dispatch = (action: CustomAction) => {


            const name = action.type.split('_')[0]

            let dispatched: Dispatched = {
                name,
                state: this.record.getState()[name],
                action
            }

            action.dispatched = {
                name: dispatched.name,
                state: dispatched.state
            }

            this.record.dispatched = dispatched

            this.record.dispatch0(action)
        }
    }

    #setSubscribe = () => {
        this.record.subscribe(() => {

            this.record.current = this.record.getState()

            if (!this.record.dispatched) return

            const actionType = this.record.dispatched.action.type

            if (actionType.substring(actionType.length - 5, actionType.length) === '_undo') {

                const past = this.record.dispatched.state.past

                if (past.length === 0) return

                this.store.dispatch({ type: `${this.record.dispatched.name}_undo`, value: past[past.length - 1] })
                return
            }

            if (actionType.substring(actionType.length - 5, actionType.length) === '_redo') {

                const future = this.record.dispatched.state.future

                if (future.length === 0) return

                this.store.dispatch({ type: `${this.record.dispatched.name}_redo`, value: future[0] })
                return
            }

        })
    }

    createRecordState = (parameter: Parameter) => {

        let { name, initialState } = parameter

        if (this.recordReducers.hasOwnProperty(name)) return

        let timestamp = Date.now()

        this.recordActions.set(`${name}_update`, (_state: State, action: CustomAction) => {
            return action.value
        })

        let reducer: CustomReducer = (state = { value: `${name} created.`, timestamp }, action: CustomAction): any => {

            if (reducer.stateName !== action.type.split('_')[0]) return state

            if (!this.recordActions.has(action.type)) return state

            const actionMethod = this.recordActions.get(action.type)

            if (!actionMethod) return state

            return actionMethod(state, action)
        }

        reducer.stateName = name

        this.recordReducers[name] = undoable( reducer, {
            limit: 1000,
            filter: includeAction(Array.from(this.recordActions.keys())),
            undoType: `${name}_undo`,
            redoType: `${name}_redo`
        })

        this.record.replaceReducer(combineReducers(this.recordReducers))

        this.store.currentRecord = this.record.getState()

        this.record.dispatch({ type: `${name}_update`, value: {
            value: initialState?.value,
            timestamp
        }})

    }

}