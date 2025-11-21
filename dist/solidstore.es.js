var Je = Object.defineProperty;
var we = (s) => {
  throw TypeError(s);
};
var Ke = (s, n, e) => n in s ? Je(s, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[n] = e;
var v = (s, n, e) => Ke(s, typeof n != "symbol" ? n + "" : n, e), He = (s, n, e) => n.has(s) || we("Cannot " + e);
var g = (s, n, e) => (He(s, n, "read from private field"), e ? e.call(s) : n.get(s)), m = (s, n, e) => n.has(s) ? we("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(s) : n.set(s, e);
var ue = function(s, n) {
  return ue = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
    e.__proto__ = t;
  } || function(e, t) {
    for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
  }, ue(s, n);
};
function ee(s, n) {
  if (typeof n != "function" && n !== null)
    throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
  ue(s, n);
  function e() {
    this.constructor = s;
  }
  s.prototype = n === null ? Object.create(n) : (e.prototype = n.prototype, new e());
}
function ae(s) {
  var n = typeof Symbol == "function" && Symbol.iterator, e = n && s[n], t = 0;
  if (e) return e.call(s);
  if (s && typeof s.length == "number") return {
    next: function() {
      return s && t >= s.length && (s = void 0), { value: s && s[t++], done: !s };
    }
  };
  throw new TypeError(n ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function le(s, n) {
  var e = typeof Symbol == "function" && s[Symbol.iterator];
  if (!e) return s;
  var t = e.call(s), r, i = [], o;
  try {
    for (; (n === void 0 || n-- > 0) && !(r = t.next()).done; ) i.push(r.value);
  } catch (u) {
    o = { error: u };
  } finally {
    try {
      r && !r.done && (e = t.return) && e.call(t);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}
function fe(s, n, e) {
  if (e || arguments.length === 2) for (var t = 0, r = n.length, i; t < r; t++)
    (i || !(t in n)) && (i || (i = Array.prototype.slice.call(n, 0, t)), i[t] = n[t]);
  return s.concat(i || Array.prototype.slice.call(n));
}
function O(s) {
  return typeof s == "function";
}
function Pe(s) {
  var n = function(t) {
    Error.call(t), t.stack = new Error().stack;
  }, e = s(n);
  return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e;
}
var se = Pe(function(s) {
  return function(e) {
    s(this), this.message = e ? e.length + ` errors occurred during unsubscription:
` + e.map(function(t, r) {
      return r + 1 + ") " + t.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = e;
  };
});
function he(s, n) {
  if (s) {
    var e = s.indexOf(n);
    0 <= e && s.splice(e, 1);
  }
}
var te = function() {
  function s(n) {
    this.initialTeardown = n, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return s.prototype.unsubscribe = function() {
    var n, e, t, r, i;
    if (!this.closed) {
      this.closed = !0;
      var o = this._parentage;
      if (o)
        if (this._parentage = null, Array.isArray(o))
          try {
            for (var u = ae(o), c = u.next(); !c.done; c = u.next()) {
              var a = c.value;
              a.remove(this);
            }
          } catch (f) {
            n = { error: f };
          } finally {
            try {
              c && !c.done && (e = u.return) && e.call(u);
            } finally {
              if (n) throw n.error;
            }
          }
        else
          o.remove(this);
      var p = this.initialTeardown;
      if (O(p))
        try {
          p();
        } catch (f) {
          i = f instanceof se ? f.errors : [f];
        }
      var l = this._finalizers;
      if (l) {
        this._finalizers = null;
        try {
          for (var d = ae(l), b = d.next(); !b.done; b = d.next()) {
            var y = b.value;
            try {
              Se(y);
            } catch (f) {
              i = i ?? [], f instanceof se ? i = fe(fe([], le(i)), le(f.errors)) : i.push(f);
            }
          }
        } catch (f) {
          t = { error: f };
        } finally {
          try {
            b && !b.done && (r = d.return) && r.call(d);
          } finally {
            if (t) throw t.error;
          }
        }
      }
      if (i)
        throw new se(i);
    }
  }, s.prototype.add = function(n) {
    var e;
    if (n && n !== this)
      if (this.closed)
        Se(n);
      else {
        if (n instanceof s) {
          if (n.closed || n._hasParent(this))
            return;
          n._addParent(this);
        }
        (this._finalizers = (e = this._finalizers) !== null && e !== void 0 ? e : []).push(n);
      }
  }, s.prototype._hasParent = function(n) {
    var e = this._parentage;
    return e === n || Array.isArray(e) && e.includes(n);
  }, s.prototype._addParent = function(n) {
    var e = this._parentage;
    this._parentage = Array.isArray(e) ? (e.push(n), e) : e ? [e, n] : n;
  }, s.prototype._removeParent = function(n) {
    var e = this._parentage;
    e === n ? this._parentage = null : Array.isArray(e) && he(e, n);
  }, s.prototype.remove = function(n) {
    var e = this._finalizers;
    e && he(e, n), n instanceof s && n._removeParent(this);
  }, s.EMPTY = function() {
    var n = new s();
    return n.closed = !0, n;
  }(), s;
}(), je = te.EMPTY;
function Ae(s) {
  return s instanceof te || s && "closed" in s && O(s.remove) && O(s.add) && O(s.unsubscribe);
}
function Se(s) {
  O(s) ? s() : s.unsubscribe();
}
var Le = {
  Promise: void 0
}, Ye = {
  setTimeout: function(s, n) {
    for (var e = [], t = 2; t < arguments.length; t++)
      e[t - 2] = arguments[t];
    return setTimeout.apply(void 0, fe([s, n], le(e)));
  },
  clearTimeout: function(s) {
    return clearTimeout(s);
  },
  delegate: void 0
};
function Ve(s) {
  Ye.setTimeout(function() {
    throw s;
  });
}
function xe() {
}
function C(s) {
  s();
}
var Ce = function(s) {
  ee(n, s);
  function n(e) {
    var t = s.call(this) || this;
    return t.isStopped = !1, e ? (t.destination = e, Ae(e) && e.add(t)) : t.destination = We, t;
  }
  return n.create = function(e, t, r) {
    return new de(e, t, r);
  }, n.prototype.next = function(e) {
    this.isStopped || this._next(e);
  }, n.prototype.error = function(e) {
    this.isStopped || (this.isStopped = !0, this._error(e));
  }, n.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, n.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, s.prototype.unsubscribe.call(this), this.destination = null);
  }, n.prototype._next = function(e) {
    this.destination.next(e);
  }, n.prototype._error = function(e) {
    try {
      this.destination.error(e);
    } finally {
      this.unsubscribe();
    }
  }, n.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, n;
}(te), ze = function() {
  function s(n) {
    this.partialObserver = n;
  }
  return s.prototype.next = function(n) {
    var e = this.partialObserver;
    if (e.next)
      try {
        e.next(n);
      } catch (t) {
        A(t);
      }
  }, s.prototype.error = function(n) {
    var e = this.partialObserver;
    if (e.error)
      try {
        e.error(n);
      } catch (t) {
        A(t);
      }
    else
      A(n);
  }, s.prototype.complete = function() {
    var n = this.partialObserver;
    if (n.complete)
      try {
        n.complete();
      } catch (e) {
        A(e);
      }
  }, s;
}(), de = function(s) {
  ee(n, s);
  function n(e, t, r) {
    var i = s.call(this) || this, o;
    return O(e) || !e ? o = {
      next: e ?? void 0,
      error: t ?? void 0,
      complete: r ?? void 0
    } : o = e, i.destination = new ze(o), i;
  }
  return n;
}(Ce);
function A(s) {
  Ve(s);
}
function Ge(s) {
  throw s;
}
var We = {
  closed: !0,
  next: xe,
  error: Ge,
  complete: xe
}, qe = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function Qe(s) {
  return s;
}
function Xe(s) {
  return s.length === 0 ? Qe : s.length === 1 ? s[0] : function(e) {
    return s.reduce(function(t, r) {
      return r(t);
    }, e);
  };
}
var Oe = function() {
  function s(n) {
    n && (this._subscribe = n);
  }
  return s.prototype.lift = function(n) {
    var e = new s();
    return e.source = this, e.operator = n, e;
  }, s.prototype.subscribe = function(n, e, t) {
    var r = this, i = et(n) ? n : new de(n, e, t);
    return C(function() {
      var o = r, u = o.operator, c = o.source;
      i.add(u ? u.call(i, c) : c ? r._subscribe(i) : r._trySubscribe(i));
    }), i;
  }, s.prototype._trySubscribe = function(n) {
    try {
      return this._subscribe(n);
    } catch (e) {
      n.error(e);
    }
  }, s.prototype.forEach = function(n, e) {
    var t = this;
    return e = Ee(e), new e(function(r, i) {
      var o = new de({
        next: function(u) {
          try {
            n(u);
          } catch (c) {
            i(c), o.unsubscribe();
          }
        },
        error: i,
        complete: r
      });
      t.subscribe(o);
    });
  }, s.prototype._subscribe = function(n) {
    var e;
    return (e = this.source) === null || e === void 0 ? void 0 : e.subscribe(n);
  }, s.prototype[qe] = function() {
    return this;
  }, s.prototype.pipe = function() {
    for (var n = [], e = 0; e < arguments.length; e++)
      n[e] = arguments[e];
    return Xe(n)(this);
  }, s.prototype.toPromise = function(n) {
    var e = this;
    return n = Ee(n), new n(function(t, r) {
      var i;
      e.subscribe(function(o) {
        return i = o;
      }, function(o) {
        return r(o);
      }, function() {
        return t(i);
      });
    });
  }, s.create = function(n) {
    return new s(n);
  }, s;
}();
function Ee(s) {
  var n;
  return (n = s ?? Le.Promise) !== null && n !== void 0 ? n : Promise;
}
function Ze(s) {
  return s && O(s.next) && O(s.error) && O(s.complete);
}
function et(s) {
  return s && s instanceof Ce || Ze(s) && Ae(s);
}
var tt = Pe(function(s) {
  return function() {
    s(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), _e = function(s) {
  ee(n, s);
  function n() {
    var e = s.call(this) || this;
    return e.closed = !1, e.currentObservers = null, e.observers = [], e.isStopped = !1, e.hasError = !1, e.thrownError = null, e;
  }
  return n.prototype.lift = function(e) {
    var t = new Te(this, this);
    return t.operator = e, t;
  }, n.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new tt();
  }, n.prototype.next = function(e) {
    var t = this;
    C(function() {
      var r, i;
      if (t._throwIfClosed(), !t.isStopped) {
        t.currentObservers || (t.currentObservers = Array.from(t.observers));
        try {
          for (var o = ae(t.currentObservers), u = o.next(); !u.done; u = o.next()) {
            var c = u.value;
            c.next(e);
          }
        } catch (a) {
          r = { error: a };
        } finally {
          try {
            u && !u.done && (i = o.return) && i.call(o);
          } finally {
            if (r) throw r.error;
          }
        }
      }
    });
  }, n.prototype.error = function(e) {
    var t = this;
    C(function() {
      if (t._throwIfClosed(), !t.isStopped) {
        t.hasError = t.isStopped = !0, t.thrownError = e;
        for (var r = t.observers; r.length; )
          r.shift().error(e);
      }
    });
  }, n.prototype.complete = function() {
    var e = this;
    C(function() {
      if (e._throwIfClosed(), !e.isStopped) {
        e.isStopped = !0;
        for (var t = e.observers; t.length; )
          t.shift().complete();
      }
    });
  }, n.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(n.prototype, "observed", {
    get: function() {
      var e;
      return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), n.prototype._trySubscribe = function(e) {
    return this._throwIfClosed(), s.prototype._trySubscribe.call(this, e);
  }, n.prototype._subscribe = function(e) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
  }, n.prototype._innerSubscribe = function(e) {
    var t = this, r = this, i = r.hasError, o = r.isStopped, u = r.observers;
    return i || o ? je : (this.currentObservers = null, u.push(e), new te(function() {
      t.currentObservers = null, he(u, e);
    }));
  }, n.prototype._checkFinalizedStatuses = function(e) {
    var t = this, r = t.hasError, i = t.thrownError, o = t.isStopped;
    r ? e.error(i) : o && e.complete();
  }, n.prototype.asObservable = function() {
    var e = new Oe();
    return e.source = this, e;
  }, n.create = function(e, t) {
    return new Te(e, t);
  }, n;
}(Oe), Te = function(s) {
  ee(n, s);
  function n(e, t) {
    var r = s.call(this) || this;
    return r.destination = e, r.source = t, r;
  }
  return n.prototype.next = function(e) {
    var t, r;
    (r = (t = this.destination) === null || t === void 0 ? void 0 : t.next) === null || r === void 0 || r.call(t, e);
  }, n.prototype.error = function(e) {
    var t, r;
    (r = (t = this.destination) === null || t === void 0 ? void 0 : t.error) === null || r === void 0 || r.call(t, e);
  }, n.prototype.complete = function() {
    var e, t;
    (t = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || t === void 0 || t.call(e);
  }, n.prototype._subscribe = function(e) {
    var t, r;
    return (r = (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(e)) !== null && r !== void 0 ? r : je;
  }, n;
}(_e);
class ke extends _e {
  constructor() {
    super();
    v(this, "pipe0", super.pipe);
    v(this, "pipe", (e) => {
      let t = this.pipe0(e);
      return t.subscribe0 = t.subscribe, t.subscribe = (r) => {
        if (!r.hasOwnProperty("next"))
          throw "no exist next! in subscribe({ ... })";
        return t.subscribe0({
          next: (i) => r.next(i),
          complete: r.complete || void 0,
          error: r.complete || void 0
        });
      }, t;
    });
  }
}
class rt {
  constructor() {
    v(this, "getNewRegister");
  }
}
const st = "font-style: italic; font-weight: 700; color: #D9F8C4;", nt = "font-style: italic; font-weight: 700; color: #ebc078;", it = "font-style: italic; font-weight: 700; color: #eb6c63;", ot = "font-style: italic; font-weight: 700; color: #8fdfff;";
class pe extends rt {
}
// constructor () {
// 	super()
// 	this.getNewRegister(this)
// }
v(pe, "getNewRegister", (n = {}) => {
  const e = {
    configs$: /* @__PURE__ */ new Map(),
    get: function(t, r) {
      var l, d, b;
      switch (r) {
        case "export_object":
          return this.method("export_object", t);
        case "export_array":
          return this.method("export_array", t);
        case "export_map":
          return this.method("export_map", t);
        case "export_json":
          return this.method("export_json", t);
        case "getNewRegister":
          return t[r];
      }
      const i = r.split("_");
      r = i.shift();
      let o = !1, u = !1, c = !1, a = !1, p = !1;
      if (!t.hasOwnProperty(r))
        return console.warn(`(BASKET) Cannot access. [ ${r} ] is no exists.`), !0;
      for (let y of i)
        switch (y) {
          case "log":
            o = !0;
            break;
          case "config":
            u = !0;
            break;
          case "delete":
            c = !0;
            break;
          case "before":
            a = !0;
            break;
          case "exec":
            p = !0;
            break;
          default:
            return console.warn(`(BASKET) _(underbar or underline) can't use in the name. please use camelcase. or invalid command. [ ${y} ]`), !0;
        }
      return c ? ((l = this.configs$.get(r)) != null && l.beforeDelete && this.configs$.get(r).beforeDelete.next(t[r]), delete t[r], this.configs$.delete(r), o && console.log(`%c(BASKET) [ ${r} ] is deleted.`, it), (d = this.configs$.get(r)) != null && d.afterDelete && this.configs$.get(r).afterDelete.next(null), !0) : (o && (console.groupCollapsed(`%c(BASKET) [ ${r} ] = ${this.logger(t[r])}(${this.typeCheck(t[r])}) is accessed.`, ot), console.log(t[r]), console.trace(), console.groupEnd()), u ? this.configs$.has(r) ? this.configs$.get(r) : null : ((b = this.configs$.get(r)) != null && b.beforeGet && (a || p) && this.configs$.get(r).beforeGet.next(t[r]), t[r]));
    },
    set: function(t, r, i) {
      var b, y;
      switch (r) {
        case "import_object":
          return this.method("import_object", t, i), !0;
        case "import_json":
          return this.method("import_json", t, i), !0;
        case "getNewRegister":
          return console.warn("(Basket) [ getNewRegister ] is reserved word. Cannot use."), !0;
      }
      const o = r.split("_");
      r = o.shift();
      let u = !1, c = !1, a = !1, p = !1, l = !1, d = {};
      for (let f of o)
        switch (f) {
          case "log":
            u = !0;
            break;
          case "config":
            c = !0;
            break;
          case "before":
            a = !0;
            break;
          case "after":
            p = !0;
            break;
          case "exec":
            l = !0;
            break;
          default:
            return console.warn(`(BASKET) _(underbar or underline) can't use in the name. please use camelcase. or invalid command. [ ${f} ]`), !0;
        }
      if (!t.hasOwnProperty(r)) {
        if (c) {
          i != null && i.value || (i.value = null);
          for (let f in i)
            switch (f) {
              case "beforeCreate":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "afterCreate":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "beforeGet":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "beforeSet":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "afterSet":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "beforeDelete":
                d[f] = this.convertToObservable(i[f]);
                break;
              case "afterDelete":
                d[f] = this.convertToObservable(i[f]);
                break;
              default:
                d[f] = i[f];
            }
          this.configs$.set(r, d), i = i.value;
        } else
          this.configs$.set(r, d), d = this.configs$.get(r);
        return d != null && d.beforeCreate && d.beforeCreate.next(i), t[r] = i, d != null && d.afterCreate && d.afterCreate.next(i), u && (console.groupCollapsed(`%c(BASKET) [ ${r} ] = ${this.logger(i)}(${this.typeCheck(i)}) is created.`, st), console.log(i), console.trace(), console.groupEnd()), !0;
      }
      return c ? (console.warn(`(BASKET) Cannot configure. Configurate initialize. The [ ${r} ] is already exists.`), !0) : ((b = this.configs$.get(r)) != null && b.beforeSet && (a || l) && this.configs$.get(r).beforeSet.next(t[r]), t[r] = i, u && (console.groupCollapsed(`%c(BASKET) [ ${r} ] = ${this.logger(i)}(${this.typeCheck(i)}) is updated.`, nt), console.log(i), console.trace(), console.groupEnd()), (y = this.configs$.get(r)) != null && y.afterSet && (p || l) && this.configs$.get(r).afterSet.next(i), !0);
    },
    logger: (t) => {
      let r;
      return typeof t == "object" ? r = JSON.stringify(t) : r = t, r;
    },
    typeCheck: (t) => {
      let r;
      switch (t) {
        case null:
          r = "null";
          break;
        default:
          r = typeof t;
      }
      return r;
    },
    method: function(t, r, i = null) {
      const o = {};
      switch (t) {
        case "export_object":
          for (let c of Object.entries(r))
            o[c[0]] = c[1];
          return o;
        case "export_array":
          return Object.entries(r);
        case "export_map":
          const u = /* @__PURE__ */ new Map();
          for (let c of Object.entries(r))
            u.set(c[0], c[1]);
          return u;
        case "export_json":
          for (let c of Object.entries(r))
            o[c[0]] = c[1];
          return JSON.stringify(o);
        case "import_object":
          if (typeof i != "object")
            return console.warn("(BASKET) It is not Object type."), console.log(i), !0;
          for (let c of Object.entries(r))
            c[0] !== "getNewRegister" && delete r[c[0]];
          this.configs$.clear();
          for (let c in i)
            r[c] = i[c], this.configs$.set(c, {});
          return !0;
        case "import_json":
          if (typeof i != "string")
            return console.warn("(BASKET) Please stringify."), console.log(i), !0;
          i = JSON.parse(i);
          for (let c of Object.entries(r))
            c[0] !== "getNewRegister" && delete r[c[0]];
          this.configs$.clear();
          for (let c in i)
            r[c] = i[c], this.configs$.set(c, {});
          return !0;
      }
    },
    convertToObservable: (t) => typeof t != "function" ? t : new ke().subscribe(t),
    deleteProperty: function(t, r) {
      return console.warn(`Cannot delete [ ${r} ]. Please use delete command. -> S$.${r}_delete`), !0;
    }
  };
  return new Proxy(n, e);
});
class Ie extends _e {
  constructor() {
    super();
    v(this, "pipe0", super.pipe);
    v(this, "pipe", (e) => {
      let t = this.pipe0(e);
      return t.subscribe0 = t.subscribe, t.subscribe = (r) => {
        if (!r.hasOwnProperty("next"))
          throw "no exist next! in subscribe({ ... })";
        return t.subscribe0({
          next: (i) => r.next(i),
          complete: r.complete || void 0,
          error: r.complete || void 0
        });
      }, t;
    });
  }
}
function _(s) {
  return `Minified Redux error #${s}; visit https://redux.js.org/Errors?code=${s} for the full message or use the non-minified dev environment for full errors. `;
}
var ct = typeof Symbol == "function" && Symbol.observable || "@@observable", Re = ct, ne = () => Math.random().toString(36).substring(7).split("").join("."), ut = {
  INIT: `@@redux/INIT${/* @__PURE__ */ ne()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ ne()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${ne()}`
}, k = ut;
function at(s) {
  if (typeof s != "object" || s === null)
    return !1;
  let n = s;
  for (; Object.getPrototypeOf(n) !== null; )
    n = Object.getPrototypeOf(n);
  return Object.getPrototypeOf(s) === n || Object.getPrototypeOf(s) === null;
}
function Ue(s, n, e) {
  if (typeof s != "function")
    throw new Error(_(2));
  if (typeof n == "function" && typeof e == "function" || typeof e == "function" && typeof arguments[3] == "function")
    throw new Error(_(0));
  if (typeof n == "function" && typeof e > "u" && (e = n, n = void 0), typeof e < "u") {
    if (typeof e != "function")
      throw new Error(_(1));
    return e(Ue)(s, n);
  }
  let t = s, r = n, i = /* @__PURE__ */ new Map(), o = i, u = 0, c = !1;
  function a() {
    o === i && (o = /* @__PURE__ */ new Map(), i.forEach((h, S) => {
      o.set(S, h);
    }));
  }
  function p() {
    if (c)
      throw new Error(_(3));
    return r;
  }
  function l(h) {
    if (typeof h != "function")
      throw new Error(_(4));
    if (c)
      throw new Error(_(5));
    let S = !0;
    a();
    const E = u++;
    return o.set(E, h), function() {
      if (S) {
        if (c)
          throw new Error(_(6));
        S = !1, a(), o.delete(E), i = null;
      }
    };
  }
  function d(h) {
    if (!at(h))
      throw new Error(_(7));
    if (typeof h.type > "u")
      throw new Error(_(8));
    if (typeof h.type != "string")
      throw new Error(_(17));
    if (c)
      throw new Error(_(9));
    try {
      c = !0, r = t(r, h);
    } finally {
      c = !1;
    }
    return (i = o).forEach((E) => {
      E();
    }), h;
  }
  function b(h) {
    if (typeof h != "function")
      throw new Error(_(10));
    t = h, d({
      type: k.REPLACE
    });
  }
  function y() {
    const h = l;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(S) {
        if (typeof S != "object" || S === null)
          throw new Error(_(11));
        function E() {
          const $e = S;
          $e.next && $e.next(p());
        }
        return E(), {
          unsubscribe: h(E)
        };
      },
      [Re]() {
        return this;
      }
    };
  }
  return d({
    type: k.INIT
  }), {
    dispatch: d,
    subscribe: l,
    getState: p,
    replaceReducer: b,
    [Re]: y
  };
}
function Ne(s, n, e) {
  return Ue(s, n, e);
}
function lt(s) {
  Object.keys(s).forEach((n) => {
    const e = s[n];
    if (typeof e(void 0, {
      type: k.INIT
    }) > "u")
      throw new Error(_(12));
    if (typeof e(void 0, {
      type: k.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(_(13));
  });
}
function T(s) {
  const n = Object.keys(s), e = {};
  for (let i = 0; i < n.length; i++) {
    const o = n[i];
    typeof s[o] == "function" && (e[o] = s[o]);
  }
  const t = Object.keys(e);
  let r;
  try {
    lt(e);
  } catch (i) {
    r = i;
  }
  return function(o = {}, u) {
    if (r)
      throw r;
    let c = !1;
    const a = {};
    for (let p = 0; p < t.length; p++) {
      const l = t[p], d = e[l], b = o[l], y = d(b, u);
      if (typeof y > "u")
        throw u && u.type, new Error(_(14));
      a[l] = y, c = c || y !== b;
    }
    return c = c || t.length !== Object.keys(o).length, c ? a : o;
  };
}
function Me(...s) {
  return s.length === 0 ? (n) => n : s.length === 1 ? s[0] : s.reduce((n, e) => (...t) => n(e(...t)));
}
function ft(...s) {
  return (n) => (e, t) => {
    const r = n(e, t);
    let i = () => {
      throw new Error(_(15));
    };
    const o = {
      getState: r.getState,
      dispatch: (c, ...a) => i(c, ...a)
    }, u = s.map((c) => c(o));
    return i = Me(...u)(r.dispatch), {
      ...r,
      dispatch: i
    };
  };
}
const j = {
  UNDO: "@@redux-undo/UNDO",
  REDO: "@@redux-undo/REDO",
  JUMP_TO_FUTURE: "@@redux-undo/JUMP_TO_FUTURE",
  JUMP_TO_PAST: "@@redux-undo/JUMP_TO_PAST",
  JUMP: "@@redux-undo/JUMP",
  CLEAR_HISTORY: "@@redux-undo/CLEAR_HISTORY"
};
function ye(s, n = []) {
  return Array.isArray(s) ? s : typeof s == "string" ? [s] : n;
}
function ht(s) {
  return typeof s.present < "u" && typeof s.future < "u" && typeof s.past < "u" && Array.isArray(s.future) && Array.isArray(s.past);
}
function be(s) {
  const n = ye(s);
  return (e) => n.indexOf(e.type) >= 0;
}
function P(s, n, e, t = null) {
  return {
    past: s,
    present: n,
    future: e,
    group: t,
    _latestUnfiltered: n,
    index: s.length,
    limit: s.length + e.length + 1
  };
}
let re, w;
const ge = {
  prevState: "#9E9E9E",
  action: "#03A9F4",
  nextState: "#4CAF50"
};
function dt() {
  w = {
    header: [],
    prev: [],
    action: [],
    next: [],
    msgs: []
  };
}
function pt() {
  const { header: s, prev: n, next: e, action: t, msgs: r } = w;
  console.group ? (console.groupCollapsed(...s), console.log(...n), console.log(...t), console.log(...e), console.log(...r), console.groupEnd()) : (console.log(...s), console.log(...n), console.log(...t), console.log(...e), console.log(...r));
}
function ve(s, n, e) {
  return [
    `%c${s}`,
    `color: ${n}; font-weight: bold`,
    e
  ];
}
function yt(s, n) {
  dt(), re && (console.group ? (w.header = ["%credux-undo", "font-style: italic", "action", s.type], w.action = ve("action", ge.action, s), w.prev = ve("prev history", ge.prevState, n)) : (w.header = ["redux-undo action", s.type], w.action = ["action", s], w.prev = ["prev history", n]));
}
function x(s) {
  re && (console.group ? w.next = ve("next history", ge.nextState, s) : w.next = ["next history", s], pt());
}
function $(...s) {
  re && (w.msgs = w.msgs.concat([...s, `
`]));
}
function bt(s) {
  re = s;
}
function ie(s, n) {
  const e = P([], s, []);
  return n && (e._latestUnfiltered = null), e;
}
function gt(s, n, e, t) {
  const r = s.past.length + 1;
  $("inserting", n), $("new free: ", e - r);
  const { past: i, _latestUnfiltered: o } = s, u = e && e <= r, c = i.slice(u ? 1 : 0), a = o != null ? [
    ...c,
    o
  ] : c;
  return P(a, n, [], t);
}
function De(s, n) {
  if (n < 0 || n >= s.future.length)
    return s;
  const { past: e, future: t, _latestUnfiltered: r } = s, i = [...e, r, ...t.slice(0, n)], o = t[n], u = t.slice(n + 1);
  return P(i, o, u);
}
function Fe(s, n) {
  if (n < 0 || n >= s.past.length)
    return s;
  const { past: e, future: t, _latestUnfiltered: r } = s, i = e.slice(0, n), o = [...e.slice(n + 1), r, ...t], u = e[n];
  return P(i, u, o);
}
function oe(s, n) {
  return n > 0 ? De(s, n - 1) : n < 0 ? Fe(s, s.past.length + n) : s;
}
function vt(s, n) {
  return n.indexOf(s) > -1 ? s : !s;
}
function me(s, n = {}) {
  bt(n.debug);
  const e = {
    limit: void 0,
    filter: () => !0,
    groupBy: () => null,
    undoType: j.UNDO,
    redoType: j.REDO,
    jumpToPastType: j.JUMP_TO_PAST,
    jumpToFutureType: j.JUMP_TO_FUTURE,
    jumpType: j.JUMP,
    neverSkipReducer: !1,
    ignoreInitialState: !1,
    syncFilter: !1,
    ...n,
    initTypes: ye(n.initTypes, ["@@redux-undo/INIT"]),
    clearHistoryType: ye(
      n.clearHistoryType,
      [j.CLEAR_HISTORY]
    )
  }, t = e.neverSkipReducer ? (i, o, ...u) => ({
    ...i,
    present: s(i.present, o, ...u)
  }) : (i) => i;
  let r;
  return (i = r, o = {}, ...u) => {
    yt(o, i);
    let c = i;
    if (!r)
      if ($("history is uninitialized"), i === void 0) {
        const p = s(i, { type: "@@redux-undo/CREATE_HISTORY" }, ...u);
        return c = ie(
          p,
          e.ignoreInitialState
        ), $("do not set initialState on probe actions"), x(c), c;
      } else
        ht(i) ? (c = r = e.ignoreInitialState ? i : P(
          i.past,
          i.present,
          i.future
        ), $(
          "initialHistory initialized: initialState is a history",
          r
        )) : (c = r = ie(
          i,
          e.ignoreInitialState
        ), $(
          "initialHistory initialized: initialState is not a history",
          r
        ));
    let a;
    switch (o.type) {
      case void 0:
        return c;
      case e.undoType:
        return a = oe(c, -1), $("perform undo"), x(a), t(a, o, ...u);
      case e.redoType:
        return a = oe(c, 1), $("perform redo"), x(a), t(a, o, ...u);
      case e.jumpToPastType:
        return a = Fe(c, o.index), $(`perform jumpToPast to ${o.index}`), x(a), t(a, o, ...u);
      case e.jumpToFutureType:
        return a = De(c, o.index), $(`perform jumpToFuture to ${o.index}`), x(a), t(a, o, ...u);
      case e.jumpType:
        return a = oe(c, o.index), $(`perform jump to ${o.index}`), x(a), t(a, o, ...u);
      case vt(o.type, e.clearHistoryType):
        return a = ie(c.present, e.ignoreInitialState), $("perform clearHistory"), x(a), t(a, o, ...u);
      default:
        if (a = s(
          c.present,
          o,
          ...u
        ), e.initTypes.some((l) => l === o.type))
          return $("reset history due to init action"), x(r), r;
        if (c._latestUnfiltered === a)
          return c;
        if (typeof e.filter == "function" && !e.filter(
          o,
          a,
          c
        )) {
          const l = P(
            c.past,
            a,
            c.future,
            c.group
          );
          return e.syncFilter || (l._latestUnfiltered = c._latestUnfiltered), $("filter ignored action, not storing it in past"), x(l), l;
        }
        const p = e.groupBy(o, a, c);
        if (p != null && p === c.group) {
          const l = P(
            c.past,
            a,
            c.future,
            c.group
          );
          return $("groupBy grouped the action with the previous action"), x(l), l;
        }
        return c = gt(c, a, e.limit, p), $("inserted new state into history"), x(c), c;
    }
  };
}
class mt {
  constructor() {
    v(this, "store");
    v(this, "record");
    v(this, "reducers", {});
    v(this, "recordReducers", {});
    v(this, "actions", /* @__PURE__ */ new Map());
    v(this, "recordActions", /* @__PURE__ */ new Map());
    v(this, "observables", /* @__PURE__ */ new Map());
    v(this, "methods", /* @__PURE__ */ new Map());
    v(this, "parameters", /* @__PURE__ */ new Map());
  }
}
var I;
class _t extends mt {
  constructor() {
    super();
    v(this, "setMiddleware", () => {
      if (!this.store)
        return (e) => (t) => (r) => {
          var a;
          const i = r.type.split("_")[0];
          let o = {
            name: i,
            state: this.store.getState()[i],
            action: r
          };
          r.dispatched = {
            name: o.name,
            state: o.state,
            type: r.type
          };
          let u, c = {
            target: o.name,
            trigger: r.type
          };
          if ((a = o.state) != null && a.value && (c.previous = o.state.value), r != null && r.value && (c.next = r.value), !(r.type.includes("_undo") || r.type.includes("_redo"))) {
            if (this.observables.has(`${i}_before`))
              this.observables.get(`${i}_before`).next(c);
            else if (this.methods.has(`${i}_before`)) {
              const p = this.methods.get(`${i}_before`);
              if (p) {
                let l = p(c);
                l !== r.value && (r.value = l), u = g(this, I).call(this, r), u.dispatched = r.dispatched;
              }
            }
          }
          return this.store.dispatched.push(o), u && (r = u), t(r);
        };
    });
    m(this, I, (e) => {
      if (!e.hasOwnProperty("type")) throw "No exist action.type property.";
      if (typeof e.type != "string") throw "action.type is not 'string' type.";
      if (!e.hasOwnProperty("value")) throw "No exist action.value property.";
      return e;
    });
  }
}
I = new WeakMap();
var U, N, M;
class $t extends _t {
  constructor() {
    super();
    v(this, "setRecord", () => {
      g(this, U).call(this), g(this, N).call(this), g(this, M).call(this);
    });
    m(this, U, () => {
      this.record || (this.record = Ne(
        T({ start$: (e = {}) => e })
      ));
    });
    m(this, N, () => {
      this.record.dispatch0 = this.record.dispatch, this.record.dispatched = null, this.record.dispatch = (e) => {
        const t = e.type.split("_")[0];
        let r = {
          name: t,
          state: this.record.getState()[t],
          action: e
        };
        e.dispatched = {
          name: r.name,
          state: r.state
        }, this.record.dispatched = r, this.record.dispatch0(e);
      };
    });
    m(this, M, () => {
      this.record.subscribe(() => {
        if (this.record.current = this.record.getState(), !this.record.dispatched) return;
        const e = this.record.dispatched.action.type;
        if (e.substring(e.length - 5, e.length) === "_undo") {
          const t = this.record.dispatched.state.past;
          if (t.length === 0) return;
          this.store.dispatch({ type: `${this.record.dispatched.name}_undo`, value: t[t.length - 1] });
          return;
        }
        if (e.substring(e.length - 5, e.length) === "_redo") {
          const t = this.record.dispatched.state.future;
          if (t.length === 0) return;
          this.store.dispatch({ type: `${this.record.dispatched.name}_redo`, value: t[0] });
          return;
        }
      });
    });
    v(this, "createRecordState", (e) => {
      let { name: t, initialState: r } = e;
      if (this.recordReducers.hasOwnProperty(t)) return;
      let i = Date.now();
      this.recordActions.set(`${t}_update`, (u, c) => c.value);
      let o = (u = { value: `${t} created.`, timestamp: i }, c) => {
        if (o.stateName !== c.type.split("_")[0] || !this.recordActions.has(c.type)) return u;
        const a = this.recordActions.get(c.type);
        return a ? a(u, c) : u;
      };
      o.stateName = t, this.recordReducers[t] = me(o, {
        limit: 1e3,
        filter: be(Array.from(this.recordActions.keys())),
        undoType: `${t}_undo`,
        redoType: `${t}_redo`
      }), this.record.replaceReducer(T(this.recordReducers)), this.store.currentRecord = this.record.getState(), this.record.dispatch({ type: `${t}_update`, value: {
        value: r == null ? void 0 : r.value,
        timestamp: i
      } });
    });
  }
}
U = new WeakMap(), N = new WeakMap(), M = new WeakMap();
var D, F, B, J, K, H, L, Y, V, z, G, W, q;
class wt extends $t {
  constructor() {
    super();
    v(this, "setStore", () => (g(this, D).call(this), g(this, F).call(this), g(this, B).call(this), g(this, K).call(this), g(this, H).call(this), g(this, L).call(this), g(this, Y).call(this), g(this, V).call(this), g(this, z).call(this), g(this, G).call(this), g(this, W).call(this), g(this, q).call(this), this.store));
    m(this, D, () => {
      if (this.store) return;
      const e = Me;
      this.store = Ne(
        T({ start$: (t = {}) => t }),
        e(ft(this.setMiddleware()))
      ), this.store.dispatched = [], this.store.current = this.store.getState(), this.store.currentRecord = {}, this.store.parameters = this.parameters;
    });
    m(this, F, () => {
      let e = this.store;
      e.subscribe(() => {
        var o, u, c, a, p, l, d;
        let t = e.dispatched.shift();
        if (e.current = e.getState(), e.getStateR && (e.currentRecord = e.getStateR()), !t || t.action.type === "initial$_delete" || t.action.type === "history$_update") return;
        let r = t.action.type;
        if (r === "history$_undo") {
          let b = e.current.history$.future[0].value, y;
          switch (b.name) {
            case "initial$":
              e.remove && e.remove(b.value.name, "undo"), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
            case "delete$":
              let f = this.parameters.get(b.value);
              f && this.setValueState(f, "undo"), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
            default:
              this.record.dispatch({ type: `${b.name}_undo` }), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
          }
        }
        if (r === "history$_redo") {
          let b = e.current.history$.present.value, y;
          switch (b.name) {
            case "initial$":
              let f = this.parameters.get(b.value.name);
              f.inputState.value = b.value.value, f && this.setValueState(f, "redo"), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
            case "delete$":
              e.remove && e.remove(b.value, "redo"), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
            default:
              this.record.dispatch({ type: `${b.name}_redo` }), y = e.getState(), e.wrapper.wrapper_reset;
              for (let h in y)
                h !== "initial$" && h !== "history$" && (e.wrapper[h + "_force"] = y[h].value);
              return;
          }
        }
        let i = {};
        if ((u = (o = t.action) == null ? void 0 : o.dispatched) != null && u.name && (i.target = t.action.dispatched.name), (c = t.action) != null && c.type && (i.trigger = t.action.type), (l = (p = (a = t.action) == null ? void 0 : a.dispatched) == null ? void 0 : p.state) != null && l.hasOwnProperty("value") && (i.previous = t.action.dispatched.state.value), (d = t.action) != null && d.hasOwnProperty("value") && (i.next = t.action.value), r.substring(r.length - 5, r.length) === "_undo") {
          i.next = i.next.value, this.observables.has(`${t.name}_undo`) && this.observables.get(`${t.name}_undo`).next(i);
          return;
        } else if (r.substring(r.length - 5, r.length) === "_redo") {
          i.next = i.next.value, this.observables.has(`${t.name}_redo`) && this.observables.get(`${t.name}_redo`).next(i);
          return;
        } else {
          if (t.name === "initial$" && t.action.isSilent) return;
          e.dispatch({ type: "history$_update", value: {
            name: t.name,
            value: t.action.value
          } }), this.record.dispatch({ type: `${t.name}_update`, value: {
            value: t.action.value,
            timestamp: Date.now()
          } });
        }
        r.substring(r.length - 7, r.length) === "_update" && t.name !== "initial$" && (this.parameters.get(t.name).inputState = e.current[t.name]), this.observables.has(`${t.name}_after`) && this.observables.get(`${t.name}_after`).next(i);
      });
    });
    m(this, B, () => {
      this.store.set = (e, t = "value") => {
        switch (t) {
          case "value":
            this.setValueState && this.setValueState(e);
            break;
          case "film":
            g(this, J).call(this, e.name);
            break;
        }
      };
    });
    m(this, J, (e) => {
      if (e.includes("$"))
        throw "State name must not contain '$'. '$' is automatically assigned in state name.";
      if (e === "initial")
        throw "Cannot create 'initial$' state, 'initial$' is system state.";
      if (e === "history")
        throw "Cannot create 'history$' state, 'history$' is system state.";
      const t = (r = { value: `${e}$ created.`, timestamp: Date.now() }, i) => i.type === `${e}$` ? { value: i.value, timestamp: Date.now() } : r;
      this.reducers[`${e}$`] = me(t, {
        limit: 1e3,
        filter: be([`${e}$`]),
        undoType: `${e}$_undo`,
        redoType: `${e}$_redo`
      }), this.store.replaceReducer(T(this.reducers));
    });
    m(this, K, () => {
      let e = this.store;
      e.get = (t) => {
        if (!e.current.hasOwnProperty(t))
          return console.warn(`no exist property[ ${t} ]`), null;
        if (t === "initial$") return e.current.initial$;
        if (t.includes("$")) return {
          past: e.current[t].past,
          present: e.current[t].present,
          future: e.current[t].future
        };
        if (e.current[t].hasOwnProperty("value"))
          return e.current[t].value;
      };
    });
    m(this, H, () => {
      let e = this.store;
      e.update = (t, r) => {
        if (t.substring(t.length - 1, t.length) === "$")
          throw `Cannot access ${t}$ state, please access via revert() or replay().`;
        if (!this.reducers.hasOwnProperty(t)) {
          console.warn(`no exist property[ ${t} ]`);
          return;
        }
        e.dispatch({ type: `${t}_update`, value: r });
      };
    });
    m(this, L, () => {
      let e = this.store;
      e.capture = (t, r) => {
        if (t === "initial" || t === "initial$")
          throw "Cannot access 'initial$' state, 'initial$' is system state.";
        if (t === "history" || t === "history$")
          throw "Cannot access 'history$' state, 'history$' is system state.";
        if (t.includes("$") || (t += "$"), !e.current.hasOwnProperty(t))
          return console.warn(`no exist property[ ${t} ]`), null;
        let i = { type: `${t}`, value: r };
        e.dispatch(i);
      };
    });
    m(this, Y, () => {
      let e = this.store;
      e.remove = (t, r = !1) => {
        if (!this.reducers.hasOwnProperty(t)) {
          console.warn(`no exist property[ ${t} ]`);
          return;
        }
        Array.from(this.actions.keys()).forEach((i) => {
          i.includes(`${t}_`) && this.actions.delete(i);
        }), Array.from(this.observables.keys()).forEach((i) => {
          i.includes(`${t}_`) && (this.observables.get(i).unsubscribe(), this.observables.delete(i));
        }), Array.from(this.methods.keys()).forEach((i) => {
          i.includes(`${t}_`) && this.methods.delete(i);
        }), e.dispatch({ type: "initial$_delete", value: { name: t } }), r ? r === "undo" ? this.record.dispatch({ type: `${t}_undo` }) : r === "redo" && this.record.dispatch({ type: `${t}_redo` }) : (e.dispatch({ type: "history$_update", value: {
          name: "delete$",
          value: t
        } }), this.record.dispatch({ type: `${t}_update`, value: "delete$" })), delete this.reducers[t], e.replaceReducer(T(this.reducers));
      };
    });
    m(this, V, () => {
      let e = this.store;
      e.actions = this.actions, e.action = (t, r, i) => {
        if (!this.reducers.hasOwnProperty(t)) {
          console.warn(`no exist property[ ${t} ]`);
          return;
        }
        if (!this.actions.has(`${t}_${r}`)) {
          console.warn(`no exist action[ ${r} ]`);
          return;
        }
        e.dispatch({ type: `${t}_${r}`, value: i });
      };
    });
    m(this, z, () => {
      let e = this.store;
      e.undo = () => {
        e.current.history$.past.length !== 0 && e.dispatch({ type: "history$_undo" });
      }, e.redo = () => {
        e.current.history$.future.length !== 0 && e.dispatch({ type: "history$_redo" });
      };
    });
    m(this, G, () => {
      let e = this.store;
      e.revert = (t) => {
      }, e.replay = (t) => {
      };
    });
    m(this, W, () => {
      const e = (r = {}, i) => i.type === "initial$_update" ? (r[i.value.name] = i.value.value, r) : (i.type === "initial$_delete" && delete r[i.value.name], r);
      this.reducers.initial$ = e;
      const t = me(
        (r = { value: "history$ created.", timestamp: Date.now() }, i) => {
          if (!i.type) return r;
          switch (i.type) {
            case "history$_update":
              return { value: i.value, timestamp: Date.now() };
            case "history$_undo":
              return { value: i.value.value, timestamp: i.value.timestamp };
            case "history$_redo":
              return { value: i.value.value, timestamp: i.value.timestamp };
          }
          return r;
        },
        {
          limit: 1e3,
          filter: be(["history$_update"]),
          undoType: "history$_undo",
          redoType: "history$_redo"
        }
      );
      this.reducers.history$ = t, this.store.replaceReducer(T(this.reducers));
    });
    m(this, q, () => {
      this.store.getStateR = () => this.record.getState();
    });
    v(this, "setValueState", (e, t = !1) => {
    });
  }
}
D = new WeakMap(), F = new WeakMap(), B = new WeakMap(), J = new WeakMap(), K = new WeakMap(), H = new WeakMap(), L = new WeakMap(), Y = new WeakMap(), V = new WeakMap(), z = new WeakMap(), G = new WeakMap(), W = new WeakMap(), q = new WeakMap();
var Q, R, X, Z;
class St extends wt {
  constructor() {
    super();
    v(this, "setReducer", () => {
      Object.keys(this.reducers).length > 0;
    });
    v(this, "setValueState", (e, t = !1) => {
      let { name: r } = e;
      if (r.includes("_"))
        throw "'_' cannot be used in state name.";
      if (r.includes("$") && r !== "history$")
        throw "'$' cannot be used in state name.";
      this.reducers[r] || (t || (e.initialState = { value: e.value, timestamp: Date.now() }, e.inputState = e.initialState), this.createRecordState(e), g(this, Q).call(this, e), g(this, Z).call(this, g(this, X).call(this, e), t));
    });
    m(this, Q, (e) => {
      let t = this.actions, r = this.methods, i = this.observables;
      if (t.set(`${e.name}_update`, (o, u) => ({ value: u.value, timestamp: Date.now() })), e.before && (typeof e.before == "function" ? r.set(`${e.name}_before`, e.before) : i.set(
        `${e.name}_before`,
        g(this, R).call(this, e.before)
      )), t.set(`${e.name}_undo`, (o, u) => ({ value: u.value.value, timestamp: u.value.timestamp })), e.undo && i.set(
        `${e.name}_undo`,
        g(this, R).call(this, e.undo)
      ), t.set(`${e.name}_redo`, (o, u) => ({ value: u.value.value, timestamp: u.value.timestamp })), e.redo && i.set(
        `${e.name}_redo`,
        g(this, R).call(this, e.redo)
      ), e.after && i.set(
        `${e.name}_after`,
        g(this, R).call(this, e.after)
      ), !!e.actions && e.actions.length !== 0)
        for (let o of e.actions) {
          if (o.name.includes("_"))
            throw console.log(o.name), "Cannot use '_' in action name";
          if (t.has(`${e.name}_${o.name}`))
            throw console.log(o.name), "already exist action name";
          r.set(`${e.name}_${o.name}`, o.method), t.set(
            `${e.name}_${o.name}`,
            r.get(`${e.name}_${o.name}`)
          );
        }
    });
    m(this, R, (e) => typeof e != "function" ? e : new Ie().subscribe(e));
    m(this, X, (e) => {
      let { inputState: t } = e, r = (i = t, o) => {
        var c, a, p;
        if (!this.actions.has(o.type) || r.stateName !== o.type.split("_")[0]) return i;
        const u = this.actions.get(o.type);
        if (!u || this.store.dispatched.length === 0) return i;
        if (o.type.includes("_update") || o.type.includes("_undo") || o.type.includes("_redo"))
          return u(i, o) || i;
        if (o.type === this.store.dispatched[this.store.dispatched.length - 1].action.type) {
          o.value || (o.value = i.value);
          let l = {};
          (c = o == null ? void 0 : o.dispatched) != null && c.name && (l.target = o.dispatched.name), o != null && o.type && (l.trigger = o.type), (p = (a = o == null ? void 0 : o.dispatched) == null ? void 0 : a.state) != null && p.hasOwnProperty("value") && (l.previous = o.dispatched.state.value), o != null && o.hasOwnProperty("value") && (l.next = o.value);
          let d = u(l) || i;
          return o.value = d, { value: d, timestamp: Date.now() };
        }
        return i;
      };
      return r.stateName = e.name, e.reducer = r, e;
    });
    m(this, Z, (e, t) => {
      let { name: r, value: i, reducer: o } = e;
      switch (t && e.initialState && (i = e.initialState.value), this.store.dispatch({ type: "initial$_update", value: { name: r, value: i }, isSilent: t }), t) {
        case "undo":
          this.record.dispatch({ type: `${r}_undo` });
          break;
        case "redo":
          this.record.dispatch({ type: `${r}_redo` });
          break;
      }
      this.reducers[r] = o, this.store.replaceReducer(T(this.reducers)), this.parameters.set(r, e);
    });
  }
}
Q = new WeakMap(), R = new WeakMap(), X = new WeakMap(), Z = new WeakMap();
const ce = "font-style: italic; font-weight: 700; color: #D9F8C4;", xt = "font-style: italic; font-weight: 700; color: #ebc078;", Ot = "font-style: italic; font-weight: 700; color: #eb6c63;", Et = "font-style: italic; font-weight: 700; color: #8fdfff;";
class Tt extends St {
  constructor() {
    super();
    v(this, "wrapping", () => {
      const e = this.store, t = {}, r = {
        get: function(i, o) {
          var b, y;
          switch (o) {
            case "get_all":
              return this.method("get_all", i);
            case "undo":
              return this.method("undo", i);
            case "redo":
              return this.method("redo", i);
            case "history$":
              return console.warn("(STORE) Cannot access system state [ history$ ]."), null;
            case "initial$":
              return console.warn("(STORE) Cannot access system state [ initial$ ]."), null;
            case "export_object":
              return this.method("export_object", i);
            case "export_array":
              return this.method("export_array", i);
            case "export_map":
              return this.method("export_map", i);
            case "export_json":
              return this.method("export_json", i);
            case "wrapper_reset":
              for (let f of Object.entries(i))
                delete i[f[0]];
              return null;
            case "reset":
              for (let f of Object.entries(i))
                delete i[f[0]], e.remove(f[0]);
              return null;
          }
          const u = o.split("_");
          o = u.shift();
          let c = !1, a = !1, p = !1, l = [];
          if (!i.hasOwnProperty(o))
            if (e.getState().hasOwnProperty(o))
              i[o] = e.getState()[o].value;
            else
              return console.warn(`(STORE) Cannot access. [ ${o} ] is no exists.`), null;
          for (let f of u)
            switch (f) {
              case "log":
                c = !0;
                break;
              case "delete":
                a = !0;
                break;
              default:
                p = !0, l.push(f);
            }
          if (p) {
            for (let f of l)
              e.action(o, f), i[o] = e.getState()[o].value, c && (b = e.parameters.get(o)) != null && b.actions && ((y = e.parameters.get(o)) == null ? void 0 : y.actions.findIndex(
                (h) => h.name === f
              )) !== -1 && (console.groupCollapsed(`%c(STORE) [ ${o} ] is acted.[ ${f} ]`, ce), console.trace(), console.groupEnd());
            return !0;
          }
          if (a)
            return delete i[o], e.remove(o), c && console.log(`%c(STORE) [ ${o} ] is deleted.`, Ot), null;
          c && (console.groupCollapsed(`%c(STORE) [ ${o} ] = ${this.logger(i[o])}(${typeof i[o]}) is accessed.`, Et), console.log(i[o]), console.trace(), console.groupEnd());
          let d;
          return e.getState().hasOwnProperty(o) ? d = e.getState()[o].value : (d = null, delete i[o]), d;
        },
        set: function(i, o, u) {
          var y, f;
          switch (o) {
            case "undo":
              return console.warn("(STORE) Cannot assign [ undo ]."), !0;
            case "redo":
              return console.warn("(STORE) Cannot assign [ redo ]."), !0;
            case "history$":
              return console.warn("(STORE) Cannot assign system state [ history$ ]."), !0;
            case "initial$":
              return console.warn("(STORE) Cannot assign system state [ initial$ ]."), !0;
            case "import_object":
              return this.method("import_object", i, u), !0;
            case "import_json":
              return this.method("import_json", i, u), !0;
          }
          const c = o.split("_");
          o = c.shift();
          let a = !1, p = !1, l = !1, d = !1, b = [];
          for (let h of c)
            switch (h) {
              case "log":
                a = !0;
                break;
              case "config":
                p = !0;
                break;
              case "force":
                l = !0;
                break;
              default:
                d = !0, b.push(h);
            }
          if (l)
            return i[o] = u, !0;
          if (i.hasOwnProperty(o)) {
            if (d) {
              for (let h of b)
                e.action(o, h, u), i[o] = e.getState()[o].value, a && (y = e.parameters.get(o)) != null && y.actions && ((f = e.parameters.get(o)) == null ? void 0 : f.actions.findIndex(
                  (S) => S.name === h
                )) !== -1 && (console.groupCollapsed(`%c(STORE) [ ${o} ] = ${this.logger(u)}(${typeof u}) is acted.[ ${h} ]`, ce), console.log(u), console.trace(), console.groupEnd());
              return !0;
            }
            if (p)
              return console.warn("(STORE) Cannot change configs. Please assign configs at initialize."), !0;
            e.update(o, u), a && (console.groupCollapsed(`%c(STORE) [ ${o} ] = ${this.logger(u)}(${typeof u}) is updated.`, xt), console.log(u), console.trace(), console.groupEnd());
          } else {
            if (d)
              return console.warn(`(STORE) Cannot exec actions [ ${JSON.stringify(b)} ]. [ ${o} ] is not initialized. or Cannot use _(underbar or underline) in prop name.`), !0;
            p ? (u.name = o, u.hasOwnProperty("value") || (u.value = null), e.set(u), u = u.value) : e.set({ name: o, value: u }), a && (console.groupCollapsed(`%c(STORE) [ ${o} ] = ${this.logger(u)}(${typeof u}) is created.`, ce), console.log(u), console.trace(), console.groupEnd());
          }
          return i[o] = u, !0;
        },
        logger: (i) => {
          let o;
          return typeof i == "object" ? o = JSON.stringify(i) : o = i, o;
        },
        method: function(i, o, u = null) {
          const c = {};
          let a;
          switch (i) {
            case "get_all":
              return e.getState();
            case "undo":
              return e.undo(), !0;
            case "redo":
              return e.redo(), !0;
            case "export_object":
              a = e.getState();
              for (let l in a)
                l !== "initial$" && l !== "history$" && (c[l] = a[l].value);
              return c;
            case "export_array":
              a = e.getState();
              for (let l in a)
                l !== "initial$" && l !== "history$" && (c[l] = a[l].value);
              return Object.entries(c);
            case "export_map":
              const p = /* @__PURE__ */ new Map();
              a = e.getState();
              for (let l in a)
                l !== "initial$" && l !== "history$" && p.set(l, a[l].value);
              return p;
            case "export_json":
              a = e.getState();
              for (let l in a)
                l !== "initial$" && l !== "history$" && (c[l] = a[l].value);
              return JSON.stringify(c);
            case "import_object":
              if (typeof u != "object")
                return console.warn("(STORE) It is not [ Object ] type."), console.log(u), !0;
              for (let l of Object.entries(o))
                delete o[l[0]], e.remove(l[0]);
              for (let l in u)
                this.set(o, l + "_log", u[l]);
              return !0;
            case "import_json":
              if (typeof u != "string")
                return console.warn("(STORE) Please stringify."), console.log(u), !0;
              u = JSON.parse(u);
              for (let l of Object.entries(o))
                delete o[l[0]], e.remove(l[0]);
              for (let l in u)
                this.set(o, l + "_log", u[l]);
              return !0;
          }
        },
        deleteProperty: function(i, o) {
          return console.warn(`Cannot delete [ ${o} ]. Please use delete command. -> S$.${o}_delete`), !0;
        }
      };
      return e.wrapper = new Proxy(t, r), e.wrapper;
    });
  }
}
class Rt extends Tt {
  constructor() {
    return super(), this.setRecord(), this.setStore(), this.setReducer(), this.wrapping();
  }
}
const jt = pe.getNewRegister(pe), At = ke, Ct = new Rt(), kt = Ie;
export {
  jt as b$,
  At as bob$,
  Ct as s$,
  kt as sob$
};
