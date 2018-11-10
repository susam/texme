var assert = require('assert')
var texme = require('../texme.js')

var MARK = texme.tokenType.MARK
var MASK = texme.tokenType.MASK
var MASK_LITERAL = texme.tokenLiteral.MASK

describe('tokenize', function () {
  it('plain text', function () {
    var input = 'Foo'
    var expected = [[MARK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with single dollar', function () {
    var input = '$ 1 + 1 = 2 $'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with double dollars', function () {
    var input = '$$ 1 + 1 = 2 $$'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in the begining', function () {
    var input = '\\$ 1 + 1 = 2 $'
    var expected = [[MASK, '\\$'], [MARK, ' 1 + 1 = 2 $']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in the end', function () {
    var input = '$ 1 + 1 = 2 \\$'
    var expected = [[MARK, '$ 1 + 1 = 2 '], [MASK, '\\$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar followed by dollar in the beginning', function () {
    var input = '\\$$ 1 + 1 = 2 $$'
    var expected = [[MASK, '\\$'], [MASK, '$ 1 + 1 = 2 $'], [MARK, '$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar followed by dollar in the end', function () {
    var input = '$$ 1 + 1 = 2 \\$$'
    var expected = [[MARK, '$'], [MASK, '$ 1 + 1 = 2 \\$$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)

    // The above expected output shows a deviation from MathJax behaviour.
    // MathJax would treat the entire input `$$ 1 + 1 = 2 \$` to be non-math.
    // However we are parsing `$ 1 + 1 = 2 \$$` as math. There are a few things
    // to be said here:
    //
    //   - This difference in behaviour is not apparent to the user. Even with
    //     our deviant tokenization, after mask(), renderCommonMark(), and
    //     unmask(), we present `$$ 1 + 1 = 2 \$$` to MathJax, so it would end
    //     up treating the whole input as non-math anyway. The behaviour
    //     visible to the user is same with both TeXMe and pure-MathJax.
    //
    //   - We expect the user to write `\$` instead of `$` whenever the `$`
    //     could be confused with TeX-delimiters. Therefore, an input like this
    //     which is meant to be purely non-math input is expected to be entered
    //     as `\$\$ 1 + 1 = 2 \$\$` by the user. In this project, we will not
    //     try too hard to maintain behaviour-parity with MathJax for
    //     ill-written input. But we will try hard to do so for well-written
    //     input.
  })

  it('escaped dollar in inline math', function () {
    var input = '$ \\$1 $'
    var expected = [[MASK, '$ \\$1 $']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in displayed math', function () {
    var input = '$$ \\$1 $$'
    var expected = [[MASK, '$$ \\$1 $$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with parentheses', function () {
    var input = '\\( 1 + 1 = 2 \\)'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with brackets', function () {
    var input = '\\[ 1 + 1 = 2 \\]'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math environment', function () {
    var input = '\\begin{align} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{align}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('invalid environment', function () {
    var input = '\\begin{junk} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{junk}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask literal', function () {
    var input = MASK_LITERAL
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('adjacent math', function () {
    var input = '$ 1 + 1 = 2 $$$ 2 + 2 = 4 $$\\begin{align} 3 + 3 = 6 \\end{align}'
    var expected = [
      [MASK, '$ 1 + 1 = 2 $'], [MASK, '$$ 2 + 2 = 4 $$'],
      [MASK, '\\begin{align} 3 + 3 = 6 \\end{align}']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('single dollars in double dollars', function () {
    var input = '$$ $ 1 + 1 = 2 $ $$'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('single dollars in brackets', function () {
    var input = '\\[ $ 1 + 1 = 2 $ \\]'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('parentheses in brackets', function () {
    var input = '\\[ \\( 1 + 1 = 2 \\) \\]'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollars in environment', function () {
    var input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('parentheses and brackets in environment', function () {
    var input = '\\begin{align} \\( 1 + 1 & = 2 \\) \\\\ \\[ 2 + 2 & = 4 \\] \\end{align}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollars in invalid environment', function () {
    var input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in inline math', function () {
    var input = '$' + MASK_LITERAL + '$'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in displayed math', function () {
    var input = '$$' + MASK_LITERAL + '$$'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in environment', function () {
    var input = '\\begin{align} ' + MASK_LITERAL + ' \\end{align}'
    var expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('multiple lines', function () {
    var l1 = 'Binomial theorem:\n'
    var l2 = '$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} x^{n - k} y^k $$'
    var l3 = '\nExponential function:\n'
    var l4 = '\\[ e^x = \\lim_{n \\to \\infty} ' +
             '\\left( 1+ \\frac{x}{n} \\right)^n \\]'
    var expected = [[MARK, l1], [MASK, l2], [MARK, l3], [MASK, l4]]
    assert.deepStrictEqual(texme.tokenize(l1 + l2 + l3 + l4), expected)
  })
})
