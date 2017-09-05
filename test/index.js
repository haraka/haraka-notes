
const assert = require('assert')

const Notes  = require('../index')

describe('notes', function () {

    beforeEach(function (done) {
        this.notes = new Notes();
        done();
    });

    it('exports an object', function (done) {
        // console.log(this.notes);
        assert.ok(typeof this.notes === 'object');
        done();
    });

    const functionList = ['get', 'set'];

    functionList.forEach((fn) => {
        it(`has ${fn}()`, function (done) {
            assert.equal(typeof this.notes[fn], 'function');
            done();
        })
    })

    functionList.forEach((fn) => {
        it(`ignores attempts to redefine ${fn}`, function (done) {
            this.notes[fn] = 'turd';
            this.notes[fn]('turd');
            done();
        });
    })

    it('sets a top level value', function (done) {
        this.notes.set('foo', 'bar');
        // console.log(this.notes);
        assert.equal(this.notes.foo, 'bar');
        done();
    });

    it('gets a top level value', function (done) {
        this.notes.set('foo', 'bar');
        assert.equal(this.notes.get('foo'), 'bar');
        done();
    });

    it('sets/gets a second level value', function (done) {
        this.notes.set('seg1.seg2', 'bar');
        assert.equal(this.notes.seg1.seg2, 'bar');
        assert.equal(this.notes.get('seg1.seg2'), 'bar');
        done();
    });

    it('sets/gets a three level value', function (done) {
        this.notes.set('one.two.three', 'floor');
        assert.equal(this.notes.one.two.three, 'floor');
        assert.equal(this.notes.get('one.two.three'), 'floor');
        done();
    });

    it('supports array syntax', function (done) {
        this.notes.set(['one', 'two', 'three'], 'floor');
        assert.equal(this.notes.one.two.three, 'floor');
        assert.equal(this.notes.get(['one', 'two', 'three']), 'floor');
        done();
    });

    it('array syntax tolerates dots', function (done) {
        this.notes.set(['one', 'two', 'three.four'], 'floor');
        assert.equal(this.notes.one.two['three.four'], 'floor');
        assert.equal(this.notes.get(['one', 'two', 'three.four']), 'floor');
        done();
    });
})