var assert = require('assert')
var texme = require('../texme.js')

var MARK = texme.tokenType.MARK
var MASK = texme.tokenType.MASK
var MASK_LITERAL = texme.tokenLiteral.MASK

describe('mask', function () {
  it('markdown', function () {
    var tokens = [[MARK, 'Foo']]
    var expected = {text: 'Foo', tokenValues: []}
    assert.deepEqual(texme.mask(tokens), expected)
  })

  it('math', function () {
    var input = '$ 1 + 1 = 2 $'
    var tokens = [[MASK, input]]
    var expected = {text: MASK_LITERAL, tokenValues: [input]}
    assert.deepEqual(texme.mask(tokens), expected)
  })

  it('mask literal', function () {
    var input = MASK_LITERAL
    var tokens = [[MASK, input]]
    var expected = {text: MASK_LITERAL, tokenValues: [input]}
    assert.deepEqual(texme.mask(tokens), expected)
  })

  it('mixed', function () {
    var tokens = [
      [MARK, 'Foo'],
      [MASK, '$ 1 $'],
      [MASK, MASK_LITERAL],
      [MARK, 'Bar']]

    var expected = {
      text: 'Foo' + MASK_LITERAL + MASK_LITERAL + 'Bar',
      tokenValues: ['$ 1 $', MASK_LITERAL]
    }

    assert.deepEqual(texme.mask(tokens), expected)
  })
})
