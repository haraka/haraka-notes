const assert = require('node:assert/strict')
const { describe, it, beforeEach } = require('node:test')

const Notes = require('../index')

describe('notes', () => {
  let notes

  beforeEach(() => {
    notes = new Notes()
  })

  it('exports an object', () => {
    assert.ok(typeof notes === 'object')
  })

  const functionList = ['get', 'set']

  for (const fn of functionList) {
    it(`has ${fn}()`, () => {
      assert.equal(typeof notes[fn], 'function')
    })
  }

  for (const fn of functionList) {
    it(`ignores attempts to redefine ${fn}`, () => {
      notes[fn] = 'turd'
      notes[fn]('turd')
    })
  }

  it('sets a top level value', () => {
    notes.set('foo', 'bar')
    assert.equal(notes.foo, 'bar')
  })

  it('can set a false value', () => {
    notes.set('boolean', false)
    assert.equal(notes.boolean, false)
  })

  it('gets a top level value', () => {
    notes.set('foo', 'bar')
    assert.equal(notes.get('foo'), 'bar')
  })

  it('sets/gets a second level value', () => {
    notes.set('seg1.seg2', 'bar')
    assert.equal(notes.seg1.seg2, 'bar')
    assert.equal(notes.get('seg1.seg2'), 'bar')
  })

  it('sets/gets a three level value', () => {
    notes.set('one.two.three', 'floor')
    assert.equal(notes.one.two.three, 'floor')
    assert.equal(notes.get('one.two.three'), 'floor')
  })

  it('supports array syntax', () => {
    notes.set(['one', 'two', 'three'], 'floor')
    assert.equal(notes.one.two.three, 'floor')
    assert.equal(notes.get(['one', 'two', 'three']), 'floor')
  })

  it('array syntax tolerates dots', () => {
    notes.set(['one', 'two', 'three.four'], 'floor')
    assert.equal(notes.one.two['three.four'], 'floor')
    assert.equal(notes.get(['one', 'two', 'three.four']), 'floor')
  })

  it('sets default sets a property', () => {
    notes.set(['one', 'two'], 'tree', true)
    assert.equal(notes.one.two, 'tree')
  })

  it('set default does NOT change defined property', () => {
    notes.set('one.two', 'tree', true)
    notes.set('one.two', 'three', true)
    assert.equal(notes.one.two, 'tree')
  })
})

describe('notes hardening', () => {
  let notes

  beforeEach(() => {
    notes = new Notes()
  })

  // S1: prototype pollution via __proto__
  it('rejects __proto__ traversal (Object.prototype)', () => {
    assert.throws(() => notes.set('__proto__.__proto__.polluted', 'x'), TypeError)
    assert.equal({}.polluted, undefined)
  })

  it('rejects a single __proto__ segment (Notes.prototype)', () => {
    assert.throws(() => notes.set('__proto__.polluted', 'x'), TypeError)
    assert.equal(new Notes().polluted, undefined)
  })

  it('rejects __proto__ as a leaf segment', () => {
    assert.throws(() => notes.set('__proto__', { polluted: 'x' }), TypeError)
    assert.equal(new Notes().polluted, undefined)
  })

  // S2: prototype pollution via constructor.prototype
  it('rejects constructor.prototype traversal', () => {
    assert.throws(() => notes.set('constructor.prototype.polluted', 'y'), TypeError)
    assert.equal(new Notes().polluted, undefined)
  })

  it('rejects reserved segments in array-syntax paths', () => {
    assert.throws(
      () => notes.set(['constructor', 'prototype', 'polluted'], 'z'),
      TypeError,
    )
    assert.equal(new Notes().polluted, undefined)
  })

  it('rejects reserved segments in get()', () => {
    assert.throws(() => notes.get('__proto__.x'), TypeError)
  })

  // C1: overwriting a falsy intermediate is allowed but must warn
  it('warns when overwriting a falsy intermediate value', () => {
    notes.x = false
    const orig = console.warn
    const warnings = []
    console.warn = (m) => warnings.push(m)
    try {
      notes.set('x.y', 1)
    } finally {
      console.warn = orig
    }
    assert.equal(notes.get('x.y'), 1) // write honored
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /\[WARN\] \[notes\].*overwriting boolean/)
  })

  it('does not warn when autovivifying a missing intermediate', () => {
    const orig = console.warn
    const warnings = []
    console.warn = (m) => warnings.push(m)
    try {
      notes.set('a.b.c', 1)
    } finally {
      console.warn = orig
    }
    assert.equal(notes.get('a.b.c'), 1)
    assert.equal(warnings.length, 0)
  })

  it('still autovivifies missing intermediates', () => {
    notes.set('a.b.c', 1)
    assert.equal(notes.get('a.b.c'), 1)
  })

  it('traverses an existing object intermediate', () => {
    notes.set('a.b', 1)
    notes.set('a.c', 2)
    assert.equal(notes.a.b, 1)
    assert.equal(notes.a.c, 2)
  })

  // C2: array path arguments must not be mutated
  it('does not mutate a caller-supplied array path', () => {
    const path = ['a', 'b']
    notes.set(path, 1)
    assert.deepEqual(path, ['a', 'b'])
  })

  it('does not mutate a caller-supplied array path in get()', () => {
    notes.set(['a', 'b'], 1)
    const path = ['a', 'b']
    notes.get(path)
    assert.deepEqual(path, ['a', 'b'])
  })

  // C3: invalid path types throw a descriptive TypeError
  it('throws a descriptive TypeError for non-string/array set path', () => {
    assert.throws(() => notes.set(123, 'v'), {
      name: 'TypeError',
      message: /string or array/,
    })
  })

  it('throws a descriptive TypeError for non-string/array get path', () => {
    assert.throws(() => notes.get({}), {
      name: 'TypeError',
      message: /string or array/,
    })
  })

  it('get() still returns undefined for empty path', () => {
    assert.equal(notes.get(), undefined)
    assert.equal(notes.get(''), undefined)
  })
})

describe('notes + object', () => {
  it('assigns instantiation object', () => {
    const passIn = {
      one: true,
      two: 'false',
      three: 'floor',
    }
    const notes = new Notes(passIn)
    // Notes is a class instance; compare own enumerable props (strict
    // deepEqual is prototype-sensitive, so spread to a plain object).
    assert.deepEqual({ ...notes }, passIn)
  })
})
