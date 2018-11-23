Changelog
=========

0.6.0 (2018-10-22)
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
