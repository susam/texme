/*
The MIT License (MIT)

Copyright (c) 2018-2022 Susam Pal

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
   * The markdown module is loaded and assigned to this variable.
   *
   * @type object
   * @memberof inner
   */
  let markdown

  /**
   * Exported module of TeXMe.
   *
   * @exports texme
   */
  const texme = {}

  /**
   * Configuration options object. Each configuration option is set as a
   * property of this object.
   *
   * @type object
   * @memberof inner
   */
  const options = {}

  /**
   * Set default configuration options.
   */
  texme.setDefaultOptions = function () {
    options.renderOnLoad = true
    options.useMathJax = true
    options.protectMath = true
    options.style = 'viewer'
    options.onRenderPage = undefined

    // Update "Configuration Options" section of README.md if any of the
    // following URLs is updated.
    options.markdownURL =
      'https://cdn.jsdelivr.net/npm/marked@4.0.12/marked.min.js'
    options.MathJaxURL =
      'https://cdn.jsdelivr.net/npm/mathjax@3.2.0/es5/tex-mml-chtml.js'
  }

  /**
   * Read configuration options specified in `window.texme` and
   * configure TeXMe.
   *
   * @memberof inner
   */
  const setWindowOptions = function () {
    for (const key in options) {
      if (typeof window !== 'undefined' &&
          typeof window.texme !== 'undefined' &&
          typeof window.texme[key] !== 'undefined') {
        options[key] = window.texme[key]
      }
    }
  }

  /**
   * Set configuration option.
   *
   * @param {string} key - Configuration option name
   * @param {object} val - Configuration value object
   */
  texme.setOption = function (key, val) {
    options[key] = val
  }

  /**
   * Load JS in browser environment.
   *
   * @param {string} url - URL of JavaScript file.
   * @param {function} callback - Callback to invoke after script loads.
   * @memberof inner
   */
  const loadjs = function (url, callback) {
    const script = window.document.createElement('script')
    script.src = url
    script.onload = callback
    window.document.head.appendChild(script)
  }

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
   * A map of available CSS styles.
   *
   * @enum {string}
   * @memberof inner
   */
  const styles = {
    /** Plain white background */
    plain: [
      'body {',
      '  color: #333;',
      '  line-height: 1.5;',
      '}',
      'main {',
      '  max-width: 40em;',
      '  margin-left: auto;',
      '  margin-right: auto;',
      '}',
      'h1, h2, h3, h4, h5, h6, h7 {',
      '  margin: 1em 0 0.5em 0;',
      '  line-height: 1.2;',
      '}',
      'img {',
      '  max-width: 100%;',
      '}',
      'pre, code, samp, kbd {',
      '  color: #009;',
      '  font-family: monospace,monospace;',
      '}',
      'pre, blockquote {',
      '  background: #eee;',
      '  padding: 0.5em;',
      '}',
      'pre {',
      '  overflow: auto;',
      '}',
      'blockquote {',
      '  border-left: medium solid #ccc;',
      '  margin: 1em 0;',
      '}',
      'blockquote :first-child {',
      '  margin-top: 0;',
      '}',
      'blockquote :last-child {',
      '  margin-bottom: 0;',
      '}',
      'table {',
      '  border-collapse: collapse;',
      '}',
      'th, td {',
      '  border: thin solid #999;',
      '  padding: 0.3em 0.4em;',
      '  text-align: left;',
      '}'
    ].join('\n'),

    /** White pane on gray background */
    viewer: [
      '@media screen and (min-width: 40em) {',
      '  body {',
      '    background: #444;',
      '  }',
      '  main {',
      '    background: #fff;',
      '    padding: 5em 6em;',
      '    margin: 1em auto;',
      '    box-shadow: 0.4em 0.4em 0.4em #222;',
      '  }',
      '}'
    ].join('\n'),

    /** No style whatsoever (browser defaults) */
    none: ''
  }
  styles.viewer = styles.plain + styles.viewer

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
    const pattern = [
      '\\\\begin{(.*?)}([\\s\\S]*?)\\\\end{\\1}', // \begin{..}..\end{..}
      '\\\\\\[[\\s\\S]*?\\\\\\]', // \[..\]
      '\\\\\\([\\s\\S]*?\\\\\\)', // \(..\)
      '\\\\\\$', // \$ (literal dollar supported by processEscapes)
      '\\$\\$(?:[^\\\\]|\\\\.)*?\\$\\$', // $$..$$
      '\\$(?:[^$\\\\]|\\\\.)+?\\$', // $..$
      texme.tokenLiteral.MASK // ::MASK::
    ].join('|')
    const re = new RegExp(pattern, 'g')

    let result
    let mdText
    const tokens = []
    let nextIndex = 0

    while ((result = re.exec(s)) !== null) {
      // Markdown text
      if (result.index > nextIndex) {
        mdText = s.substring(nextIndex, result.index)
        tokens.push([texme.tokenType.MARK, mdText])
      }

      if (typeof result[1] !== 'undefined' && result[1].startsWith('md')) {
        // Protected code block
        tokens.push([texme.tokenType.MARK, result[2]])
      } else {
        // Masked text (LaTeX or mask-literal)
        tokens.push([texme.tokenType.MASK, result[0]])
      }

      // Start of next Markdown text
      nextIndex = re.lastIndex
    }

    // Trailing Markdown text
    mdText = s.substring(nextIndex)
    if (s.length > nextIndex) {
      tokens.push([texme.tokenType.MARK, mdText])
    }

    return tokens
  }

  /**
   * Construct Markdown text from the specified tokens such that any
   * LaTeX tokens and mask-literal tokens are masked. The returned
   * string is a masked string containing only Markdown text and no
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
    const maskedText = []
    const maskedTokenValues = []
    let tokenType
    let tokenValue
    let i

    for (i = 0; i < tokens.length; i++) {
      tokenType = tokens[i][0]
      tokenValue = tokens[i][1]

      if (tokenType === texme.tokenType.MARK) {
        maskedText.push(tokenValue)
      } else { // if (tokenType === texme.tokenType.MASK)
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
    const re = new RegExp(texme.tokenLiteral.MASK, 'g')
    let i = 0
    return s.replace(re, function () { return tokens[i++] })
  }

  /**
   * Render Markdown content to HTML.
   *
   * @param {string} s - Markdown content.
   *
   * @returns {string} Rendered HTML.
   */
  texme.renderMarkdown = function (s) {
    return markdown(s)
  }

  /**
   * Render Markdown content while ensuring that LaTeX content is not
   * interpreted and rendered as Markdown.
   *
   * @param {string} s - Markdown + LaTeX content.
   *
   * @returns {string} Rendered HTML.
   */
  texme.protectMathAndRenderMarkdown = function (s) {
    const tokens = texme.tokenize(s)
    const masked = texme.mask(tokens)
    const rendered = texme.renderMarkdown(masked.text)
    const unmasked = texme.unmask(rendered, masked.tokenValues)
    return unmasked
  }

  /**
   * Render Markdown and/or LaTeX content into HTML.
   *
   * If the configuration option `protectMath` is `true` (the default),
   * then LaTeX content is protected from Markdown renderer. Otherwise,
   * the entire content is rendered as Markdown.
   *
   * @param {string} s - Markdown + LaTeX content.
   */
  texme.render = function (s) {
    if (options.protectMath) {
      return texme.protectMathAndRenderMarkdown(s)
    } else {
      return texme.renderMarkdown(s)
    }
  }

  /**
   * Set page to display the rendered content as HTML.
   */
  texme.renderPage = function () {
    const textareaElements = window.document.getElementsByTagName('textarea')
    const outputElement = window.document.createElement('main')
    let inputText
    let title

    // Remove input from page after reading it into a local variable.
    if (textareaElements.length > 0) {
      inputText = textareaElements[0].value.trim()
      textareaElements[0].remove()
    } else {
      inputText = window.document.body.innerHTML.trim()
      window.document.body.innerHTML = ''
    }

    // Set title if it is not specified explicitly.
    if (typeof window.document.title === 'undefined' ||
        window.document.title === '') {
      title = inputText.split('\n', 1)[0].replace(/^\s*#*\s*|\s*#*\s*$/g, '')
      window.document.title = title
    }

    // Create the output element.
    window.document.body.appendChild(outputElement)

    // Set stylesheet.
    const styleElement = window.document.createElement('style')
    const css = styles[options.style]
    styleElement.appendChild(window.document.createTextNode(css))
    window.document.head.appendChild(styleElement)

    // Set meta element.
    const metaElement = window.document.createElement('meta')
    metaElement.name = 'viewport'
    metaElement.content = 'width=device-width, initial-scale=1.0'
    window.document.head.appendChild(metaElement)

    // Render the output.
    outputElement.innerHTML = texme.render(inputText)

    // Typeset LaTeX.
    if (options.useMathJax) {
      window.MathJax.typesetPromise()
    }

    // Invoke onRenderPage callback (if configured).
    if (typeof options.onRenderPage !== 'undefined') {
      options.onRenderPage()
    }
  }

  /**
   * Set up dependencies and set page.
   */
  texme.main = function () {
    texme.setDefaultOptions()

    if (typeof window !== 'undefined') {
      setWindowOptions()

      loadjs(options.markdownURL, function () {
        markdown = window.marked.parse
      })

      if (options.useMathJax) {
        // MathJax configuration.
        window.MathJax = {
          tex: {
            // Enable $...$ as delimiter for inline math.
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            tags: 'ams'
          },
          startup: {
            typeset: false
          }
        }

        loadjs(options.MathJaxURL)
      }

      if (options.renderOnLoad) {
        // Render Markdown + LaTeX after the document loads.
        window.onload = texme.renderPage
      }

      window.texme = texme
    } else {
      markdown = require('marked').parse
      module.exports = texme
    }
  }

  texme.main()
})()
