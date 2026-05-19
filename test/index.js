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
