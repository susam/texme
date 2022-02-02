Changelog
=========

1.2.0 (UNRELEASED)
------------------

### Changed

- Set MathJax to version 3.2.0.


1.1.0 (2022-02-01)
------------------

### Changed

- Upgrade Marked to version 4.0.12.


1.0.0 (2021-04-25)
------------------

### Added

- Support GitHub Flavored Markdown, a superset of CommonMark.
- Add stylesheet for table element.


### Changed

- Switch from `commonmark` to `marked` for rendering Markdown.
- Revert style of links to browser's default style.


### Fixed

- Perform non-greedy match for LaTeX environment name.


0.9.0 (2020-09-26)
------------------

### Added

- Markdown priority environment (`\begin{md}...\end{md}`) to protect
  LaTeX delimiters within Markdown code blocks and code spans.


### Fixed

- Fix rendering of nested LaTeX environments.


0.8.0 (2020-09-20)
------------------

### Changed

- Update commonmark.js version to 0.29.2
- Update MathJax version to 3.


0.7.0 (2019-05-28)
------------------

### Changed

- Use gray background for `<pre>` and `<blockquote>` elements.
- Use dark blue color for `<pre>` and `<code>` elements.


### Fixed

- MathJax output is too small on mobile display.


0.6.0 (2018-11-22)
------------------

### Added

- Load commonmark.min.js instead of commonmark.js.
- Support escaped dollar to represent literal dollar sign.
- Add option `commonmarkURL` to define URL to load commonmark from.
- Add option `MathJaxURL` to define URL to load MathJax from.


### Fixed

- Do not let image width exceed the width of content.
- Ensure that `commonmark` is defined as soon as it loads so that
  calling `render()` directly with `renderOnLoad` option set as `false`
  does not lead to an error due to undefined `commonmark`.


0.5.0 (2018-10-27)
------------------

### Added

- Allow content to be written directly in the body without `<textarea>`.
- Support TeXMe `<script>` tag at the end of the document.


0.4.0 (2018-10-26)
------------------

### Changed

- Use jsDelivr as the CDN in examples.


0.3.0 (2018-10-25)
------------------

### Added

- Update MathJax version used to 2.7.5.
- Add configuration options:
  - style
  - useMathJax
  - protectMath
  - renderOnLoad
  - onRenderPage


0.2.0 (2018-07-03)
------------------

### Added

- Initial release for self-rendering of MathJax + LaTeX documents.
