# Basket

> **Basket** is a high-performance state container (store) for JavaScript/TypeScript, allowing you to manage state as simply and flexibly as assigning variables.<br>
Framework-agnostic: works seamlessly with React, Vue, Svelte, and more.<br>
*Supports concise and powerful property handling, lifecycle hooks, timing hooks, RxJS observable integration, logging, and easy bulk import/export—all without store history bloat.*


## ✨ Key Features

- **Easy & Flexible State Management**: Assign, update, delete, and access state with natural variable-like syntax.
- **Unlimited Custom Configs**: Attach timing hooks, observables, or metadata to each state key.
- **Before/After Hooks**: Register hooks (as functions or observables) for every lifecycle phase: creation, access, update, and deletion.
- **Built-in Logging, Tracing, and Type Checking**
- **Bulk Import/Export (object, JSON, map, array)**: Manage many states easily, no store history/leak issues.
- **Memory Efficient**: Suitable for transient/temporary or large data without memory bloat.
- **Observable Support**: Seamlessly integrates with RxJS and reactive flows.
- **Supports both global singleton and scoped modules/instances**

---

## 📦 Installation

```sh
npm i solidstore
```

---

## 🚀 Quick Start

```typescript
import { b$ } from 'solidstore';

// Create a register instance
const r$ = b$.getNewRegister();

// Assign/read/update/delete state as simple variables
r$.foo = 123;
console.log(r$.foo);       // 123
r$.foo = 456;              // Updates state
r$.foo_log = 789;          // Triggers console logging

// Attach config (timing hooks/extensions)
r$.bar_config = {
    value: 'bar',
    beforeGet: (val)   => console.log('Before get:', val),
    beforeSet: (prev)  => console.log('Previous value:', prev),
    afterSet:  (now)   => console.log('New value:', now),
};
r$.bar = 'NewValue';       // Hooks fire automatically
r$.bar;                    // beforeGet hook runs

// Bulk import/export
r$.import_object = { a: 1, b: 2 };
const all = r$.export_object;     // { a: 1, b: 2, ... }
const json = r$.export_json;      // '{"a":1,"b":2,...}'

// Delete
r$.foo_delete;

// Observable support!
import { bob$ } from 'solidstore'; // bob$ = 'b'asket 'ob'servable
import { filter } from 'rxjs';

r$.obs_config = {
  value: 'trigger', 
  beforeGet: new bob$()
    .pipe(
      filter(val => val === 'trigger')
    ).subscribe({ next: () => console.log('Read!') })
};

r$.obs_exec;
```

---

## 🎛️ API

### **Create a Register**

```ts
const r$ = b$.getNewRegister();   // Independent instance
// Or use as a global singleton: b$.foo = 1;
```

---

### **State Assignment / Update / Delete / Access**

| Operation            | Example                              | Description                                   |
|----------------------|--------------------------------------|-----------------------------------------------|
| Create/Update        | `r$.test = 10`                       | Create or update a state key                  |
| Delete               | `r$.test_delete`                     | Instantly delete a state key                  |
| Access               | `r$.test`                            | Access just like a variable                   |
| Config Access        | `r$.test_config`                     | Get the config of a state key                 |

---

### **Logging & Type Checking (Debugging)**

- Add a `_log` suffix to trigger logging/tracing on create/update/delete

```js
r$.count_log = 10;    // Shows detailed change in console
r$.count_log;         // Logs when accessed
```

---

### **Config (Timing Hooks/Metadata/Observable) Registration**

Attach any combination of hooks or metadata per key:

```ts
r$.score_config = {
    value: 1234,           // The state value itself
    uiLabel: 'Score bar',   // Arbitrary metadata (unlimited)
    beforeCreate: (v) => console.log('Before create', v),
    afterCreate: (v)  => console.log('After create', v),
    beforeGet:   (v)  => console.log('Before access', v),
    beforeSet:   (v)  => console.log('Before set', v),
    afterSet:    (v)  => console.log('After set', v),
    beforeDelete:(v)  => console.log('Before delete', v),
    afterDelete: ()  => console.log('After delete')
}
```

*All timing hooks support both regular functions and RxJS Observables.*

---

### **Timing Hook Triggers**

| Timing Hook   | Trigger                                      |
|---------------|----------------------------------------------|
| beforeCreate  | Fires automatically before state creation    |
| afterCreate   | Fires automatically after state creation     |
| beforeGet     | Fires before get (with `_before` or `_exec`) |
| beforeSet     | Fires before set (with `_before` or `_exec`) |
| afterSet      | Fires after set (with `_after` or `_exec`)   |
| beforeDelete  | Fires before delete                          |
| afterDelete   | Fires after delete                           |

Examples:  
```
r$.test_before         // triggers beforeGet (getter)
r$.test_exec           // triggers beforeGet (getter)
r$.test_before = 'A'   // triggers beforeSet (setter)
r$.test_after = 'B'    // triggers afterSet (setter)
r$.test_exec = 'C'     // triggers both beforeSet and afterSet (setter)
```

---

### **Import / Export Commands**

- `r$.export_object` : Export all states as a plain JS object  
- `r$.export_array`  : Export as array of [key, value] pairs  
- `r$.export_map`    : Export as a Map object  
- `r$.export_json`   : Export as a JSON string  
- `r$.import_object = {...}` : Reset and bulk import from an object  
- `r$.import_json = '{...}'` : Reset and bulk import from a JSON string

---

### **Observable Integration**

You can pipe any RxJS logic into a timing hook.

```ts
import { bob$ } from 'solidstore'
import { filter } from 'rxjs'

r$.x_config = {
  value: 5,
  beforeSet: new bob$().pipe(filter(val => val > 3)).subscribe({ next: (v) => console.log('Over 3:', v) })
  afterSet: new bob$().pipe(filter(val => val > 3)).subscribe({ next: (v) => console.log('Over 3:', v) })
}
r$.x_after = 8;  // Outputs: 'Over 3: 8'
r$.x_before = 10;  // Outputs: 'Over 3: 8'
console.log(r$.x);  // Outputs: 10
```

---

## 🛠️ Usage Examples

### - **Global State**
```ts
import { b$ } from 'solidstore'
b$.lang = 'en';
b$.user_config = {
   value: { id: "guest" },
   afterSet: (val) => console.log('User changed:', val)
};
```

### - **Local/Component-Scoped State**
```ts
const r$ = b$.getNewRegister();
r$.step = 1;
```

### - **Concurrent State Management (Multiple Instances)**
```ts
const a$ = b$.getNewRegister();
const b$ = b$.getNewRegister();
a$.x = 1;
b$.x = 2;
// Each is isolated!
```

---

## ⚡️ FAQ & Tips

- **Deleting**: Simply call `r$.foo_delete` to remove (no need for `delete r$.foo`)
- When using **config**, `value` is required for state assignment; any other keys (except reserved ones) are free-form.
- **Timing hooks** support either plain functions or observables (next method required for observables).
- **Suffixes**: Use `_before`, `_after`, `_exec` for triggering hooks; keep normal coding habits.

---

## 🏆 Advantages

- More memory-friendly than history-based stores; safe for large or transient values
- Hooks, metadata, and observables are all extensible per key
- Pure JS/TS—usable on React, Vue, Node, or anywhere else

---

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