import { Subject } from 'rxjs'

import { CustomStore, Parameter, Reducers, Method } from './0_types'
import './1_observable'

export class Field {

    protected store: CustomStore | undefined

    protected record: CustomStore | undefined

    protected reducers: Reducers = {}

    protected recordReducers: Reducers = {}
    
    protected actions: Map <string, any> = new Map()

    protected recordActions: Map <string, any> = new Map()

    protected observables: Map <string, Subject<any>> = new Map()

    protected methods: Map <string, Method> = new Map()

    protected parameters: Map <string, Parameter> = new Map()
}