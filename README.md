TeXMe
=====

TeXMe is a lightweight JavaScript utility to create self-rendering
Markdown + LaTeX documents.

[![View Demo][Demo SVG]][Demo URL]
[![NPM Version][Version SVG]][NPM URL]
[![JSDelivr Hits][JSDelivr SVG]][JSDelivr URL]
[![MIT License][License SVG]][L]
[![Twitter][Twitter SVG]][Twitter URL]

[Demo SVG]: https://img.shields.io/badge/view-demo-brightgreen
[Demo URL]: https://susam.github.io/texme/
[Version SVG]: https://img.shields.io/npm/v/texme
[NPM URL]: https://www.npmjs.com/package/texme
[License SVG]: https://img.shields.io/badge/license-MIT-%233ea639
[JSDelivr SVG]: https://data.jsdelivr.com/v1/package/npm/texme/badge?style=rounded
[JSDelivr URL]: https://www.jsdelivr.com/package/npm/texme
[Twitter SVG]: https://img.shields.io/badge/twitter-%40susam-%231da1f2
[Twitter URL]: https://twitter.com/susam


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
  * [Content in Body](#content-in-body)
* [Use TeXMe as a Library](#use-texme-as-a-library)
  * [Install TeXMe](#install-texme)
  * [Render Markdown and LaTeX](#render-markdown-and-latex)
* [Configuration Options](#configuration-options)
* [Self-Hosting TeXMe](#self-hosting-texme)
* [Markdown Priority Environment](#markdown-priority-environment)
  * [Protect Dollar Sign in Code](#protect-dollar-sign-in-code)
  * [Protect Dollar Sign in Image Description](#protect-dollar-sign-in-image-description)
  * [Parsing Precedence](#parsing-precedence)
  * [Unlimited Variants](#unlimited-variants)
* [License](#license)
* [Support](#support)
* [Channels](#channels)
* [More](#more)


Get Started
-----------

Copy and paste the code below into an HTML file with `.html` as the
extension name:

```html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.1.0"></script><textarea>

# Euler's Identity

In mathematics, **Euler's identity** is the equality
$$ e^{i \pi} + 1 = 0. $$

## Explanation

Euler's identity is a special case of Euler's formula from complex
analysis, which states that for any real number $ x $,
$$ e^{ix} = \cos x + i \sin x. $$
```

This file contains one line of HTML code followed by Markdown + LaTeX
content.

Open this HTML file with a web browser. It renders itself to look like this:
[get-started.html](https://susam.github.io/texme/examples/get-started.html).
Here is a screenshot of the output:

![TeXMe Screenshot](https://i.imgur.com/hgKoyHJ.png)

There are three simple rules to remember while using TeXMe:

  - TeXMe removes any leading and trailing whitespace in the content
    before rendering the content to HTML.

  - TeXMe uses the first non-empty line of the content to set the page
    title if no explicit `<title>` element is specified. Any leading and
    trailing whitespace and hash (`#`) characters are removed while
    setting the page title.

  - If there is a Markdown element such as code span/block or image with
    LaTeX delimiters in it (e.g., `$`, `$$`, etc.), TeXMe may interpret
    it as LaTeX which may lead to incorrect rendering of the document.
    To prevent this issue, put such Markdown element within a special
    purpose `md` environment supported by TeXMe, for example,
    ``\begin{md}`echo $foo`\end{md}``. If you do not have such Markdown
    elements with LaTeX delimiters, you may ignore this rule. See the
    [Markdown Priority Environment](#markdown-priority-environment)
    section to see more details about this. Note: For most documents,
    you don't have to worry about this point.

If you do not like to start your document with HTML tags, you can write
your content first and add the `<script>` tag in the end but this
approach has some limitations. See the [Content in
Body](#content-in-body) section for more details about it.


CDN URLs
--------

Use the following URL in the `<script>` tag to load version 1.2.1 (the
current version at this time) of TeXMe:

```
https://cdn.jsdelivr.net/npm/texme@1.2.1
```

Use the following URL in the `<script>` tag to always load the latest
version of TeXMe:

```
https://cdn.jsdelivr.net/npm/texme
```

If you need something really easy to remember, use this URL to load the
latest version of TeXMe:

```
https://unpkg.com/texme
```


Valid HTML5
-----------

The [Get Started](#get-started) section earlier shows how we can create
a self-rendering document with a single line of HTML code but this
brevity comes at the cost of standard conformance. For example, the
required `<title>` element is missing from the code. Further the
`<textarea>` element is not closed.

For the sake of completeness and correctness, here is a minimal but
complete and valid HTML5 example:

```html
<!DOCTYPE html>
<html lang="en">
<title>Notes on Euler's Identity</title>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
<textarea>

# Euler's Identity

In mathematics, **Euler's identity** is the equality
$$ e^{i \pi} + 1 = 0. $$

## Explanation

Euler's identity is a special case of Euler's formula from complex
analysis, which states that for any real number $ x $,
$$ e^{ix} = \cos x + i \sin x. $$

</textarea>
```

Here is the output:
[valid-html5.html](https://susam.github.io/texme/examples/valid-html5.html).

It has a few more lines of code to ensure that this HTML5 code validates
successfully at [validator.w3.org][VALIDATOR]. As a result, this example
does not look as concise as the one in the previous section.

In case you are wondering, a valid HTML5 document does not require
explicit `<head>`, `<body>`, or the closing `</html>` tags, so they have
been omitted for the sake of brevity while maintaining completeness and
correctness.

In practice though, it is not necessary to write verbose code like this.
All browsers follow the [robustness principle][ROBUSTNESS], so they
can render the shorter example in the [Get Started](#get-started)
section just fine.

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

```html
<!DOCTYPE html>
<script>window.texme = { style: 'plain' }</script>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Euler's Identity

In mathematics, **Euler's identity** is the equality
$$ e^{i \pi} + 1 = 0. $$

## Explanation

Euler's identity is a special case of Euler's formula from complex
analysis, which states that for any real number $ x $,
$$ e^{ix} = \cos x + i \sin x. $$
```

Here is the output:
[style-plain.html](https://susam.github.io/texme/examples/style-plain.html).

To render the document with absolutely no style, set `style` to
`'none'`. The `'none'` style option is useful to disable the default
`'viewer'` style set by TeXMe before defining a custom style with
regular CSS code. Here is an example:

```html
<!DOCTYPE html>
<script>window.texme = { style: 'none' }</script>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
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
```

Here is the output:
[style-custom.html](https://susam.github.io/texme/examples/style-custom.html).

Note that the rendered content is displayed within a `<main>` element
inside the `<body>`. That is why these elements are being styled in the
above example.


### Render Markdown Without MathJax

To render Markdown-only content without any mathematical content at all,
set `useMathJax` and `protectMath` options to `false`:

```html
<!DOCTYPE html>
<script>window.texme = { useMathJax: false, protectMath: false }</script>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Atomic Theory

**Atomic theory** is a scientific theory of the nature of matter, which
states that matter is composed of discrete units called *atoms*. It
began as a philosophical concept in ancient Greece and entered the
scientific mainstream in the early 19th century when discoveries in the
field of chemistry showed that matter did indeed behave as if it were
made up of atoms.
```

Here is the output:
[markdown-only.html](https://susam.github.io/texme/examples/markdown-only.html).


### Skip Automatic Rendering on Load

When TeXMe loads, it begins rendering the document automatically. This
automatic rendering may be skipped by setting `renderOnLoad` option to
`false`. Here is an example that disables automatic rendering and then
invokes rendering later on the click of a button by using the
`texme.renderPage()` function from the TeXMe API:
```html
<!DOCTYPE html>
<script>window.texme = { renderOnLoad: false }</script>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
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
```

Here is the output:
[skip-render.html](https://susam.github.io/texme/examples/skip-render.html).


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

```html
<!DOCTYPE html>
<script>window.texme = { renderOnLoad: false }</script>
<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
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
```

Here is the output:
[set-options.html](https://susam.github.io/texme/examples/set-options.html).


### Content in Body

If you do not like to start your document with HTML tags, you can
write your content first and add the `<script>` tag in the end like
this:

```html
# Euler's Identity

In mathematics, **Euler's identity** is the equality
$$ e^{i \pi} + 1 = 0. $$

## Explanation

Euler's identity is a special case of Euler's formula from complex
analysis, which states that for any real number $ x $,
$$ e^{ix} = \cos x + i \sin x. $$

<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
```

Here is the output:
[content-in-body.html](https://susam.github.io/texme/examples/content-in-body.html).

Although, the code looks neater in this example, there is a limitation
associated with this form of writing content: Since the content is part
of the HTML `<body>` element (there is no `<textarea>` element in this
code), the content should be written carefully, so that it does not have
any HTML syntax error.


#### Caveats

While using the content-in-body method of using TeXMe, an HTML syntax
error in the content can produced mangled output. For example, the
following input is not rendered as expected because the content is in
the `<body>` element, so the browser interprets this content as HTML and
encounters the beginning of a start tag that is not closed properly:

````html
Here is some unusual code:

```
print('unusual <string')
```

<script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script>
````

Here is the broken output:
[unusual-code-body.html](https://susam.github.io/texme/examples/unusual-code-body.html).

The `<string` part of the code is interpreted as the opening of a start
tag by the browser. What looks like a fragment of Python code to a human
ends up being parsed as an HTML tag by the browser that looks like this:


````html
<string') ```="" <script="" src="https://cdn.jsdelivr.net/npm/texme@1.2.1">
````

This mangled form of the input is then rendered leading to unexpected
results. To resolve this, put the content within a `<textarea>` element
(as shown in the very first example in this document). The following
input is fine because the content is put inside a `<textarea>` element.

````html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

Here is some unusual code:

```
print('unusual <string')
```
````

Here is the output:
[unusual-code-textarea.html](https://susam.github.io/texme/examples/unusual-code-textarea.html).

Since the content occurs within the `<textarea>` element, the browser
does not parse it as HTML and therefore does not mangle it.


Use TeXMe as a Library
----------------------

The examples so far use TeXMe as a utility. The previous examples load
TeXMe in a web page and then TeXMe automatically picks the `<textarea>`
element containing Markdown + LaTeX code and renders it as HTML.

In this section, we see how to use TeXMe as a library and invoke its
functions. These examples would run as is on Node.js.


### Install TeXMe

Enter the following command to install TeXMe:

```shell
npm install texme
```


### Render Markdown and LaTeX

Markdown + LaTeX content can be rendered to HTML by simply invoking the
`texme.render()` function. It accepts the Markdown + LaTeX content as
a string and returns the rendered HTML as a string. Here is an example:

```javascript
var texme = require('texme')
var input = '**Foo** $$ {a}_{1} {a}_{2} $$'
var output = texme.render(input)
console.log(output)
```

The above example produces the following output:

```html
<p><strong>Foo</strong> $$ {a}_{1} {a}_{2} $$</p>
```


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

  - `markdownURL` (CDN URL of minified marked.js by default): URL to
    load marked.js while running in a web browser.

  - `MathJaxURL` (CDN URL of MathJax by default): URL to load MathJax
    while running in a web browser.


Self-Hosting TeXMe
------------------

Some users of TeXMe want to know if TeXMe can be hosted on one's own
web server such that TeXMe does not load resources from any other web
server while rendering a document, i.e., any requests to load
resources must be made to the same web server from which TeXMe is
loaded. Yes, it is possible to self-host TeXMe in this manner. Here
are the steps:

 1. Clone copies of TeXMe and its dependencies to your own server at a
    location from where you want to serve the files:

        git clone https://github.com/susam/texme.git
        git clone https://github.com/markedjs/marked.git
        git clone https://github.com/mathjax/mathjax.git

 2. Then create a self-rendering document, say, `euler.html` like
    this:

        <!DOCTYPE html>
        <script>
        window.texme = {
          markdownURL: 'marked/marked.min.js',
          MathJaxURL: 'mathjax/es5/tex-mml-chtml.js'
        }
        </script>
        <script src="texme/texme.min.js"></script>
        <textarea>

        # Euler's Identity

        In mathematics, **Euler's identity** is the equality
        $$ e^{i \pi} + 1 = 0. $$

        ## Explanation

        Euler's identity is a special case of Euler's formula from complex
        analysis, which states that for any real number $ x $,
        $$ e^{ix} = \cos x + i \sin x. $$

        </textarea>

 3. Now, open `euler.html` with a web browser and it should
    self-render fine. All resources will be loaded from the local
    disk.

 4. Now test `euler.html` by serving it via a web server. Assuming
    Python 3 is installed, here is one really easy way to test it:

        python3 -m http.server

    Then open `https://localhost:8000/euler.html` using a web server.
    The network tab in the browser's developer tools should show that
    all resources are loaded from the same web server and no requests
    to any other server are made.


Markdown Priority Environment
-----------------------------

TeXMe provides a special LaTeX-like environment named `md`. This is the
*markdown priority environment*. We will see what this term means in the
next section. Let us first see what this environment does by looking at
a few examples of when this special environment can be useful.

TeXMe introduces the special purpose `md` environment to protect
portions of Markdown content from being interpreted as LaTeX. In most
documents, the use of this environment is *not required*. This
environment is useful only in a handful of scenarios where a Markdown
element like code span, code block, link, image, etc. may contain
content with LaTeX delimiters that may get interpreted as LaTeX by TeXMe
thereby leading to a broken rendering of the Markdown element. This
environment protects the content of one or more Markdown elements from
being interpreted as LaTeX. Let us see a few examples in the next two
subsections.


### Protect Dollar Sign in Code

The `md` environment is useful when Markdown code spans or code blocks
contain LaTeX delimiters. This environment prevents the content of
Markdown code spans and code blocks from being interpreted as LaTeX.
Here is an example:

````html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Using Variables

To expand a variable in shell script, prefix the variable name with a
dollar sign. For example:

```
foo=hello
echo $foo
```

The variable `$foo` is substituted with its value, if any, after the
expansion. In the above example, `$foo` expands to the string `hello`,
so the output looks like this:

```
hello
```
````

The above code fails to render as expected because the TeXMe tokenizer
parses out everything between `$foo` and `` `$ `` (inclusive)
and interprets it as possible LaTeX code and prevents the Markdown
parser from seeing it. As a result, the Markdown parser does not see the
triple backticks (```` ``` ````) just after `echo $foo` and the document
gets rendered in an unexpected manner. Here is how the output looks:
[shell-script-unprotected.html](https://susam.github.io/texme/examples/shell-script-unprotected.html).

A rendering issue like this can be prevented with the use of the
markdown priority environment like this:

````html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Using Variables

To expand a variable in shell script, prefix the variable name with a
dollar sign. For example:

\begin{md}
```
foo=hello
echo $foo
```
\end{md}

The variable \begin{md}`$foo`\end{md} is substituted with its value, if
any, after the expansion. In the above example, \begin{md}`$foo`\end{md}
expands to `hello`, so the output looks like this:

```
hello
```
````

The `\begin{md}` and `\end{md}` delimiters create a markdown priority
environment that prevents TeXMe from interpreting anything within it as
LaTeX. Here is how the output looks now:
[shell-script-protected.html](https://susam.github.io/texme/examples/shell-script-protected.html).


### Protect Dollar Sign in Image Description

Here is another example that shows how rendering can break when LaTeX
delimiter is found in a Markdown element such as within image
description and how the usage of the `md` environment can fix it. Here
is an example:

```html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Metasyntactic Variable

![Screenshot of variable $foo assigned and echoed in shell][1]

The screenshot above shows an example usage of a metasyntactic variable
`$foo` in an interactive shell session.

[1]: https://i.imgur.com/iQx46hd.png
```

The above input fails to render as expected because the TeXMe tokenizer
parses out everything between the first occurrence of `$foo` within the
image description and the next occurrence of `` `$ `` (inclusive). As a
result, the Markdown parser does not see the closing bracket of the
image description and does not recognize the image element. This leads
to a broken rendering of the document. Here is how the output looks:
[img-alt-unprotected.html](https://susam.github.io/texme/examples/img-alt-unprotected.html).

The `md` environment can be used to fix the rendering like this:

```html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Metasyntactic Variable

\begin{md}
![Screenshot of variable $foo assigned and echoed in shell][1]
\end{md}

The screenshot above shows an example usage of a metasyntactic variable
\begin{md}`$foo`\end{md} in an interactive shell session.

[1]: https://i.imgur.com/iQx46hd.png
```

Here is how the output looks now:
[img-alt-protected.html](https://susam.github.io/texme/examples/img-alt-protected.html).


### Parsing Precedence

In this subsection, we dive a little deeper into what the `md`
environment is. First, we need to understand how TeXMe renders a
document. TeXMe performs the following steps while rendering a document:

 1. At first, the tokenizer looks for anything that looks like LaTeX and
    masks them, that is, it substitutes all LaTeX snippets in the
    content with mask literal. In case you are curious, the mask literal
    is `::MASK::` but this detail should not matter to you while using
    TeXMe.

 2. Then it feeds the masked input to Markdown parser. The Markdown
    parser cannot see any LaTeX code anymore because they are all
    masked, so it cannot accidentally render any portion of the LaTeX
    code as Markdown. The Markdown parser returns a rendered HTML.

 3. The rendered HTML is then unmasked, that is, all mask literals in
    the rendered HTML are substituted with the original LaTeX
    snippets.

 4. At this point, TeXMe rendering is complete. Now TeXMe invokes
    MathJax to render all LaTeX content in the HTML obtained from
    the previous step.

It is important to note that TeXMe does not implement a Markdown
parser of its own. It relies on an existing popular and stable
Markdown parser that conforms to the GitHub Flavored Markdown (GFM)
specification and has stood the test of time. Note that GFM is a
strict superset of CommonMark. TeXMe only parses out content within
LaTeX delimiters and masks it, so that the Markdown parser cannot see
such content. As a result of this, step 1 can be a problem when there
are LaTeX delimiters like `$`, `$$`, etc. within a Markdown code
span/block. The TeXMe tokenizer interprets the delimiter and the
content after it as LaTeX if it finds the corresponding closing
delimiter too later in the document.  This can break the Markdown
rendering of the code span/block. An example of this was discussed in
the previous section. This issue occurs because TeXMe parses out and
masks the LaTeX snippet before invoking the Markdown parser. The `md`
environment prevents TeXMe from looking for LaTeX content within the
environment.

The `md` environment ensures that anything within `\begin{md}` and
`\end{md}` is not searched for LaTeX delimiters. Anything within this
environment is fed to the Markdown parser intact. This is why this
environment is known as the Markdown priority environment.


### Unlimited Variants

In the previous two subsections we saw how the Markdown priority
environment, that is, the `md` environment is used and what it does but
that is not the entire story. TeXMe provides an unlimited number of
variants of the `md` environment. In fact, any environment name that
starts with the string `md` is a Markdown priority environment, that is,
all of `\begin{md*}`, `\begin{md**}`, `\begin{mdfoo}`, `\begin{mdbar}`,
etc. start Markdown priority environments provided the corresponding
`\end` commands also exist. The `\end` command for a Markdown priority
environment must use the exact same environment name as the `\begin`
delimiter.

The availability of unlimited variants of the Markdown priority
environment is useful when we have a Markdown code span/block that
itself contains code with Markdown priority environment in it such as
perhaps a code example that explains how TeXMe works. Consider the
following example:

`````html
<!DOCTYPE html><script src="https://cdn.jsdelivr.net/npm/texme@1.2.1"></script><textarea>

# Markdown Priority Environment

Here is an example usage of Markdown priority environment:

\begin{md*}
````
\begin{md}
```
foo=hello
echo $foo
```
\end{md}
````
\end{md*}

The above example shows how to protect \begin{md}`$`\end{md},
\begin{md*}`\begin{md}`\end{md*}, and \begin{md*}`\end{md}`\end{md*} in
a Markdown code block.
`````

Here is the output:
[texme-code-protected.html](https://susam.github.io/texme/examples/texme-code-protected.html).

If we start the Markdown priority environment with `\begin{md}`, then we
cannot have `\end{md}` anywhere within the environment because the first
occurrence of it would end the environment. That is why we use
`\begin{md*}` and `\end{md*}` to create a Markdown priority environment.
Now we can safely write `\end{md}` within it.

In case you are wondering what the quadruple backticks are doing in the
above code example, it is a feature defined in the CommonMark
specification. It creates a code block within which we can safely use
triple backticks. CommonMark allows us to start a code span/block with
an arbitrary number of backticks such the code span/block may safely
contain consecutive backticks. To be precise a code span that starts
with M backticks can safely contain N consecutive backticks as long as M
&ne; N. Similarly, a code block that starts with M backticks (M &ge; 3)
can safely contain N consecutive backticks as long as M > N. All of this
is standard CommonMark and not something introduced by TeXMe. TeXMe only
introduces the special purpose `md` environment and its unlimited
variants.


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


Channels
--------

The author of this project hangs out at the following places online:

- Website: [susam.net](https://susam.net)
- Twitter: [@susam](https://twitter.com/susam)
- GitHub: [@susam](https://github.com/susam)
- Matrix: [#susam:matrix.org](https://app.element.io/#/room/#susam:matrix.org)
- IRC: [#susam:libera.chat](https://web.libera.chat/#susam)

You are welcome to subscribe to, follow, or join one or more of the
above channels to receive updates from the author or ask questions
about this project.


More
----

See [MathB](https://github.com/susam/mathb), a mathematics pastebin
built using TeXMe. This is the oldest mathematics pastebin that is
still alive on the web and serving its community of users.

See [Muboard](https://github.com/susam/muboard), a self-rendering and
distributable chalkboard built using TeXMe.
