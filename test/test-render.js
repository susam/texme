var assert = require('assert')
var texme = require('../texme.js')

var MASK_LITERAL = texme.tokenLiteral.MASK

describe('render', function () {
  it('render: markdown', function () {
    var input = '*Foo* **Bar** `Baz`'
    var expected = '<p><em>Foo</em> <strong>Bar</strong> <code>Baz</code></p>\n'
    assert.deepEqual(texme.render(input), expected)
  })

  it('render: math', function () {
    var input = '$ 1 + 1 = 2 $'
    var expected = '<p>$ 1 + 1 = 2 $</p>\n'
    assert.deepEqual(texme.render(input), expected)
  })

  it('render: mask literal', function () {
    var input = MASK_LITERAL
    var expected = '<p>' + MASK_LITERAL + '</p>\n'
    assert.deepEqual(texme.render(input), expected)
  })

  it('render: mixed', function () {
    var input = '*Foo* $ 1 + 1 = 2 $ **Bar** $$ 2 + 2 = 4 $$'
    var expected = '<p><em>Foo</em> $ 1 + 1 = 2 $ <strong>Bar</strong> ' +
             '$$ 2 + 2 = 4 $$</p>\n'
    assert.deepEqual(texme.render(input), expected)
  })

  it('render: multiple lines', function () {
    var input =
      'Binomial Theorem\n' +
      '----------------\n' +
      '$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} x^{n - k} y^k $$\n' +
      '\n' +
      'Exponential Function\n' +
      '--------------------\n' +
      '\\[ e^x = \\lim_{n \\to \\infty} ' +
      '\\left( 1+ \\frac{x}{n} \\right)^n \\]\n'
    var expected =
      '<h2>Binomial Theorem</h2>\n' +
      '<p>$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} ' +
      'x^{n - k} y^k $$</p>\n' +
      '<h2>Exponential Function</h2>\n' +
      '<p>\\[ e^x = \\lim_{n \\to \\infty} ' +
      '\\left( 1+ \\frac{x}{n} \\right)^n \\]</p>\n'
    assert.deepEqual(texme.render(input), expected)
  })
})
