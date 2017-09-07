'use strict'

class Notes {

    constructor (notes) {

        if (notes && typeof notes === 'object') {
            Object.assign(this, notes)
        }

        Object.defineProperty(this, 'set', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: (path, value) => {
                if (!path || !value) return;
                // console.log(`setting ${path} to ${value}`);

                let segments = getSegments(path);
                let dest = this;

                while (segments.length > 1) {
                    // create any missing paths
                    if (!dest[segments[0]]) dest[segments[0]] = {};
                    // set dest one path segment deeper
                    dest = dest[segments.shift()];
                }
                dest[segments[0]] = value;
            }
        })

        Object.defineProperty(this, 'get', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: (path) => {
                if (!path) return;
                // console.log(`getting ${path}`);
                let segments = getSegments(path);
                return segments.reduce((prev, curr) => {
                    return prev ? prev[curr] : undefined
                }, this)
            }
        })
    }
}

module.exports = Notes

function getSegments (path) {
    // a dot.delimited.path
    if (typeof path === 'string') return path.split('.')

    // ['one', 'two', 'thr.ee']
    if (Array.isArray(path)) return path
}