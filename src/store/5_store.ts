import { legacy_createStore as createStore, combineReducers, applyMiddleware, Middleware, compose, Reducer } from 'redux'
import undoable, { includeAction } from 'redux-undo'

// import { SkipListQueue } from '../queue'
import { Parameter, CustomAction, isSilent, Payload } from './0_types'
import { Record } from './4_record'

export class Store extends Record {

    constructor() { super() }

    setStore = () => {
        this.#create()
        this.#setSubscribe()
        this.#setSetter()
        this.#setGetter()
        this.#setUpdater()
        this.#setCapturer()
        this.#setRemover()
        this.#setActionHandler()
        this.#setHistoryActionHandler()
        this.#setFilmActionHandler()
        this.#setSystemState()
        this.#bindRecoredStore()

        return this.store
    }

    #create = () => {

        if (this.store) return

        const composeEnhancers = compose

        this.store = createStore(
            combineReducers({start$: (state = {}) => state}),
            composeEnhancers(applyMiddleware((this.setMiddleware() as Middleware)))
        )

        this.store.dispatched = []
        this.store.current = this.store.getState()
        this.store.currentRecord = {}
        this.store.parameters = this.parameters
    }

    #setSubscribe = () => {

        let store = this.store

        store.subscribe(() => {

            let dispatched = store.dispatched.shift()

            store.current = store.getState()
            if (store.getStateR) store.currentRecord = store.getStateR()

            if (!dispatched) return

            if (dispatched.action.type === 'initial$_delete') return

            if (dispatched.action.type === 'history$_update') return

            let actionType = dispatched.action.type

            if (actionType === 'history$_undo') {

                let undid = store.current.history$.future[0].value
                let states

                switch (undid.name) {

                    case 'initial$':

                        if (store.remove)
                            store.remove(undid.value.name, 'undo')

                        states = store.getState()

                        store.wrapper.wrapper_reset

                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value

                        return

                    case 'delete$':

                        let parameter = this.parameters.get(undid.value)

                        if (parameter)
                            this.setValueState(parameter, 'undo')

                        states = store.getState()

                        store.wrapper.wrapper_reset
                        
                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value

                        return

                    default:

                        this.record.dispatch({ type: `${undid.name}_undo` })

                        states = store.getState()

                        store.wrapper.wrapper_reset

                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value

                        return
                }
            }

            if (actionType === 'history$_redo') {

                let redid = store.current.history$.present.value
                let states

                switch (redid.name) {
                    case 'initial$':

                        let parameter = this.parameters.get(redid.value.name)

                        parameter!.inputState!.value = redid.value.value

                        if (parameter)
                            this.setValueState(parameter, 'redo')

                        states = store.getState()

                        store.wrapper.wrapper_reset
                        
                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value

                        return

                    case 'delete$':

                        if (store.remove)
                            store.remove(redid.value, 'redo')

                        states = store.getState()

                        store.wrapper.wrapper_reset

                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value
                            
                        return

                    default:

                        this.record.dispatch({ type: `${redid.name}_redo` })

                        states = store.getState()

                        store.wrapper.wrapper_reset

                        for (let state in states)
                            if (state !== 'initial$' && state !== 'history$')
                                store.wrapper[state + '_force'] = states[state].value

                        return
                }
            }

            let payload: Payload = {}
            if (dispatched.action?.dispatched?.name) payload.target = dispatched.action.dispatched.name
            if (dispatched.action?.type) payload.trigger = dispatched.action.type
            if (dispatched.action?.dispatched?.state?.hasOwnProperty('value'))
                payload.previous = dispatched.action.dispatched.state.value
            if (dispatched.action?.hasOwnProperty('value')) payload.next = dispatched.action.value

            if (actionType.substring(actionType.length - 5, actionType.length) === '_undo') {

                payload.next = payload.next.value

                if (this.observables.has(`${dispatched.name}_undo`))
                    this.observables.get(`${dispatched.name}_undo`)!.next(payload)

                return

            } else if (actionType.substring(actionType.length - 5, actionType.length) === '_redo') {

                payload.next = payload.next.value

                if (this.observables.has(`${dispatched.name}_redo`))
                    this.observables.get(`${dispatched.name}_redo`)!.next(payload)

                return

            } else {

                if (dispatched.name === 'initial$' && dispatched.action.isSilent) return

                store.dispatch({ type: 'history$_update', value: {
                    name: dispatched.name, value: (dispatched.action as CustomAction).value
                }})

                this.record.dispatch({ type: `${dispatched.name}_update`, value: {
                    value: dispatched.action.value,
                    timestamp: Date.now()
                }})

            }

            if (actionType.substring(actionType.length - 7, actionType.length) === '_update')
                if (dispatched.name !== 'initial$')
                    this.parameters.get(dispatched.name)!.inputState = store.current[dispatched.name]

            if (this.observables.has(`${dispatched.name}_after`))
                this.observables.get(`${dispatched.name}_after`)!.next(payload)

        })
    }

    #setSetter = () => {

        this.store.set = (parameter, stateType = 'value') => {

            switch (stateType) {
                case 'value':
                    if (this.setValueState)
                        this.setValueState(parameter)
                    break
                case 'film':
                    this.#setFilmState(parameter.name)
                    break
            }

        }
    }

    #setFilmState = (name: string) => {

        if (name.includes('$'))
            throw(`State name must not contain '$'. '$' is automatically assigned in state name.`)

        if (name === 'initial')
            throw(`Cannot create 'initial$' state, 'initial$' is system state.`)

        if (name === 'history')
            throw(`Cannot create 'history$' state, 'history$' is system state.`)

        const reducer: Reducer = (state = { value: `${name}$ created.`, timestamp: Date.now() }, action): any => {

            if (action.type === `${name}$`) {
                return { value: action.value, timestamp: Date.now() }
            }

            return state
        }

        this.reducers[`${name}$`] = undoable(reducer, {
            limit: 1000,
            filter: includeAction([`${name}$`]),
            undoType: `${name}$_undo`,
            redoType: `${name}$_redo`
        })

        this.store.replaceReducer(combineReducers(this.reducers))
    }

    #setGetter = () => {

        let store = this.store

        store.get = (name: string): any => {

            if (!store.current.hasOwnProperty(name)) {
                console.warn(`no exist property[ ${name} ]`)
                return null
            }

            if (name === 'initial$') return store.current.initial$

            if (name.includes('$')) return {
                past: store.current[name].past,
                present: store.current[name].present,
                future: store.current[name].future
            }

            if (store.current[name].hasOwnProperty('value'))
                return store.current[name].value

        }
    }

    #setUpdater = () => {

        let store = this.store

        store.update = (name, value) => {

            if (name.substring(name.length - 1, name.length) === '$')
                throw(`Cannot access ${name}$ state, please access via revert() or replay().`)

            if (!this.reducers.hasOwnProperty(name)) {
                console.warn(`no exist property[ ${name} ]`)
                return
            }

            store.dispatch({ type: `${name}_update`, value })
        }
    }

    #setCapturer = () => {

        let store = this.store

        store.capture = (name, value: any) => {

            if (name === 'initial' || name === 'initial$')
                throw(`Cannot access 'initial$' state, 'initial$' is system state.`)

            if (name === 'history' || name === 'history$')
                throw(`Cannot access 'history$' state, 'history$' is system state.`)

            if (!name.includes('$')) name += '$'

            if (!store.current.hasOwnProperty(name)) {
                console.warn(`no exist property[ ${name} ]`)
                return null
            }

            let action = { type: `${name}`, value }

            store.dispatch(action)
        }
    }

    #setRemover = () => {

        let store = this.store

        store.remove = (name: string, isSilent: isSilent = false) => {

            if (!this.reducers.hasOwnProperty(name)) {
                console.warn(`no exist property[ ${name} ]`)
                return
            }

            Array.from(this.actions.keys()).forEach( e => {
                if (e.includes(`${name}_`)) this.actions.delete(e)
            })

            Array.from(this.observables.keys()).forEach( e => {
                if (e.includes(`${name}_`)) {
                    this.observables.get(e)!.unsubscribe()
                    this.observables.delete(e)
                }
            })

            Array.from(this.methods.keys()).forEach( e => {
                if (e.includes(`${name}_`)) this.methods.delete(e)
            })

            store.dispatch({ type: 'initial$_delete', value: { name } })

            if (!isSilent) {
                store.dispatch({ type: 'history$_update', value: {
                    name: 'delete$', value: name
                }})

                this.record.dispatch({ type: `${name}_update`, value: 'delete$' })
                // this.record.dispatch({ type: `${name}_update`, value: { value: 'delete$', timestamp: Date.now() } })
            } else if (isSilent === 'undo') {
                this.record.dispatch({ type: `${name}_undo` })
            } else if (isSilent === 'redo') {
                this.record.dispatch({ type: `${name}_redo` })
            }

            delete this.reducers[name]

            store.replaceReducer(combineReducers(this.reducers))
        }
    }

    #setActionHandler = () => {

        let store = this.store

        store.actions = this.actions

        store.action = (name: string, action: string, value: any) => {

            if (!this.reducers.hasOwnProperty(name)) {
                console.warn(`no exist property[ ${name} ]`)
                return
            }

            if (!this.actions.has(`${name}_${action}`)) {
                console.warn(`no exist action[ ${action} ]`)
                return
            }

            store.dispatch({ type: `${name}_${action}`, value })
        }
    }

    #setHistoryActionHandler = () => {

        let store = this.store

        store.undo = () => {
            if (store.current['history$'].past.length === 0) return
            store.dispatch({ type: 'history$_undo' })
        }

        store.redo = () => {
            if (store.current['history$'].future.length === 0) return
            store.dispatch({ type: 'history$_redo' })
        }
    }

    #setFilmActionHandler = () => {

        let store = this.store
        
        store.revert = (_name: string) => {}

        store.replay = (_name: string) => {}
    }

    #setSystemState = () => {

        // initial$ - 초기 데이터 저장용 reducer
        const initial$ = (state: { [key: string]: any } = {}, action: CustomAction) => {

            if (action.type === 'initial$_update') {
                state[action.value.name] = action.value.value

                return state
            }

            if (action.type === 'initial$_delete') {
                delete state[action.value.name]

                return state
            }

            return state
        }

        this.reducers['initial$'] = initial$


        // history$ - undo / redo 데이터 저장용 reducer
        const history$ = undoable((state = { value: 'history$ created.', timestamp: Date.now() }, action) => {

                if (!action.type) return state

                switch (action.type) {
                    case 'history$_update':
                        return { value: action.value, timestamp: Date.now() }
                    case 'history$_undo':
                        return { value: action.value.value, timestamp: action.value.timestamp }
                    case 'history$_redo':
                        return { value: action.value.value, timestamp: action.value.timestamp }
                }

                return state
            },
            {
                limit: 1000,
                filter: includeAction(['history$_update']),
                undoType: `history$_undo`,
                redoType: `history$_redo`
            }
        )

        this.reducers['history$'] = history$

        this.store.replaceReducer(combineReducers(this.reducers))
    }

    #bindRecoredStore = () => {
        this.store.getStateR = () => this.record.getState()
    }
    
    setValueState = (_parameter: Parameter, _isSilent: isSilent = false): void => {}

}