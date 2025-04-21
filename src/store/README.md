# Store

**Typescript + Redux based, intuitive and powerful Proxy state management framework**

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts & Architecture](#core-concepts-and-architecture)
3. [API & Command Table](#api-and-command-table)
4. [Installation & Getting Started](#installation-and-getting-started)
5. [Basic Usage](#basic-usage)
6. [State Lifecycle Management (Undo/Redo, etc)](#state-lifecycle-undo-redo)
7. [Advanced Usage: Custom Actions, Hook, rxjs](#advanced-usage--custom-actions-hook-rxjs-events)
8. [Data Export/Import](#data-importexport)
9. [Caveats & Limitations](#caveats--limitations)

---

## Overview

`s$` leverages Redux and Proxy  
to provide a unified interface for  
*clean syntax, automatic undo/redo, lifecycle hooks, custom actions, state import/export*,  
and more.

**Features:**
- Convenient like variables (`s$.foo = 1`, `s$.foo_action1 = 2`)
- Declarative extension via custom actions, methods, and Hooks
- Automatic undo/redo and state change history tracking
- rxjs-based asynchronous/observable subscription
- state backup/restore/initialization via export/import

---

## Core Concepts and Architecture

| Component         | Description                                                                                          |
|-------------------|-----------------------------------------------------------------------------------------------------|
| **State**         | Object field-based state, e.g. s$.name = 'john'                                                     |
| **Action**        | Callable as s$.foo_action = ...; bind custom function                                               |
| **Undo/Redo**     | s$.undo, s$.redo (restore previous/next state, global state history)                                |
| **Hook**          | before/after/undo/redo fields: register callbacks or observables at specific lifecycle points       |
| **Import/Export** | Backup/restore all (or part) of state in various formats: object/JSON/array/map                     |

---

## API and Command Table

| Feature         | Usage Example                           | Description                                   |
|-----------------|----------------------------------------|-----------------------------------------------|
| Create/Update   | `s$.score = 10`                        | Assign value to create or update a state      |
| Read State      | `console.log(s$.score)`                | Read state value                              |
| Delete State    | `s$.score_delete`                      | Safely delete a state                         |
| Undo/Redo       | `s$.undo`, `s$.redo`                   | Rollback or redo the most recent state change |
| Custom Action   | `s$.score_double = 10`                 | Executes `double` if registered as an action  |
| Hook            | see Config syntax below                | Listener per before/after/undo/redo event     |
| Export State    | `s$.export_object`, `s$.export_json`   | Export state (to object/JSON, etc)            |
| Import State    | `s$.import_object = { ... }`           | Restore entire state from external data       |
| rxjs usage      | `const sob = new sob$()`               | Use custom observable with rxjs pipeline      |

---

## Installation and Getting Started

```ts
import { s$, sob$ } from 'solidstore'
```

---

## Basic Usage

### 1. Create state & assign value

```ts
s$.score = 100             // create "score" and assign 100
s$.user = "Amy"            // create "user" and assign value
```

### 2. Read value

```ts
console.log(s$.score)      // 100
```

### 3. Update value

```ts
s$.score += 50             // 150
```

### 4. Delete state

```ts
s$.score_delete
console.log(s$.score)      // shows warning + returns null
```

---

## State Lifecycle (Undo/Redo)

> **Every state change is tracked in the history.**  
> Using undo/redo will automatically revert/reapply values.

```ts
s$.num = 1
s$.num = 2
s$.undo       // --> num = 1
s$.redo       // --> num = 2
```

- Even if multiple states are modified, they are managed in a single history stack.
- If you delete a state and then undo, it will be restored.

---

## Advanced Usage : Custom Actions, Hook, rxjs Events

### 1. Config syntax (register actions/hooks/options)

```ts

import { s$, sob$ } from 'solidstore'
import { filter } from 'rxjs'

s$.cash_config = {
    value: 1000,
    actions: [
      { name: 'deposit',  method: v => v.previous + v.next },   // e.g., s$.cash_deposit = 500
      { name: 'withdraw', method: v => v.previous - v.next }    // e.g., s$.cash_withdraw = 200
    ],
    before: payload => {
        console.log('Before change:', payload)
        return payload.next
    },
    after:  new sob$().pipe(filter(val => val.next > 3)).subscribe({ next: (v) => console.log('Over 1000:', v.next) }),
    undo:   payload => console.log('After undo:', payload),
    redo:   payload => console.log('After redo:', payload)
  }

  // Usage example
  s$.cash_deposit = 500
  console.log(s$.cash)   // cash = 1500
  s$.undo
  console.log(s$.cash)   // cash = 1000
  s$.redo
  console.log(s$.cash)   // cash = 1500
  s$.cash_withdraw = 200
  console.log(s$.cash)   // cash = 1300
```

### 2. Registering actions only

```ts
s$.value_config = {
  value: 0,
  actions: [
    { name: 'triple', method: v => v.next*3 }
  ]
}
s$.value_triple        // 0*3 = 0
s$.value = 4
s$.value_triple        // 12
console.log(s$.value)   // 12
```

---

## Data Import/Export

### 1. Export

```ts
let obj  = s$.export_object    // { foo: 1, bar: 2, ... }
let arr  = s$.export_array     // [ [foo, 1], ... ]
let map  = s$.export_map       // Map(foo => 1, ...)
let json = s$.export_json      // '{"foo":1,"bar":2}'
```

### 2. Import

```ts
s$.import_object = { a: 1, b: 2 }
s$.import_json   = '{"apple":10,"orange":22}'
```

> On import, all existing values are overwritten.  
> All states will be reset and then imported safely.

---

## Caveats & Limitations

| Type         | Description                                                                             |
|--------------|-----------------------------------------------------------------------------------------|
| **State Name** | Underscore `_` and dollar sign `$` are not allowed in user state names. (reserved)     |
| **delete**     | Javascript `delete` statement is not supported. Use `[field]_delete` for safe removal. |
| **System State** | Internal segments like `initial$`, `history$` are not directly accessible. (shows warning) |
| **Behavior Restriction** | "Undo/redo actions are command-only, do not assign value directly."                 |

---

## Full Practical Example

```ts
// Create state
s$.fruit = "apple"
// Update value
s$.fruit = "orange"
// undo/redo
s$.undo          // fruit -> apple
s$.redo          // fruit -> orange
// Custom action
s$.score_config = {
  value: 50,
  actions: [
    { name: 'inc10', method: v => v.next + 10 }
  ]
}
s$.score_inc10    // 60
// Export / Import
let saved = s$.export_json
s$.reset
s$.import_json = saved
console.log(s$.score)    // 60
```

---

## Additional Notes

- All state changes, actions, lifecycle events, undo/redo are processed with history safety.
- Hooks (callback or rxjs observable) can be used for easily handling side effects or custom logic.
- You can create/connect rxjs observables directly using `sob$`.

---