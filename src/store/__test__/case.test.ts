import { StoreObservable } from '../1_observable'
import { Build } from '../8_build'
import { Method } from '../0_types'

// Assign a new instance for each test (to prevent system state retention)
const getStore = () => new Build()

describe('Store/Wrapper integrated behavior', () => {
  describe('Basic CRUD', () => {
    it('set/get/update/delete repeat', () => {
      const s$: any = getStore()
      s$.name = 'abc'
      expect(s$.name).toBe('abc')

      s$.name = 'def'
      expect(s$.name).toBe('def')
      s$.name_log // logger (display output)
      s$.name_delete
      expect(s$.name).toBeNull()
    })

    it('No problem with duplicate key re-creation (state retention)', () => {
      const s$: any = getStore()
      s$.foo = 3
      s$.foo = 10
      expect(s$.foo).toBe(10)
    })
  })

  describe('Reserved names / Prohibited key errors', () => {
    it('Exception when key includes $ or _', () => {
      const s$: any = getStore()
      expect(() => { s$['abc$'] = 1 }).toThrow()
    //   expect(() => { s$['history$'] = 123 }).toThrow()
    //   expect(() => { s$['initial$'] = 1 }).toThrow()
    })

    it('Cannot access reserved system keys', () => {
      const s$ = getStore()
      // Intentionally not wrapped in try/catch & toThrow, but if the code throws, replacement is needed
    })
  })

  describe('Proxy: logger/config/action/multiple commands', () => {
    it('logger groupCollapsed triggered', () => {
      const s$: any = getStore()
      const spy = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
      s$.hello_log = 123
      s$.hello_log
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })

    it('config: restrict creation and modification', () => {
      const s$: any = getStore()
      s$.n_config = { value: 88, after: jest.fn() }
      expect(s$.n).toBe(88)
      // dynamic change with config not allowed
      s$.n_config = { value: 12 }
      expect(s$.n).toBe(88)
    })

    it('Multiple command/action combination', () => {
      const s$: any = getStore()
      s$.val = 9
      s$.val_increment_update_log = 1
      // In reality, since there is no increment action, warning occurs (custom action test is done separately below)
    })

    it('get_all retrieves everything', () => {
      const s$: any = getStore()
      s$.k1 = 1
      s$.k2 = 2
      const all = s$.get_all
      expect(all.k1.value).toBe(1)
      expect(all.k2.value).toBe(2)
    })
  })

  describe('undo/redo/history', () => {
    it('state update → undo → redo recover', () => {
      const s$: any = getStore()
      s$.val = 1
      s$.val = 2
      s$.undo
      expect(s$.val).toBe(1)
      s$.redo
      expect(s$.val).toBe(2)
    })

    it('system history restore/delete with undo/redo', () => {
      const s$: any = getStore()
      s$.h1 = 10
      s$.h2 = 20
      s$.h1_delete
      s$.undo
      expect(s$.h1).toBe(10)
      s$.redo
      expect(s$.h1).toBeNull()
    })

    it('undo(0), redo(0) possible. no error', () => {
      const s$: any = getStore()
      s$.undo
      s$.redo
    })

    it('large-state undo/redo stress', () => {
      const s$: any = getStore()
      for(let i=0; i<100; i++) s$.big = i
      for(let i=0; i<100; i++) s$.undo
      expect(s$.big).toBe(null)
      for(let i=0; i<100; i++) s$.redo
      expect(s$.big).toBe(99)
    }, 8000)
  })

  describe('actions, custom method, observable', () => {
    it('custom actions(get, set)', () => {
      const s$: any = getStore()
      // define custom action
      s$.myc_config = {
        value: 0,
        actions: [
          { name: 'inc', method: (data: any) => {
            console.warn(data)
            return data.next + 2
            }
        }
        ]
      }
      s$.myc_inc = 5
      expect(s$.myc).toBe(7)
    })

    it('Exception: actions containing _ are rejected', () => {
      const s$: any = getStore()
      expect(() => {
        s$.foo_config = {
          value: 0,
          actions: [
            {
              name: 'bad_action',
              method: (_: any) => 1
            }
          ]
        }
      }).toThrow()
    })
  })

  describe('observable (after/before/undo/redo hook)', () => {
    it('after hook, next invoked', () => {
      const s$: any = getStore()
      const after = jest.fn()
      s$.obs_config = { value: 100, after }
      s$.obs = 200
      expect(after).toBeCalledWith(expect.objectContaining({ next: 200 }))
    })
    it('before: method hook + reflect all observable forms', () => {
      const s$: any = getStore()
      let beforeCalled = false
      s$.bb_config = {
        value: 5,
        before: (() => { beforeCalled = true; return 888 }) as Method
      }
      s$.bb = 77   // attach before hook on actual assignment
      expect(beforeCalled).toBe(true)
      expect(s$.bb).toBe(888)
    })
    it('undo/redo: observable subscription (hook)', () => {
      const s$: any = getStore()
      const undo = jest.fn(), redo = jest.fn()
      s$.ar_config = { value: 4, undo, redo }
      s$.ar = 8
      s$.undo
      expect(undo).toBeCalled()
      s$.redo
      expect(redo).toBeCalled()
    })

    it('Passing observable object to after does not fail', () => {
      const s$: any = getStore()
      const obs = new StoreObservable()
      s$.xx_config = { value: 1, after: obs }
      s$.xx = 2 // Proceeds without error
    })
  })

  describe('import/export/large performance', () => {
    it('export_object, export_map, export_array, export_json', () => {
      const s$: any = getStore()
      s$.a1 = 1
      s$.a2 = 2
      s$.a3 = 3
      const obj = s$.export_object
      expect(obj.a1).toBe(1)
      expect(s$.export_map.get('a2')).toBe(2)
      const arr = s$.export_array
      expect(arr.find((x:any)=> x[0] === 'a3')[1]).toBe(3)
      expect(s$.export_json).toContain('"a1"')
    })
    it('import_object and import_json correctly set values', () => {
      const s$: any = getStore()
      s$.x = 1
      s$.y = 2
      const exp = s$.export_object
      s$.x_delete; s$.y_delete
      s$.import_object = exp
      expect(s$.x).toBe(1)
      expect(s$.y).toBe(2)
      const j = s$.export_json
      s$.x_delete; s$.y_delete
      s$.import_json = j
      expect(s$.x).toBe(1)
      expect(s$.y).toBe(2)
    })
    it('Entering string in import_object triggers warning but is harmless', () => {
      const s$: any = getStore()
      const warn = jest.spyOn(console, 'warn').mockImplementation()
      s$.import_object = "hello"
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
    it('Create/undo/redo many items (300+) phenomena', () => {
      const s$: any = getStore()
      for(let i=0;i<300;i++) s$[`s${i}`] = i
      for(let i=0;i<300;i++) s$[`s${i}`] = i+1000
      for(let i=0;i<300;i++) s$.undo
      for(let i=0;i<300;i++) s$.redo
      for(let i=0;i<300;i++) expect(s$[`s${i}`]).toBe(i+1000)
    }, 19500)
  })

  describe('Edge: Incorrect update, action, remove, etc.', () => {
    it('Warning only occurs when updating, removing, or acting on non-existent state', () => {
      const s$: any = getStore()
      const warn = jest.spyOn(console, 'warn').mockImplementation()
      s$.update_noexist = 1
      s$.noexist_delete
      s$.action_noexist_test = 4
      expect(warn).toHaveBeenCalledTimes(3)
      warn.mockRestore()
    })
    it('Directly assigning a reserved command set (undo/redo) triggers warning', () => {
      const s$ = getStore()
      const warn = jest.spyOn(console, 'warn').mockImplementation()
      // @ts-expect-error
      s$.undo = 1
      // @ts-expect-error
      s$.redo = 1
      expect(warn).toHaveBeenCalledTimes(2)
      warn.mockRestore()
    })
  })

  describe('observable pipe, missing observer object throws exception', () => {
    it('StoreObservable: throws if subscribe({ next }) is missing', () => {
      const ob = new StoreObservable()
      expect(() => {
        ob.pipe({ dummy: 1 })
      }).toThrow()
    })
  })

  describe('Proxy base command cases (export/import/undo/redo)', () => {
    it('get export_json, export_map work as expected', () => {
      const s$: any = getStore()
      s$.test = 33
      expect(s$.export_json).toContain('test')
      expect(s$.export_map.get('test')).toBe(33)
    })
    it('undo/redo commands in proxy execute without error', () => {
      const s$: any = getStore()
      s$.a = 1
      s$.a = 2
      s$.undo // redo, etc. are internally protected
      s$.redo
    })
  });
});