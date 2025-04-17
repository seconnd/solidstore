import { Action, Reducer, Store } from 'redux'
import { LinkedList } from '../queue/0_types.js'

export type State = { value: any, timestamp: number }
export type Method = (data: any) => void | any
export type ActionMethod = (data: any) => any
export type Reducers = { [key: string]: CustomReducer }
export type isSilent = false | 'undo' | 'redo'

export interface Actions {
    name: string,
    method: ActionMethod,
    observable: any
}

export interface Dispatched {
    name: string,
    state: State,
    action?: Action
}

export interface CustomAction extends Action {
    dispatched?: Dispatched,
    value?: any
}

export interface CustomReducer extends Reducer {
    stateName?: string
}

export interface Parameter {
    name: string,
    value: any,
    actions?: Array<Actions>,
    before?: Method,
    undo?: Method,
    redo?: Method,
    after?: Method,
    initialState?: State,
    inputState?: State,
    reducer?: CustomReducer
}

export interface CustomStore extends Store {
    dispatch: any
    dispatch0?: any,
    dispatched?: LinkedList,
    current?: any,
    currentRecord?: any,
    parameters?: Map <string, Parameter>,
    get?: (name: string) => any,
    set?: (parameter: Parameter, stateType?: 'value' | 'film') => void,
    update?: (name: string, value: any) => void,
    remove?: (name: string, isSilent?: false | 'undo' | 'redo') => void,
    action?: (name: string, action: string, value?: any) => void,
    undo?: () => void,
    redo?: () => void,
    capture?: (name: string, value: any) => void,
    revert?: any,
    replay?: any,
    getStateR?: () => any,
    setValueState?: any,
    wrapper?: any
}

export interface Payload {
    target?: string,
    trigger?: string,
    previous?: State,
    next?: any
}

export type ProxyHandlerTarget = Record<string, any>

export type commands =
    'export_object' | 'export_array' | 'export_map' | 'export_json'
        | 'import_object' | 'import_json' | 'undo' | 'redo' | 'get_all'

export interface StandardObject {
    [key: string]: any
}

export interface ProxyHandler<T> {
    get: (target: Register, prop: string) => any,
    set: (target: Register, prop: string, value: any) => true,
    logger: (value: any) => string,
    method: (type: commands, target: Register, value?: any) => any
}

export interface Config {
    actions?: Array<Actions>,
    before?: Method,
    undo?: Method,
    redo?: Method,
    after?: Method,
    initialState?: State,
    inputState?: State,
    [key: string]: any
}

export abstract class Register {
    [key: string]: any
}