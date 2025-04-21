// import { s$, stateObservable } from './dist/index.es.js'
import { filter, map } from 'rxjs'
// console.log(s$)

// const { s$ } = require('./dist/index.es.js')
// const { s$, stateObservable } = require('./dist/index.es.js');

import { b$, bob$, s$, sob$ } from '../src/index'

s$.cash_config = {
    value: 1000,
    actions: [
      { name: 'deposit',  method: v => v.previous + v.next },   // 예: s$.cash_deposit = 500
      { name: 'withdraw', method: v => v.previous - v.next }    // 예: s$.cash_withdraw = 200
    ],
    before: payload => {
        console.log('변경 전:', payload)
        return payload.next
    },
    after:  new sob$().pipe(filter(val => val.next > 3)).subscribe({ next: (v) => console.log('Over 1000:', v.next) }),
    undo:   payload => console.log('undo 직후:', payload),
    redo:   payload => console.log('redo 직후:', payload)
  }
  
  // 사용 예시
  s$.cash_deposit = 500
  console.log(s$.cash)   // cash=1500
  s$.undo
  console.log(s$.cash)   // cash=1000
  s$.redo
  console.log(s$.cash)   // cash=1500
  s$.cash_withdraw = 200
  console.log(s$.cash)   // cash=1300













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

// s$.test_config = {
//     value: 'test',
//     actions: [{
//         name: 'action1',
//         method: (data) => {
//             console.log(data)
//             console.log('action1')
//             return data.next
//         }
//     }],
//     before: (data) => {
//         console.log(data)
//         console.log('before')
//         return data.next
//     },
//     after: (data) => {
//         console.log(data)
//         console.log('after')
//     },
//     undo: (data) => {
//         console.log(data)
//         console.log('undo')
//     },
//     redo: (data) => {
//         console.log(data)
//         console.log('redo')
//     }
// }
// console.log(s$.test)
// console.log(s$.get_all)

// s$.test_log
// console.log('-----------')
// s$.test = 'test2'
// console.log(s$.test)
// console.log(s$.get_all)
// console.log('-----------')
// s$.test_action1_log = 'test3'
// s$.test_action1_log
// console.log(s$.test)
// console.log(s$.get_all)

// console.log('-----------')
// s$.test2_log = 'test6'

// s$.test2_log = 'test7'

// console.log('-----------')

// s$.undo
// console.log(s$)
// console.log(s$.test2)
// console.log(s$.get_all)
// console.log('-----------')
// s$.undo

// console.log(s$)
// console.log(s$.test2)
// console.log(s$.get_all)
// console.log('-----------')
// s$.redo

// console.log(s$)
// console.log(s$.test2)
// console.log(s$.get_all)

// s$.test = 'test10'

// s$.test_delete

// console.log(s$)
// console.log(s$.test)
// console.log(s$.get_all)

// s$.undo

// console.log(s$)
// console.log(s$.test)
// console.log(s$.get_all)

// console.log(s$.export_object)
// console.log(s$.export_array)
// console.log(s$.export_map)


// import { b$ } from 'solidstore';

// // Create a register instance
// const r$ = b$.getNewRegister();

// // Assign/read/update/delete state as simple variables
// r$.foo = 123;
// console.log(r$.foo);       // 123
// r$.foo = 456;              // Updates state
// r$.foo_log = 789;          // Triggers console logging

// // Attach config (timing hooks/extensions)
// r$.bar_config = {
//     value: 'bar',
//     beforeGet: (val)   => console.log('Before get:', val),
//     beforeSet: (prev)  => console.log('Previous value:', prev),
//     afterSet:  (now)   => console.log('New value:', now),
// };
// r$.bar = 'NewValue';       // Hooks fire automatically
// r$.bar;                    // beforeGet hook runs

// // Bulk import/export
// // r$.import_object = { a: 1, b: 2 };
// // const all = r$.export_object;     // { a: 1, b: 2, ... }
// // const json = r$.export_json;      // '{"a":1,"b":2,...}'

// // Delete
// console.log('test')
// r$.foo_delete;

// console.log(r$)

// // Observable support!
// // import { bob$ } from 'solidstore'; // bob$ = 'b'asket 'ob'servable
// // import { filter } from 'rxjs';

// r$.obs_config = {
//   value: 'trigger', 
//   beforeGet: new bob$()
//     .pipe(
//       filter(val => val === 'trigger')
//     ).subscribe({ next: () => console.log('Read!') })
// };

// r$.obs_exec;


// r$.x_config = {
//   value: 5,
//   test: 'test1',
//   beforeSet: new bob$().pipe(filter(val => val > 3)).subscribe({ next: (v) => console.log('Over 3:', v) }),
//   afterSet: new bob$().pipe(filter(val => val > 3)).subscribe({ next: (v) => console.log('Over 3:', v) })
// }
// r$.x_after = 8;  // Outputs: 'Over 3: 8'
// r$.x_before = 10;  // Outputs: 'Over 3: 8'
// console.log(r$.x);  // Outputs: 10
// console.log(r$.x_config)