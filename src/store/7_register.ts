import { ProxyHandler, Register, Config, StandardObject, Actions } from './0_types'
import { Reducer } from './6_reducer'

const createStyle = 'font-style: italic; font-weight: 700; color: #D9F8C4;'
const updateStyle = 'font-style: italic; font-weight: 700; color: #ebc078;'
const deleteStyle = 'font-style: italic; font-weight: 700; color: #eb6c63;'
const loggingStyle = 'font-style: italic; font-weight: 700; color: #8fdfff;'

export class Wrapper extends Reducer {

    constructor () {
        super()
    }

    wrapping = () => {

        const store = this.store

        const register = {}

        const handler: ProxyHandler<Register> = {

            get: function (target, prop) {

                switch (prop) {

                    case 'get_all':
                        return this.method('get_all', target)

                    case 'undo':
                        return this.method('undo', target)

                    case 'redo':
                        return this.method('redo', target)

                    case 'history$':
                        console.warn(`(STORE) Cannot access system state [ history$ ].`)
                        return null

                    case 'initial$':
                        console.warn(`(STORE) Cannot access system state [ initial$ ].`)
                        return null

                    case 'export_object':
                        return this.method('export_object', target)

                    case 'export_array':
                        return this.method('export_array', target)

                    case 'export_map':
                        return this.method('export_map', target)

                    case 'export_json':
                        return this.method('export_json', target)

                    case 'wrapper_reset':

                        for (let element of Object.entries(target)) {
                            delete target[element[0]]
                            // store.remove!(element[0])
                        }

                        return null

                    case 'reset':

                        for (let element of Object.entries(target)) {
                            delete target[element[0]]
                            store.remove!(element[0])
                        }

                        return null

                }

                const commands = prop.split('_')
                prop = commands.shift() as string

                let isLogging = false, isDelete = false, isAction = false, actions = []

                if (!target.hasOwnProperty(prop)) {
                    if (store.getState().hasOwnProperty(prop)) {
                        target[prop] = store.getState()[prop].value
                    } else {
                        console.warn(`(STORE) Cannot access. [ ${prop} ] is no exists.`)
                        return null
                    }
                }

                for (let command of commands) {

                    switch (command) {
                        case 'log':
                            isLogging = true
                            break
                        case 'delete':
                            isDelete = true
                            break
                        default:
                            isAction = true
                            actions.push(command)
                    }
                }

                if (isAction) {

                    for (let action of actions) {

                        store.action!(prop, action)
                        target[prop] = store.getState()[prop].value


                        if (isLogging) {

                            if (store.parameters!.get(prop)?.actions
                                && store.parameters!.get(prop)?.actions!.findIndex(
                                    (beFindAction: Actions) => beFindAction.name === action
                                ) !== -1) {

                                console.groupCollapsed(`%c(STORE) [ ${prop} ] is acted.[ ${action} ]`, createStyle)
                                console.trace()
                                console.groupEnd()
                            }
                        }
                    }

                    return true
                }

                if (isDelete) {

                    delete target[prop]
                    store.remove!(prop)

                    if (isLogging) console.log(`%c(STORE) [ ${prop} ] is deleted.`, deleteStyle)

                    return null
                }

                if (isLogging) {
                    console.groupCollapsed(`%c(STORE) [ ${prop} ] = ${this.logger(target[prop])}(${typeof target[prop]}) is accessed.`, loggingStyle)
                    console.log(target[prop])
                    console.trace()
                    console.groupEnd()
                }

                let returned

                if (store.getState().hasOwnProperty(prop)) {
                    returned = store.getState()[prop].value
                } else {
                    returned = null
                    delete target[prop]
                }

                return returned
            },

            set: function (target, prop, value) {

                switch (prop) {

                    case 'undo':
                        console.warn(`(STORE) Cannot assign [ undo ].`)
                        return true

                    case 'redo':
                        console.warn(`(STORE) Cannot assign [ redo ].`)
                        return true

                    case 'history$':
                        console.warn(`(STORE) Cannot assign system state [ history$ ].`)
                        return true

                    case 'initial$':
                        console.warn(`(STORE) Cannot assign system state [ initial$ ].`)
                        return true

                    case 'import_object':
                        this.method('import_object', target, value)
                        return true

                    case 'import_json':
                        this.method('import_json', target, value)
                        return true
                }

                const commands = prop.split('_')
                prop = commands.shift() as string

                let isLogging = false, isConfig = false, isForce = false, isAction = false, actions = []

                for (let command of commands) {

                    switch (command) {
                        case 'log':
                            isLogging = true
                            break
                        case 'config':
                            isConfig = true
                            break
                        case 'force': // Not user command. It used by system.
                            isForce = true
                            break
                        default:
                            isAction = true
                            actions.push(command)
                    }
                }

                if (isForce) {
                    target[prop] = value
                    return true
                }

                if (!target.hasOwnProperty(prop)) {

                    if (isAction) {
                        console.warn(`(STORE) Cannot exec actions [ ${JSON.stringify(actions)} ]. [ ${prop} ] is not initialized. or Cannot use _(underbar or underline) in prop name.`)
                        return true
                    }

                    if (isConfig) {

                        value.name = prop

                        if (!value.hasOwnProperty('value')) value.value = null

                        store.set!(value)

                        value = value.value

                    } else {
                        store.set!({ name: prop, value })
                    }

                    if (isLogging) {
                        console.groupCollapsed(`%c(STORE) [ ${prop} ] = ${this.logger(value)}(${typeof value}) is created.`, createStyle)
                        console.log(value)
                        console.trace()
                        console.groupEnd()
                    }

                } else {

                    if (isAction) {

                        for (let action of actions) {

                            store.action!(prop, action, value)
                            target[prop] = store.getState()[prop].value

                            if (isLogging) {

                                if (store.parameters!.get(prop)?.actions
                                    && store.parameters!.get(prop)?.actions!.findIndex(
                                        (beFindAction: Actions) => beFindAction.name === action
                                    ) !== -1) {

                                    console.groupCollapsed(`%c(STORE) [ ${prop} ] = ${this.logger(value)}(${typeof value}) is acted.[ ${action} ]`, createStyle)
                                    console.log(value)
                                    console.trace()
                                    console.groupEnd()
                                }
                            }
                        }

                        return true
                    }

                    if (isConfig) {
                        console.warn(`(STORE) Cannot change configs. Please assign configs at initialize.`)
                        return true
                    }

                    store.update!(prop, value)

                    if (isLogging) {
                        console.groupCollapsed(`%c(STORE) [ ${prop} ] = ${this.logger(value)}(${typeof value}) is updated.`, updateStyle)
                        console.log(value)
                        console.trace()
                        console.groupEnd()
                    }
                }

                target[prop] = value

                return true
            },

            logger: (value) => {

                let valueForLogging

                typeof value === 'object' ?
                    valueForLogging = JSON.stringify(value)
                    : valueForLogging = value

                return valueForLogging
            },

            method: function (type, target, value = null) {

                const object: StandardObject = {}
                let origin: any

                switch (type) {

                    case 'get_all':

                        return store.getState()

                    case 'undo':

                        store.undo!()

                        return true

                    case 'redo':

                        store.redo!()

                        return true

                    case 'export_object':

                        origin = store.getState()

                        for (let element in origin) {
                            if (element !== 'initial$' && element !== 'history$')
                                object[element] = origin[element].value
                        }

                        return object

                    case 'export_array':

                        origin = store.getState()

                        for (let element in origin) {
                            if (element !== 'initial$' && element !== 'history$')
                                object[element] = origin[element].value
                        }

                        return Object.entries(object)

                    case 'export_map':

                        const map = new Map()

                        origin = store.getState()

                        for (let element in origin) {
                            if (element !== 'initial$' && element !== 'history$')
                                map.set(element, origin[element].value)
                        }

                        return map

                    case 'export_json':

                        origin = store.getState()

                        for (let element in origin) {
                            if (element !== 'initial$' && element !== 'history$')
                                object[element] = origin[element].value
                        }

                        return JSON.stringify(object)

                    case 'import_object':

                        if (typeof value !== 'object') {
                            console.warn(`(STORE) It is not [ Object ] type.`)
                            console.log(value)
                            return true
                        }

                        for (let element of Object.entries(target)) {
                            delete target[element[0]]
                            store.remove!(element[0])
                        }

                        for (let key in value)
                            this.set(target, key + '_log', value[key])

                        return true

                    case 'import_json':

                        if (typeof value !== 'string') {
                            console.warn(`(STORE) Please stringify.`)
                            console.log(value)
                            return true
                        }

                        value = JSON.parse(value)

                        for (let element of Object.entries(target)) {
                            delete target[element[0]]
                            store.remove!(element[0])
                        }

                        for (let key in value)
                            this.set(target, key + '_log', value[key])

                        return true
                }
            },

            deleteProperty: function (target, prop) {
              console.warn(`Cannot delete [ ${prop} ]. Please use delete command. -> S$.${prop}_delete`);
              return true
            }
        }

        store.wrapper = new Proxy(register, handler)

        return store.wrapper
    }

}