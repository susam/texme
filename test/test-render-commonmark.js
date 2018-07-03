var assert = require('assert')
var texme = require('../texme.js')

describe('renderCommonMark', function () {
  it('simple', function () {
    var input = '*Foo* **Bar** `Baz`'
    var expected = '<p><em>Foo</em> <strong>Bar</strong> <code>Baz</code></p>\n'
    assert.deepEqual(texme.renderCommonMark(input), expected)
  })
})
