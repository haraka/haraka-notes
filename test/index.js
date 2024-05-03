const assert = require('assert')

const Notes = require('../index')

describe('notes', () => {
    beforeEach((done) => {
        this.notes = new Notes()
        done()
    })

    it('exports an object', () => {
        assert.ok(typeof this.notes === 'object')
    })

    const functionList = ['get', 'set']

    for (const fn of functionList) {
        it(`has ${fn}()`, () => {
            assert.equal(typeof this.notes[fn], 'function')
        })
    }

    for (const fn of functionList) {
        it(`ignores attempts to redefine ${fn}`, () => {
            this.notes[fn] = 'turd'
            this.notes[fn]('turd')
        })
    }

    it('sets a top level value', () => {
        this.notes.set('foo', 'bar')
        assert.equal(this.notes.foo, 'bar')
    })

    it('can set a false value', () => {
        this.notes.set('boolean', false)
        assert.equal(this.notes.boolean, false)
    })

    it('gets a top level value', () => {
        this.notes.set('foo', 'bar')
        assert.equal(this.notes.get('foo'), 'bar')
    })

    it('sets/gets a second level value', () => {
        this.notes.set('seg1.seg2', 'bar')
        assert.equal(this.notes.seg1.seg2, 'bar')
        assert.equal(this.notes.get('seg1.seg2'), 'bar')
    })

    it('sets/gets a three level value', () => {
        this.notes.set('one.two.three', 'floor')
        assert.equal(this.notes.one.two.three, 'floor')
        assert.equal(this.notes.get('one.two.three'), 'floor')
    })

    it('supports array syntax', () => {
        this.notes.set(['one', 'two', 'three'], 'floor')
        assert.equal(this.notes.one.two.three, 'floor')
        assert.equal(this.notes.get(['one', 'two', 'three']), 'floor')
    })

    it('array syntax tolerates dots', () => {
        this.notes.set(['one', 'two', 'three.four'], 'floor')
        assert.equal(this.notes.one.two['three.four'], 'floor')
        assert.equal(this.notes.get(['one', 'two', 'three.four']), 'floor')
    })

    it('sets default sets a property', () => {
        this.notes.set(['one', 'two'], 'tree', true)
        assert.equal(this.notes.one.two, 'tree')
    })

    it('set default does NOT change defined property', () => {
        this.notes.set('one.two', 'tree', true)
        this.notes.set('one.two', 'three', true)
        assert.equal(this.notes.one.two, 'tree')
    })
})

describe('notes + object', () => {
    it('assigns instantiation object', () => {
        const passIn = {
            one: true,
            two: 'false',
            three: 'floor',
        }
        this.notes = this.notes = new Notes(passIn)
        assert.deepEqual(this.notes, passIn)
    })
})
