const assert = require('assert')
const texme = require('../texme.js')

const MARK = texme.tokenType.MARK
const MASK = texme.tokenType.MASK
const MASK_LITERAL = texme.tokenLiteral.MASK

describe('tokenize', function () {
  it('plain text', function () {
    const input = 'Foo'
    const expected = [[MARK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with single dollar', function () {
    const input = '$ 1 + 1 = 2 $'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with double dollars', function () {
    const input = '$$ 1 + 1 = 2 $$'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in the begining', function () {
    const input = '\\$ 1 + 1 = 2 $'
    const expected = [[MASK, '\\$'], [MARK, ' 1 + 1 = 2 $']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in the end', function () {
    const input = '$ 1 + 1 = 2 \\$'
    const expected = [[MARK, '$ 1 + 1 = 2 '], [MASK, '\\$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar followed by dollar in the beginning', function () {
    const input = '\\$$ 1 + 1 = 2 $$'
    const expected = [[MASK, '\\$'], [MASK, '$ 1 + 1 = 2 $'], [MARK, '$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar followed by dollar in the end', function () {
    const input = '$$ 1 + 1 = 2 \\$$'
    const expected = [[MARK, '$'], [MASK, '$ 1 + 1 = 2 \\$$']]
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
    const input = '$ \\$1 $'
    const expected = [[MASK, '$ \\$1 $']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('escaped dollar in displayed math', function () {
    const input = '$$ \\$1 $$'
    const expected = [[MASK, '$$ \\$1 $$']]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with parentheses', function () {
    const input = '\\( 1 + 1 = 2 \\)'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math with brackets', function () {
    const input = '\\[ 1 + 1 = 2 \\]'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('math environment', function () {
    const input = '\\begin{align} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{align}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('invalid environment', function () {
    const input = '\\begin{junk} 1 + 1 & = 2 \\\\ 2 + 2 & = 4 \\end{junk}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask literal', function () {
    const input = MASK_LITERAL
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('adjacent math', function () {
    const input = '$ 1 + 1 = 2 $$$ 2 + 2 = 4 $$\\begin{align} 3 + 3 = 6 \\end{align}'
    const expected = [
      [MASK, '$ 1 + 1 = 2 $'], [MASK, '$$ 2 + 2 = 4 $$'],
      [MASK, '\\begin{align} 3 + 3 = 6 \\end{align}']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('single dollars in double dollars', function () {
    const input = '$$ $ 1 + 1 = 2 $ $$'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('single dollars in brackets', function () {
    const input = '\\[ $ 1 + 1 = 2 $ \\]'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('parentheses in brackets', function () {
    const input = '\\[ \\( 1 + 1 = 2 \\) \\]'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollars in environment', function () {
    const input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('parentheses and brackets in environment', function () {
    const input = '\\begin{align} \\( 1 + 1 & = 2 \\) \\\\ \\[ 2 + 2 & = 4 \\] \\end{align}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollars in invalid environment', function () {
    const input = '\\begin{align} $ 1 + 1 & = 2 $ \\\\ $$ 2 + 2 & = 4 $$ \\end{align}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in inline math', function () {
    const input = '$' + MASK_LITERAL + '$'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in displayed math', function () {
    const input = '$$' + MASK_LITERAL + '$$'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('mask in environment', function () {
    const input = '\\begin{align} ' + MASK_LITERAL + ' \\end{align}'
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('multiple lines', function () {
    const l1 = 'Binomial theorem:\n'
    const l2 = '$$ (x + y)^n = \\sum_{k=0}^n {n \\choose k} x^{n - k} y^k $$'
    const l3 = '\nExponential function:\n'
    const l4 = '\\[ e^x = \\lim_{n \\to \\infty} ' +
             '\\left( 1+ \\frac{x}{n} \\right)^n \\]'
    const expected = [[MARK, l1], [MASK, l2], [MARK, l3], [MASK, l4]]
    assert.deepStrictEqual(texme.tokenize(l1 + l2 + l3 + l4), expected)
  })

  it('nested environment', function () {
    const input = [
      '\\begin{align*}',
      'A & = \\begin{bmatrix}',
      '        1 & 0 \\\\',
      '        0 & 1',
      '      \\end{bmatrix} \\\\',
      '{a}_{i} & = {b}_{i}',
      '\\end{align*}'
    ].join('\n')
    const expected = [[MASK, input]]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollar in unprotected inline code', function () {
    const input = '`foo = $bar` hello $ 1 + 1 = 2 $'
    const expected = [
      [MARK, '`foo = '],
      [MASK, '$bar` hello $'],
      [MARK, ' 1 + 1 = 2 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollar in unprotected code block', function () {
    const input = [
      '```',
      'foo = $bar',
      '```',
      'hello',
      '$ 1 + 1 = 2 $'
    ].join('\n')
    const expected = [
      [MARK, '```\nfoo = '],
      [MASK, '$bar\n```\nhello\n$'],
      [MARK, ' 1 + 1 = 2 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollar in protected inline code', function () {
    const input = '\\begin{md}`foo = $bar`\\end{md} hello $ 1 + 1 = 2 $'
    const expected = [
      [MARK, '`foo = $bar`'],
      [MARK, ' hello '],
      [MASK, '$ 1 + 1 = 2 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('dollar in protected code block', function () {
    const input = [
      '\\begin{md}',
      '```',
      'foo = $bar',
      '```',
      '\\end{md}',
      'hello',
      '$ 1 + 1 = 2 $'
    ].join('\n')
    const expected = [
      [MARK, '\n```\nfoo = $bar\n```\n'],
      [MARK, '\nhello\n'],
      [MASK, '$ 1 + 1 = 2 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('unprotected nested code block', function () {
    const input = '\\begin{md}`\\begin{md}x\\end{md} a = $b`\\end{md} $ 0 $'
    const expected = [
      [MARK, '`\\begin{md}x'],
      [MARK, ' a = '],
      [MASK, '$b`\\end{md} $'],
      [MARK, ' 0 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('protected nested code block', function () {
    const input = '\\begin{md*}`\\begin{md}x\\end{md} a = $b`\\end{md*} $ 0 $'
    const expected = [
      [MARK, '`\\begin{md}x\\end{md} a = $b`'],
      [MARK, ' '],
      [MASK, '$ 0 $']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })

  it('non-greedy environment name', function () {
    const input = '\\begin{equation} *{x}* = *{y}* \\end{equation} *{x}*'
    const expected = [
      [MASK, '\\begin{equation} *{x}* = *{y}* \\end{equation}'],
      [MARK, ' *{x}*']
    ]
    assert.deepStrictEqual(texme.tokenize(input), expected)
  })
})
