TeXMe
=====

TeXMe is a lightweight JavaScript-based utility to create self-rendering
Markdown + LaTeX documents.

[![View Demo][Demo SVG]][Demo URL]
[![Build Status][Travis CI SVG]][Travis CI URL]
[![Coverage Status][Coveralls SVG]][Coveralls URL]
[![NPM Version][Version SVG]][NPM URL]
[![NPM Downloads][Downloads SVG]][NPM URL]
[![MIT License][License SVG]][L]

[Demo SVG]: https://img.shields.io/badge/view-demo-brightgreen.svg
[Demo URL]: https://opendocs.github.io/texme/examples/e00-demo.html
[Travis CI SVG]: https://travis-ci.com/susam/texme.svg?branch=master
[Travis CI URL]: https://travis-ci.com/susam/texme
[Coveralls SVG]: https://coveralls.io/repos/github/susam/texme/badge.svg?branch=master
[Coveralls URL]: https://coveralls.io/github/susam/texme?branch=master
[Version SVG]: https://img.shields.io/npm/v/texme.svg
[Downloads SVG]: https://img.shields.io/npm/dt/texme.svg
[NPM URL]: https://www.npmjs.com/package/texme
[License SVG]: https://img.shields.io/badge/license-MIT-blue.svg


Contents
--------

