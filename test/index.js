
const assert = require('assert')

const Notes  = require('../index')

describe('notes', () => {

    beforeEach((done) => {
        this.notes = new Notes()
        done()
    })

    it('exports an object', (done) => {
        // console.log(this.notes)
        assert.ok(typeof this.notes === 'object')
        done()
    })

    const functionList = ['get', 'set']

    functionList.forEach((fn) => {
        it(`has ${fn}()`, (done) => {
            assert.equal(typeof this.notes[fn], 'function')
            done()
        })
    })

    functionList.forEach((fn) => {
        it(`ignores attempts to redefine ${fn}`, (done) => {
            this.notes[fn] = 'turd'
            this.notes[fn]('turd')
            done()
        })
    })

    it('sets a top level value', (done) => {
        this.notes.set('foo', 'bar')
        // console.log(this.notes)
        assert.equal(this.notes.foo, 'bar')
        done()
    })

    it('gets a top level value', (done) => {
        this.notes.set('foo', 'bar')
        assert.equal(this.notes.get('foo'), 'bar')
        done()
    })

    it('sets/gets a second level value', (done) => {
        this.notes.set('seg1.seg2', 'bar')
        assert.equal(this.notes.seg1.seg2, 'bar')
        assert.equal(this.notes.get('seg1.seg2'), 'bar')
        done()
    })

    it('sets/gets a three level value', (done) => {
        this.notes.set('one.two.three', 'floor')
        assert.equal(this.notes.one.two.three, 'floor')
        assert.equal(this.notes.get('one.two.three'), 'floor')
        done()
    })

    it('supports array syntax', (done) => {
        this.notes.set(['one', 'two', 'three'], 'floor')
        assert.equal(this.notes.one.two.three, 'floor')
        assert.equal(this.notes.get(['one', 'two', 'three']), 'floor')
        done()
    })

    it('array syntax tolerates dots', (done) => {
        this.notes.set(['one', 'two', 'three.four'], 'floor')
        assert.equal(this.notes.one.two['three.four'], 'floor')
        assert.equal(this.notes.get(['one', 'two', 'three.four']), 'floor')
        done()
    })
})

describe('notes + object', () => {

    it('assigns instantiation object', (done) => {
        let passIn = {
            one: true,
            two: "false",
            three: "floor",
        }
        this.notes = this.notes = new Notes(passIn)
        assert.deepEqual(this.notes, passIn)
        done()
    })
})