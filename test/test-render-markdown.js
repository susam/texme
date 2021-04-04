var assert = require('assert')
var texme = require('../texme.js')

describe('renderMarkdown', function () {
  before(function () {
    // Ensure that markdown module is loaded.
    texme.main()
  })

  it('simple', function () {
    var input = '*Foo* **Bar** `Baz`'
    var expected = '<p><em>Foo</em> <strong>Bar</strong> <code>Baz</code></p>\n'
    assert.deepStrictEqual(texme.renderMarkdown(input), expected)
  })
})