* [Get Started](#get-started)
* [CDN URLs](#cdn-urls)
* [Valid HTML5](#valid-html5)
* [Use TeXMe in Web Pages](#use-texme-in-web-pages)
  * [Style](#style)
  * [Render Markdown Without MathJax](#render-markdown-without-mathjax)
  * [Skip Automatic Rendering on Load](#skip-automatic-rendering-on-load)
  * [Set Options After Loading](#set-options-after-loading)
* [Use TeXMe as a Library](#use-texme-as-a-library)
  * [Render Markdown and LaTeX](#render-markdown-and-latex)
  * [Render Markdown Only](#render-markdown-only)
* [Configuration Options](#configuration-options)
* [License](#license)
* [Support](#support)


Get Started
-----------
Copy and paste the code below into an HTML file with `.html` as the
extension name:

    <!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script><textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

This file contains one line of HTML code followed by Markdown + LaTeX
content.

Open this HTML file with a web browser. It renders itself to produce
look like this:
[e01-get-started.html](https://opendocs.github.io/texme/examples/e01-get-started.html).

The rendered document demonstrates two interesting features of TeXMe:

  - It removes any leading and trailing whitespace in the content
    specified in `<textarea>` before rendering the document.
  - It uses the first non-empty line of the content in `<textarea>` to
    set the page title if no explicit `<title>` element is specified.


CDN URLs
--------

Use the following URL in the `<script>` tag to load version 0.4.0 (the
current version at this time) of TeXMe:

    https://cdn.jsdelivr.net/npm/texme@0.4.0

Use the following URL in the `<script>` tag to always load the latest
version of TeXMe.

    https://cdn.jsdelivr.net/npm/texme


Valid HTML5
-----------

The "get started" example in the previous section attempts to show how
we can create a self-rendering document with a single line of HTML code
but this brevity comes at the cost of standard conformance. For example,
the required `<title>` element is missing from the code. Further the
`<textarea>` element is not closed.

For the sake of completeness and correctness, here is a minimal but
complete and valid HTML5 example:

    <!DOCTYPE html>
    <html lang="en">
    <title>Notes on Euler's Identity</title>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script>
    <textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>

Here is the output:
[e02-valid-html5.html](https://opendocs.github.io/texme/examples/e02-valid-html5.html).

It has a few more lines of code to ensure that this HTML5 code validates
successfully at [validator.w3.org][VALIDATOR]. As a result, this example
does not look as concise as the one in the previous section.

In case you are wondering, a valid HTML5 document does not require
explicit `<head>`, `<body>`, or the closing `</html>` tags. So they have
been omitted for the sake of brevity while maintaining completeness and
correctness.

In practice though, it is not necessary to write verbose code like this.
All browsers follow the [robustness principle][ROBUSTNESS], so they
can render the shorter example in the previous section just fine.

[VALIDATOR]: https://validator.w3.org/#validate_by_input
[ROBUSTNESS]: https://en.wikipedia.org/wiki/Robustness_principle


Use TeXMe in Web Pages
----------------------

### Style

TeXMe renders the document on a white pane against a gray background by
default. This is due to a configuration option named `style` that is set
to `'viewer'` by default.

To render the document with a minimal style on a completely plain white
background, set the `style` configuration option to `'plain'`. Here is
an example:

    <!DOCTYPE html>
    <script>window.texme = { style: 'plain' }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script><textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

Here is the output:
[e03-style-plain.html](https://opendocs.github.io/texme/examples/e03-style-plain.html).

To render the document with absolutely no style, set `style` to
`'none'`. The `'none'` style option is useful to disable the default
`'viewer'` style set by TeXMe before defining a custom style with
regular CSS code. Here is an example:

    <!DOCTYPE html>
    <script>window.texme = { style: 'none' }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script>
    <style>
    body {
      background: lightcyan;
    }
    main {
      max-width: 20em;
      padding: 1em;
      border: medium double gray;
      margin: 2em auto;
      background: lightyellow;
    }
    </style>
    <textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

Here is the output:
[e04-style-custom.html](https://opendocs.github.io/texme/examples/e04-style-custom.html).

Note that the rendered content is displayed within a `<main>` element
inside the `<body>`. That is why these elements are being styled in the
above example.


### Render Markdown Without MathJax

To render Markdown-only content without any mathematical content at all,
it might be a good idea to eliminate the overhead of the additional
parsing and processing that TeXMe does to prevent the Markdown renderer
from seeing mathematical content as well as the overhead of loading and
running MathJax. This additional overhead for math support can be
eliminated by setting both `useMathJax` and `protectMath` options to
`false`. Here is an example:

    <!DOCTYPE html>
    <script>window.texme = { useMathJax: false, protectMath: false }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script><textarea>

    ### Atomic Theory

    Atomic theory is a scientific theory of the nature of matter, which
    states that matter is composed of discrete units called atoms. It began
    as a philosophical concept in ancient Greece and entered the scientific
    mainstream in the early 19th century when discoveries in the field of
    chemistry showed that matter did indeed behave as if it were made up of
    atoms.

Here is the output:
[e05-markdown-only.html](https://opendocs.github.io/texme/examples/e05-markdown-only.html).


### Skip Automatic Rendering on Load

When TeXMe loads, it begins rendering the document automatically. This
automatic rendering may be skipped by setting `renderOnLoad` option to
`false`. Here is an example that disables automatic rendering and then
invokes rendering later on the click of a button by using the
`texme.renderPage()` function from the TeXMe API:

    <!DOCTYPE html>
    <script>window.texme = { renderOnLoad: false }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script>
    <script>
    window.onload = function () {
      var button = document.getElementById('button')
      button.onclick = function () {
        button.remove()
        texme.renderPage()
      }
    }
    </script>
    <textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>
    <div><button id="button">Render</button></div>

Here is the output:
[e06-skip-render.html](https://opendocs.github.io/texme/examples/e06-skip-render.html).


### Set Options After Loading

When we load TeXMe with the `<script>` tag, it begins rendering the
document as soon as it loads. Therefore in the above examples, we define
the configuration options prior to loading TeXMe. We do this by defining
an object named `window.texme` with the configuration options defined as
properties in this project.

However if we set the `renderOnLoad` option to `false`, we prevent TeXMe
from rendering the document after it loads. We now have the control to
invoke the rendering at a later time, e.g., on the click of a button. In
this case, it is possible to set configuration options after loading
TeXMe with the `texme.setOption()` function. This function takes two
parameters: option name as a string and option value.

Here is an example that skips automatic rendering on load and sets the
style to `'plain'` using this function:

    <!DOCTYPE html>
    <script>window.texme = { renderOnLoad: false }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.4.0"></script>
    <script>
    window.onload = function () {
      var button = document.getElementById('button')
      button.onclick = function () {
        button.remove()
        texme.setOption('style', 'plain')
        texme.renderPage()
      }
    }
    </script>
    <textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi + 1} = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>
    <div><button id="button">Render</button></div>

Here is the output:
[e07-set-options.html](https://opendocs.github.io/texme/examples/e07-set-options.html).


Use TeXMe as a Library
----------------------

Most of the examples so far use TeXMe as a utility. These examples load
TeXMe in a web page and then TeXMe automatically picks the `<textarea>`
element containing Markdown + LaTeX code and renders it as HTML.

In this section, we see how to use TeXMe as a library and invoke its
functions. These examples would run as is on Node.js.


### Install TeXMe

Enter the following command to install TeXMe:

    npm install texme


### Render Markdown and LaTeX

Markdown + LaTeX content can be rendered to HTML by simply invoking the
`texme.render()` function. It accepts the Markdown + LaTeX content as
a string and returns the rendered HTML as a string. Here is an example:

    var texme = require('texme')
    var input = '**Foo** $$ {a}_{1} {a}_{2} $$'
    var output = texme.render(input)
    console.log(output)

The above example produces the following output:

    <p><strong>Foo</strong> $$ {a}_{1} {a}_{2} $$</p>


### Render Markdown Only

To render Markdown-only content, use the `texme.renderCommonMark()`
function to avoid the overhead of looking for and protecting LaTeX
content from being rendered as Markdown. Here is an example:

    var texme = require('texme')
    var input = '**Foo** *Bar* `Baz`'
    var output = texme.renderCommonMark(input)
    console.log(output)

The above example produces the following output:

    <p><strong>Foo</strong> <em>Bar</em> <code>Baz</code></p>

The behaviour of the above example is equivalent to the following:

    var texme = require('texme')
    texme.setOption('protectMath', false)
    var input = '**Foo** *Bar* `Baz`'
    var output = texme.render(input)
    console.log(output)

Note that the `texme.renderCommonMark()` function does not look for
LaTeX content at all. It treats the entire input as Markdown code. As a
result, this function renders an input like

    **Foo** $$ {a}_{1} {a}_{2} $$

as

    <p><strong>Foo</strong> $$ {a}<em>{1} {a}</em>{2} $$</p>

whereas `texme.render()` function looks for and protects LaTeX content
thus rendering the same input as

    <p><strong>Foo</strong> $$ {a}_{1} {a}_{2} $$</p>


Configuration Options
---------------------

Here is a quick reference for all the supported configuration options:

  - `useMathJax` (`true` by default): Load MathJax and run it to render
    LaTeX when set to `true`. Do not load or run MathJax when set to
    `false`.

  - `protectMath` (`true` by default): Prevent Markdown renderer from
    seeing LaTeX code when set to `true`. Therefore LaTeX content
    that may contain text that could be interpreted as Markdown
    (e.g., `$$ {a}_{1} {a}_{2} $$`) remains intact as LaTeX when set to
    `true`. Let Markdown renderer look for Markdown text within LaTeX
    code and render it when set to `false`. For example,
    `$$ {a}_{1} {a}_{2} $$` is rendered as
    `<p>$$ {a}<em>{1} {a}</em>{2} $$</p>` when this option is set to
    `false`.

  - `style` (`'viewer'` by default): Three values are supported:
    `'viewer'`, `'plain'`, and `'none'`. The viewer style displays
    the rendered document on a white pane against a gray background. The
    plain style displays the content with a very minimal style that does
    not change the background style. If set to `'none'`, no style
    whatsoever is applied and the document is displayed with the
    browser's default style.

  - `renderOnLoad` (`true` by default): Begins rendering the document
    automatically on load when set to `true`. Skips rendering
    automatically when set to `false`.

  - `onRenderPage` (`undefined` by default): A callback function that is
    automatically invoked after TeXMe completes rendering the page. It
    is guaranteed that TeXMe has completed rendering the page before
    invoking this callback. If `useMathJax` option is `true`, it is also
    guaranteed that TeXMe has invoked typesetting LaTeX with MathJax
    before invoking this callback. However it is not guaranteed that
    MathJax has completed typesetting the page before this callback is
    invoked. MathJax typesetting occurs asynchronously and may complete
    after this callback is invoked. This callback runs only when the
    `texme.renderPage()` function runs in web browser either due to
    automatic rendering on load or due to explicit call to this
    function.


License
-------

This is free and open source software. You can use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of it,
under the terms of the MIT License. See [LICENSE.md][L] for details.

This software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND,
express or implied. See [LICENSE.md][L] for details.

[L]: LICENSE.md


Support
-------

To report bugs, suggest improvements, or ask questions,
[create issues][ISSUES].

[ISSUES]: https://github.com/susam/texme/issues
