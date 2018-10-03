/*
The MIT License (MIT)

Copyright (c) 2018 Susam Pal

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// TeXMe - Self-rendering Markdown + LaTeX documents

(function () {
  'use strict'

  /**
   * Private namespace of TeXMe. The members of the inner namespace
   * are inaccessible outside TeXMe.
   *
   * @namespace inner
   */

  /**
   * The commonmark.js module is loaded and assigned to this variable.
   *
   * @type object
   * @memberof inner
   */
  var commonmark

  /**
   * Load JS in browser environment.
   *
   * @param {string} url - URL of JavaScript file.
   * @memberof inner
   */
  var loadjs = function (url) {
    var script = window.document.createElement('script')
    script.src = url
    window.document.head.appendChild(script)
  }

  /**
   * Exported module of TeXMe.
   *
   * @exports texme
   */
  var texme = {}

  /**
   * Enumeration of texme.tokenTypes.
   *
   * @enum {number}
   */
  texme.tokenType = {
    /** Markdown token */
    MARK: 0,

    /** Math token or mask-literal token */
    MASK: 1
  }

  /**
   * Enumeration of special literals. Currently there is only one.
   *
   * @enum {string}
   */
  texme.tokenLiteral = {

    /**
     * Mask literal used to mask math content. All mathematical
     * snippets detected in the content are replaced with this mask
     * literal before performing Markdown rendering on it. This
     * prevents from the Markdown renderer from seeing and
     * processing any math content.
     */
    MASK: '::MASK::'
  }

  /**
   * Stylesheet to use for the rendered page.
   *
   * @type string
   */
  texme.css = [
    'body {',
    '  color: #333333;',
    '}',
    'h1, h2, h3, h4, h5, h6, h7 {',
    '  margin-bottom: 0.5em;',
    '}',
    'a:link, a:visited {',
    '  color: #0000e0;',
    '  text-decoration: underline;',
    '}',
    'a:hover, a:active {',
    '  color: #0000ff;',
    '  text-decoration: underline;',
    '}',
    '@media screen and (min-width: 40em) {',
    '  body {',
    '    background: #444;',
    '  }',
    '  main {',
    '    color: #333;',
    '    background: white;',
    '    padding: 5em 6em;',
    '    max-width: 40em;',
    '    margin: 1em auto;',
    '    box-shadow: 5px 5px 5px #222;',
    '  }',
    '}'
  ].join('\n')

  /**
   * Tokenize input text containing Markdown and LaTeX code.
   *
   * @param {string} s - Text with Markdown and LaTeX code.
   *
   * @returns {Array<Array<string>>} An array of tokens of the form
   *   `[ [<type>, <value>], [<type>, [value], ...] ]` where each
   *   token of the form `[<type>, <value>]` is an array of two
   *   values: {@link module:texme.texme.tokenType tokenType} and token
   *   value (string).
   */
  texme.tokenize = function (s) {
    var pattern = [
      '\\\\begin{.*}[\\s\\S]*?\\\\end{.*}', // \begin{..}..\end{..}
      '\\\\\\[[\\s\\S]*?\\\\\\]', // \[..\]
      '\\\\\\([\\s\\S]*?\\\\\\)', // \(..\)
      '\\$\\$[\\s\\S]*?\\$\\$', // $$..$$
      '\\$[\\s\\S]*?\\$', // $..$
      texme.tokenLiteral.MASK // ::MASK::
    ].join('|')
    var re = new RegExp(pattern, 'g')

    var result
    var markdownText
    var tokens = []
    var nextIndex = 0

    while ((result = re.exec(s)) !== null) {
      // Markdown text
      if (result.index > nextIndex) {
        markdownText = s.substring(nextIndex, result.index)
        tokens.push([texme.tokenType.MARK, markdownText])
      }
      // Masked text (LaTeX or mask-literal)
      tokens.push([texme.tokenType.MASK, result[0]])
      // Start of next Markdown text
      nextIndex = re.lastIndex
    }

    // Trailing Markdown text
    markdownText = s.substring(nextIndex)
    if (s.length > nextIndex) {
      tokens.push([texme.tokenType.MARK, markdownText])
    }

    return tokens
  }

  /**
   * Construct Markdown text from the specified tokens such that any
   * LaTeX tokens and mask-literal tokens are masked. The returned
   * string is a masked string contains only Markdown text and no
   * LaTeX code at all. All LaTeX code in it is masked with
   * mask-literal. So the returned text can now be used to render the
   * Markdown content in it to HTML without affecting any LaTeX code.
   *
   * @param {Array<Array<string>>} tokens - An array of tokens
   * returned by the {@link module:texme.tokenize tokenize} function.
   *
   * @returns {{text: string, tokenValues: Array<string>}} An object
   * with two properties: `text` with the masked string as its value
   * and `tokenValues` with its value as an array of original tokens
   * that were replaced with masks in the masked string.
   */
  texme.mask = function (tokens) {
    var maskedText = []
    var maskedTokenValues = []
    var tokenType
    var tokenValue
    var i

    for (i = 0; i < tokens.length; i++) {
      tokenType = tokens[i][0]
      tokenValue = tokens[i][1]

      if (tokenType === texme.tokenType.MARK) {
        maskedText.push(tokenValue)
      } else if (tokenType === texme.tokenType.MASK) {
        maskedText.push(texme.tokenLiteral.MASK)
        maskedTokenValues.push(tokenValue)
      }
    }

    return {
      text: maskedText.join(''),
      tokenValues: maskedTokenValues
    }
  }

  /**
   * Replace mask-literal tokens with the corresponding content.
   *
   * @param {string} s - A string containing mask-literals.
   * @param {Array<string>} tokens - Arary of token values that were
   * masked by the {@link module:texme#mask mask} function. This array
   * is available as the value of `tokenValues` property of the object
   * returned by the {@link module:texme#mask mask} function.
   *
   * @returns {string} Unmasked text with mask-literal tokens replaced
   * with the original token values.
   */
  texme.unmask = function (s, tokens) {
    var re = new RegExp(texme.tokenLiteral.MASK, 'g')
    var i = 0
    return s.replace(re, function () { return tokens[i++] })
  }

  /**
   * Render Markdown content to HTML.
   *
   * @param {string} s - Markdown content.
   *
   * @returns {string} Rendered HTML.
   */
  texme.renderCommonMark = function (s) {
    var parsed = new commonmark.Parser().parse(s)
    var result = new commonmark.HtmlRenderer().render(parsed)
    return result
  }

  /**
   * Render Markdown + LaTeX content to HTML.
   *
   * @param {string} s - Markdown + LaTeX content.
   *
   * @returns {string} Rendered HTML.
   */
  texme.render = function (s) {
    var tokens = texme.tokenize(s)
    var masked = texme.mask(tokens)
    var rendered = texme.renderCommonMark(masked.text)
    var unmasked = texme.unmask(rendered, masked.tokenValues)
    return unmasked
  }

  /**
   * Set page to display the rendered content as HTML.
   */
  var setPage = function () {
    // Read input text.
    var inputElement = window.document.getElementsByTagName('textarea')[0]
    var inputText = inputElement.value
    var outputElement = window.document.createElement('main')

    // Replace the input element with the output element.
    inputElement.remove()
    window.document.body.appendChild(outputElement)

    // Set stylesheet.
    var styleElement = window.document.createElement('style')
    styleElement.appendChild(window.document.createTextNode(texme.css))
    window.document.head.appendChild(styleElement)

    // Ensure commonmark module is loaded.
    commonmark = window.commonmark

    // Render the output.
    outputElement.innerHTML = texme.render(inputText)
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, outputElement])
  }

  /**
   * Set up dependencies and set page.
   */
  texme.main = function () {
    if (typeof window !== 'undefined') {
      // MathJax configuration.
      window.MathJax = {
        tex2jax: {
          // Enable $...$ as delimiter for inline math.
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          processEscapes: true
        },

        TeX: {
          // Enable equation numbering.
          equationNumbers: {
            autoNumber: 'AMS'
          }
        },

        // We typeset LaTeX ourselves with a MathJax.Hub.Queue call.
        skipStartupTypeset: true
      }

      // Load rendering engines.
      loadjs('https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.28.1/commonmark.js')
      loadjs('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML')

      // Render CommonMark + LaTeX after the document loads.
      window.onload = setPage
      window.texme = texme
    } else {
      commonmark = require('commonmark')
      module.exports = texme
    }
  }

  texme.main()
})()
