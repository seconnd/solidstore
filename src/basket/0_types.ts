import { Subject, Subscription } from 'rxjs'

export type ProxyHandlerTarget = Record<string, any>
export type Method = (data: any) => void | any

export type commands =
    'export_object' | 'export_array' | 'export_map' | 'export_json'
        | 'import_object' | 'import_json'

export interface StandardObject {
    [key: string]: any
}

export interface ProxyHandler<T> {
    configs$: Map<string, any>,
    get: (target: Register, prop: string) => any,
    set: (target: Register, prop: string, value: any) => true,
    logger: (value: any) => string,
    typeCheck: (value: any) => string,
    method: (type: commands, target: Register, value?: any) => any,
    convertToObservable: (method: Method) => BasketObservable
}

export interface BasketObservable extends Subscription {
    next?: (value: any) => void
}

export interface Config<T = any> {
    beforeCreate?: BasketObservable,
    afterCreate?: BasketObservable,
    beforeGet?: BasketObservable,
    beforeSet?: BasketObservable,
    afterSet?: BasketObservable,
    beforeDelete?: BasketObservable,
    afterDelete?: BasketObservable,
    [key: string]: any
}

export abstract class AbstractBasket {
    getNewRegister?: (register: Register) => Register
}

export abstract class Register {
    [key: string]: any
}