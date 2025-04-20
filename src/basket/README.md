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
- `r$.import_object = {...}` : Bulk import from an object  
- `r$.import_json = '{...}'` : Bulk import from a JSON string

---

### **Observable Integration**

You can pipe any RxJS logic into a timing hook.

```ts
import { bob$ } from 'solidstore'
import { filter } from 'rxjs'

r$.x_config = {
  value: 5,
  beforeSet: new bob$().pipe(filter(val => val > 3)).subscribe({ next: (v) => console.log('Over 3:', v) })
}
r$.x_before = 10;  // Outputs: 'Over 3: 10'
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

## 🧩 License

MIT ⓒ solidstore

---

If you want a detailed API signature/types reference section as well, just let me know!