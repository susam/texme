TeXMe
=====

TeXMe is a lightweight JavaScript-based utility to create self-rendering
Markdown + LaTeX documents.

[![View Demo][Demo SVG]][Demo URL]
[![Build Status][Travis CI SVG]][Travis CI URL]
[![Coverage Status][Coveralls SVG]][Coveralls URL]
[![NPM Version][Version SVG]][NPM URL]
[![MIT License][License SVG]][L]

[Demo SVG]: https://img.shields.io/badge/view-demo-brightgreen.svg
[Demo URL]: https://opendocs.github.io/texme/examples/demo.html
[Travis CI SVG]: https://travis-ci.com/susam/texme.svg?branch=master
[Travis CI URL]: https://travis-ci.com/susam/texme
[Coveralls SVG]: https://coveralls.io/repos/github/susam/texme/badge.svg?branch=master
[Coveralls URL]: https://coveralls.io/github/susam/texme?branch=master
[Version SVG]: https://img.shields.io/npm/v/texme.svg
[NPM URL]: https://www.npmjs.com/package/texme
[License SVG]: https://img.shields.io/badge/license-MIT-blue.svg

**Note:** If you are looking for a tool that renders only Markdown (no
LaTeX), see **[MdMe]**, a stripped down fork of this project.

[MdMe]: https://github.com/susam/mdme


Contents
--------

