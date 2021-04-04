var assert = require('assert')
var texme = require('../texme.js')

var MASK_LITERAL = texme.tokenLiteral.MASK

describe('render', function () {
  before(function () {
    // Ensure that markdown module is loaded.
    texme.main()
  })

  it('markdown', function () {
    var input = '*Foo* **Bar** `Baz`'
    var expected = '<p><em>Foo</em> <strong>Bar</strong> <code>Baz</code></p>\n'
    assert.deepStrictEqual(texme.render(input), expected)
  })

  it('math', function () {
    var input = '$ 1 + 1 = 2 $'
    var expected = '<p>$ 1 + 1 = 2 $</p>\n'
    assert.deepStrictEqual(texme.render(input), expected)
  })

  it('mask literal', function () {
    var input = MASK_LITERAL
    var expected = '<p>' + MASK_LITERAL + '</p>\n'
    assert.deepStrictEqual(texme.render(input), expected)
  })

  it('mixed', function () {
    var input = '*Foo* $ 1 + 1 = 2 $ **Bar** $$ 2 + 2 = 4 $$'
    var expected = '<p><em>Foo</em> $ 1 + 1 = 2 $ <strong>Bar</strong> ' +
             '$$ 2 + 2 = 4 $$</p>\n'
    assert.deepStrictEqual(texme.render(input), expected)
  })

  it('protected math', function () {
    var input = '$$ {a}_{1} {a}_{2} $$'
    var expected = '<p>$$ {a}_{1} {a}_{2} $$</p>\n'
    texme.setOption('protectMath', true)
    assert.deepStrictEqual(texme.render(input), expected)
    texme.setDefaultOptions()
  })

  it('unprotected math', function () {
    var input = '$$ {a}_{1} {a}_{2} $$'
    var expected = '<p>$$ {a}<em>{1} {a}</em>{2} $$</p>\n'
    texme.setOption('protectMath', false)
    assert.deepStrictEqual(texme.render(input), expected)
    texme.setDefaultOptions()
  })

  it('multiple lines', function () {
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
      '<h2 id="binomial-theorem">Binomial Theorem</h2>\n' +
      '<p>$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} ' +
      'x^{n - k} y^k $$</p>\n' +
      '<h2 id="exponential-function">Exponential Function</h2>\n' +
      '<p>\\[ e^x = \\lim_{n \\to \\infty} ' +
      '\\left( 1+ \\frac{x}{n} \\right)^n \\]</p>\n'
    assert.deepStrictEqual(texme.render(input), expected)
  })
})
