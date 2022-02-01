const assert = require('assert')
const texme = require('../texme.js')

const MARK = texme.tokenType.MARK
const MASK = texme.tokenType.MASK
const MASK_LITERAL = texme.tokenLiteral.MASK

describe('mask', function () {
  it('markdown', function () {
    const tokens = [[MARK, 'Foo']]
    const expected = { text: 'Foo', tokenValues: [] }
    assert.deepStrictEqual(texme.mask(tokens), expected)
  })

  it('math', function () {
    const input = '$ 1 + 1 = 2 $'
    const tokens = [[MASK, input]]
    const expected = { text: MASK_LITERAL, tokenValues: [input] }
    assert.deepStrictEqual(texme.mask(tokens), expected)
  })

  it('mask literal', function () {
    const input = MASK_LITERAL
    const tokens = [[MASK, input]]
    const expected = { text: MASK_LITERAL, tokenValues: [input] }
    assert.deepStrictEqual(texme.mask(tokens), expected)
  })

  it('mixed', function () {
    const tokens = [
      [MARK, 'Foo'],
      [MASK, '$ 1 $'],
      [MASK, MASK_LITERAL],
      [MARK, 'Bar']]

    const expected = {
      text: 'Foo' + MASK_LITERAL + MASK_LITERAL + 'Bar',
      tokenValues: ['$ 1 $', MASK_LITERAL]
    }

    assert.deepStrictEqual(texme.mask(tokens), expected)
  })
})
