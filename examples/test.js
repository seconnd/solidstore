// import { s$, stateObservable } from './dist/index.es.js'
import { filter, map } from 'rxjs'
// console.log(s$)

// const { s$ } = require('./dist/index.es.js')
// const { s$, stateObservable } = require('./dist/index.es.js');

import { b$, bob$, s$ } from '../src/index'
// console.log(Matrixphere.s$)
// console.log(Matrixphere.b$)
// s$ = Matrixphere.s$
// b$ = Matrixphere.b$
// let r$ = b$.getNewRegister()
// // r$.test_log = {test:'test123'}
// r$.test_config = {
//     value: 'test1',
//     custom1: 'custom1',
//     beforeGet: new bob$()
//         .pipe(
//             map(x => x)
//         ).subscribe({
//             next: (data) => {
//                 console.log(data)
//                 console.log('bob$ next')
//             }
//         }),
//     beforeSet: (value) => { console.log(value + 'beforeSet') },
//     afterSet: (value) => { console.log(value + 'afterSet') }
// }
// r$.test2_log = false
// r$.test_log
// console.log(r$.test)
// r$.test_log = 'test456'
// console.log(r$.export_map)
// console.log(r$)
// r$.import_object = {
//     test1: 'test1',
//     test2: 'test2',
//     test3: 'test3'
// }
// console.log(r$)


// b$.test_config = {
//     value: 'test1',
//     custom1: 'custom1',
//     beforeGet: new bob$()
//         .pipe(
//             map(x => x)
//         ).subscribe({
//             next: (data) => {
//                 console.log(data)
//                 console.log('bob$ next')
//             }
//         }),
//     beforeSet: (value) => { console.log(value + 'beforeSet') },
//     afterSet: (value) => { console.log(value + 'afterSet') }
// }
// b$.test2_log = false
// b$.test_log
// console.log(b$.test)
// b$.test_log = 'test456'
// console.log(b$.export_map)
// console.log(b$)
// b$.import_object = {
//     test1: 'test1',
//     test2: 'test2',
//     test3: 'test3'
// }
// console.log(b$)


// console.log(s$)
// s$.test_log = 'test'

// s$.test_log = 'test2'

s$.test_config = {
    value: 'test',
    actions: [{
        name: 'action1',
        method: (data) => {
            console.log(data)
            console.log('action1')
            return data.next
        }
    }],
    before: (data) => {
        console.log(data)
        console.log('before')
        return data.next
    },
    after: (data) => {
        console.log(data)
        console.log('after')
    },
    undo: (data) => {
        console.log(data)
        console.log('undo')
    },
    redo: (data) => {
        console.log(data)
        console.log('redo')
    }
}
console.log(s$.test)
console.log(s$.get_all)

s$.test_log
console.log('-----------')
s$.test = 'test2'
console.log(s$.test)
console.log(s$.get_all)
console.log('-----------')
s$.test_action1_log = 'test3'
s$.test_action1_log
console.log(s$.test)
console.log(s$.get_all)

console.log('-----------')
s$.test2_log = 'test6'

s$.test2_log = 'test7'

console.log('-----------')

s$.undo
console.log(s$)
console.log(s$.test2)
console.log(s$.get_all)
console.log('-----------')
s$.undo

console.log(s$)
console.log(s$.test2)
console.log(s$.get_all)
console.log('-----------')
s$.redo

console.log(s$)
console.log(s$.test2)
console.log(s$.get_all)

s$.test = 'test10'

s$.test_delete

console.log(s$)
console.log(s$.test)
console.log(s$.get_all)

s$.undo

console.log(s$)
console.log(s$.test)
console.log(s$.get_all)

console.log(s$.export_object)
console.log(s$.export_array)
console.log(s$.export_map)