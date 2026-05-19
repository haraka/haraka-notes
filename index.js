'use strict'

// Path segments that would let a caller walk into a prototype and pollute
// it process-wide. Rejected in both get() and set().
const FORBIDDEN_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

class Notes {
  constructor(notes) {
    if (notes && typeof notes === 'object') {
      Object.assign(this, notes)
    }

    Object.defineProperty(this, 'set', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: assignPathValue.bind(this),
    })

    Object.defineProperty(this, 'get', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: getPathValue.bind(this),
    })
  }
}

module.exports = Notes

function getSegments(path) {
  let segments

  // a dot.delimited.path
  if (typeof path === 'string') {
    segments = path.split('.')
  } else if (Array.isArray(path)) {
    // ['one', 'two', 'thr.ee'] — copy so we never mutate the caller's array
    segments = path.slice()
  } else {
    throw new TypeError(
      `notes path must be a string or array, got ${path === null ? 'null' : typeof path}`,
    )
  }

  for (const segment of segments) {
    if (FORBIDDEN_SEGMENTS.has(segment)) {
      throw new TypeError(`notes path segment "${segment}" is not allowed`)
    }
  }
  return segments
}

function assignPathValue(path, value, onlyWhenUndefined) {
  if (path === undefined || value === undefined) return

  const segments = getSegments(path)
  const label = Array.isArray(path) ? path.join('.') : path
  let dest = this

  while (segments.length > 1) {
    const seg = segments[0]
    const cur = dest[seg]
    if (cur === undefined || cur === null) {
      // autovivify any missing path
      dest[seg] = {}
    } else if (typeof cur !== 'object' && typeof cur !== 'function') {
      // an existing scalar (e.g. false/0/'') is in the way; the author
      // asked to write here, so overwrite it but warn about the loss
      console.warn(
        `[WARN] [notes] set("${label}"): overwriting ${typeof cur} at "${seg}"`,
      )
      dest[seg] = {}
    }
    // set dest one path segment deeper
    dest = dest[segments.shift()]
  }
  if (onlyWhenUndefined) {
    if (dest[segments[0]] === undefined) dest[segments[0]] = value
  } else {
    dest[segments[0]] = value
  }
}

function getPathValue(path) {
  if (!path) return
  const segments = getSegments(path)
  return segments.reduce((prev, curr) => {
    return prev ? prev[curr] : undefined
  }, this)
}
