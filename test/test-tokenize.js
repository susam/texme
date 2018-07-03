var assert = require('assert')
var texme = require('../texme.js')

var MARK = texme.tokenType.MARK
var MASK = texme.tokenType.MASK
var MASK_LITERAL = texme.tokenLiteral.MASK

describe('tokenize', function () {
  it('plain text', function () {
    var input = 'Foo'
    var expected = [[MARK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('math with single dollar', function () {
    var input = '$ 1 + 1 = 2 $'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('math with double dollars', function () {
    var input = '$$ 1 + 1 = 2 $$'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('math with parentheses', function () {
    var input = '\\( 1 + 1 = 2 \\)'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('math with brackets', function () {
    var input = '\\[ 1 + 1 = 2 \\]'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('math environment', function () {
    var input = '\\begin{align} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{align}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('invalid environment', function () {
    var input = '\\begin{junk} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{junk}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('mask literal', function () {
    var input = MASK_LITERAL
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('adjacent math', function () {
    var input = '$ 1 + 1 = 2 $$$ 2 + 2 = 4 $$\\begin{align} 3 + 3 = 6 \\end{align}'
    var expected = [
      [MASK, '$ 1 + 1 = 2 $'], [MASK, '$$ 2 + 2 = 4 $$'],
      [MASK, '\\begin{align} 3 + 3 = 6 \\end{align}']
    ]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('single dollars in double dollars', function () {
    var input = '$$ $ 1 + 1 = 2 $ $$'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('single dollars in brackets', function () {
    var input = '\\[ $ 1 + 1 = 2 $ \\]'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('parentheses in brackets', function () {
    var input = '\\[ \\( 1 + 1 = 2 \\) \\]'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('dollars in environment', function () {
    var input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('parentheses and brackets in environment', function () {
    var input = '\\begin{align} \\( 1 + 1 & = 2 \\) \\\\ \\[ 2 + 2 & = 4 \\] \\end{align}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('dollars in invalid environment', function () {
    var input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('mask in inline math', function () {
    var input = '$' + MASK_LITERAL + '$'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('mask in displayed math', function () {
    var input = '$$' + MASK_LITERAL + '$$'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('mask in environment', function () {
    var input = '\\begin{align} ' + MASK_LITERAL + ' \\end{align}'
    var expected = [[MASK, input]]
    assert.deepEqual(texme.tokenize(input), expected)
  })

  it('multiple lines', function () {
    var l1 = 'Binomial theorem:\n'
    var l2 = '$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} x^{n - k} y^k $$'
    var l3 = '\nExponential function:\n'
    var l4 = '\\[ e^x = \\lim_{n \\to \\infty} ' +
             '\\left( 1+ \\frac{x}{n} \\right)^n \\]'
    var expected = [[MARK, l1], [MASK, l2], [MARK, l3], [MASK, l4]]
    assert.deepEqual(texme.tokenize(l1 + l2 + l3 + l4), expected)
  })
})
