
class Notes {

    constructor (notes) {

        if (notes && typeof notes === 'object') {
            Object.assign(this, notes)
        }

        Object.defineProperty(this, 'set', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: assignPathValue.bind(this)
        })

        Object.defineProperty(this, 'get', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: getPathValue.bind(this)
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

function assignPathValue (path, value) {
    if (!path || !value) return

    const segments = getSegments(path)
    let dest = this

    while (segments.length > 1) {
        // create any missing paths
        if (!dest[segments[0]]) dest[segments[0]] = {}
        // set dest one path segment deeper
        dest = dest[segments.shift()]
    }
    dest[segments[0]] = value
}

function getPathValue (path) {
    if (!path) return
    const segments = getSegments(path)
    return segments.reduce((prev, curr) => {
        return prev ? prev[curr] : undefined
    }, this)
}