* [Get Started](#get-started)
  * [Content in Textarea](#content-in-textarea)
  * [Content in Body](#content-in-body)
  * [Special Rules](#special-rules)
* [CDN URLs](#cdn-urls)
* [Valid HTML5](#valid-html5)
* [Use TeXMe in Web Pages](#use-texme-in-web-pages)
  * [Style](#style)
  * [Render Markdown Without MathJax](#render-markdown-without-mathjax)
  * [Skip Automatic Rendering on Load](#skip-automatic-rendering-on-load)
  * [Set Options After Loading](#set-options-after-loading)
* [Use TeXMe as a Library](#use-texme-as-a-library)
  * [Render Markdown and LaTeX](#render-markdown-and-latex)
* [Configuration Options](#configuration-options)
* [License](#license)
* [Support](#support)


Get Started
-----------

### Content in Textarea

Copy and paste the code below into an HTML file with `.html` as the
extension name:

    <!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script><textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

This file contains one line of HTML code followed by Markdown + LaTeX
content.

Open this HTML file with a web browser.
It renders itself to look like this:
[content-in-textarea.html](https://opendocs.github.io/texme/examples/content-in-textarea.html).


### Content in Body

If you do not like to start your document with HTML tags, you can
write your content first and add the `<script>` tag in the end like
this:

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>

Here is the output:
[valid-html5.html](https://opendocs.github.io/texme/examples/valid-html5.html).

Although, the code looks neater in this example, there is a limitation
associated with this method: Since the content is part of the HTML
`<body>` element (there is no `<textarea>` element in this code), the
content should not have an HTML syntax error.

[content-in-textarea]: #content-in-textarea
[content-in-body]: #content-in-body


### Special Rules

If you follow the first example ([content-in-textarea])
example, then there are only two very simple special rules to remember:

  - Any leading and trailing whitespace in the content is removed before
    rendering the content to HTML.
  - Also, the first non-empty line of the content is used to set the
    page title if no explicit `<title>` element is specified. Any
    leading and trailing whitespace and hash (`#`) characters are
    removed while setting the page title.

In other words, if you follow the first example, you only need to add a
single line of HTML code and then start writing your Markdown + LaTeX
content freely.

However if you follow the second example ([content-in-body]), then there
are two more special rules to follow:

  - Do not follow a less-than sign (`<`) immediately with a letter.
  - If it turns out that a less-than sign must be followed by a letter,
    use the HTML entity `&lt;` instead of `<`.

The following input is not fine because the content is in the `<body>`
element and `<` is immediately followed by a letter.

    Here is some unusual code:

        print('unusual <string')

    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>

Here is the output:
[unusual-code-body-broken.html](https://opendocs.github.io/texme/examples/unusual-code-body-broken.html).

The `<string` in the above code is interpreted as the opening of an HTML
start tag by the browser. So what looks like a fragment of Python code
to a human ends up being parsed as an HTML tag by the browser that looks
like this:
`<string') <script="" src="https://cdn.jsdelivr.net/npm/texme@0.5.0">`.

There are two ways to resolve this. The first way of course is to put
the content within a `<textarea>` element (as explained in the very
first example in this document). The following input is fine because the
content is put inside a `<textarea>` element.

    <!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script><textarea>

    Here is some unusual code:

        print('unusual <string')

Here is the output:
[unusual-code-textarea.html](https://opendocs.github.io/texme/examples/unusual-code-textarea.html).

Since the content occurs within `<textarea>` element, the browser does
not try to parse it as HTML and therefore does not mangle it.

The second way is to follow one of the two additional special
rules for writing content in body, i.e., do not put a letter immediately
after `<` or use `&lt;` instead. Here is an example:

    Here is some unusual code:

        print('unusual &lt;string')

    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>

Here is the output:
[unusual-code-body-fixed.html](https://opendocs.github.io/texme/examples/unusual-code-body-fixed.html).


CDN URLs
--------

Use the following URL in the `<script>` tag to load version 0.5.0 (the
current version at this time) of TeXMe:

    https://cdn.jsdelivr.net/npm/texme@0.5.0

Use the following URL in the `<script>` tag to always load the latest
version of TeXMe:

    https://cdn.jsdelivr.net/npm/texme

If you need something really easy to remember, use this URL to load the
latest version of TeXMe:

    https://unpkg.com/texme


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
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>
    <textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>

Here is the output:
[valid-html5.html](https://opendocs.github.io/texme/examples/valid-html5.html).

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
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script><textarea>

    # Euler's Identity

    In mathematics, **Euler's identity** is the equality
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

Here is the output:
[style-plain.html](https://opendocs.github.io/texme/examples/style-plain.html).

To render the document with absolutely no style, set `style` to
`'none'`. The `'none'` style option is useful to disable the default
`'viewer'` style set by TeXMe before defining a custom style with
regular CSS code. Here is an example:

    <!DOCTYPE html>
    <script>window.texme = { style: 'none' }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>
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
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

Here is the output:
[style-custom.html](https://opendocs.github.io/texme/examples/style-custom.html).

Note that the rendered content is displayed within a `<main>` element
inside the `<body>`. That is why these elements are being styled in the
above example.


### Render Markdown Without MathJax

To render Markdown-only content without any mathematical content at all,
use [MdMe]. MdMe is a fork of TeXMe that does not have the code or
overhead associated with additional parsing and processing that TeXMe
does to prevent the Markdown renderer from seeing mathematical content
as well as the overhead of loading and running MathJax. Here is an
example:

    <!DOCTYPE html>
    <script src="https://cdn.jsdelivr.net/npm/mdme"></script><textarea>

    # Atomic Theory

    **Atomic theory** is a scientific theory of the nature of matter, which
    states that matter is composed of discrete units called *atoms*. It
    began as a philosophical concept in ancient Greece and entered the
    scientific mainstream in the early 19th century when discoveries in the
    field of chemistry showed that matter did indeed behave as if it were
    made up of atoms.

Here is the output:
[mdme.html](https://opendocs.github.io/texme/examples/mdme.html).

A similar result can be achieved in TeXMe itself by eliminating the
additional overhead for math support by setting `useMathJax` and
`protectMath` options to `false`. The code for math support would still
be loaded though. Only its execution would be eliminated. Here is an
example:

    <!DOCTYPE html>
    <script>window.texme = { useMathJax: false, protectMath: false }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script><textarea>

    # Atomic Theory

    **Atomic theory** is a scientific theory of the nature of matter, which
    states that matter is composed of discrete units called *atoms*. It
    began as a philosophical concept in ancient Greece and entered the
    scientific mainstream in the early 19th century when discoveries in the
    field of chemistry showed that matter did indeed behave as if it were
    made up of atoms.

Here is the output:
[markdown-only.html](https://opendocs.github.io/texme/examples/markdown-only.html).


### Skip Automatic Rendering on Load

When TeXMe loads, it begins rendering the document automatically. This
automatic rendering may be skipped by setting `renderOnLoad` option to
`false`. Here is an example that disables automatic rendering and then
invokes rendering later on the click of a button by using the
`texme.renderPage()` function from the TeXMe API:

    <!DOCTYPE html>
    <script>window.texme = { renderOnLoad: false }</script>
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>
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
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>
    <div><button id="button">Render</button></div>

Here is the output:
[skip-render.html](https://opendocs.github.io/texme/examples/skip-render.html).


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
    <script src="https://cdn.jsdelivr.net/npm/texme@0.5.0"></script>
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
    $$ e^{i \pi} + 1 = 0. $$

    ## Explanation

    Euler's identity is a special case of Euler's formula from complex
    analysis, which states that for any real number $ x $,
    $$ e^{ix} = \cos x + i \sin x. $$

    </textarea>
    <div><button id="button">Render</button></div>

Here is the output:
[set-options.html](https://opendocs.github.io/texme/examples/set-options.html).


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
