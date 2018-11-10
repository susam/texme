window.commonmark = {
  Parser: function () {},
  HtmlRenderer: function () {}
}
window.commonmark.Parser.prototype.parse = function () { return 'foo' }
window.commonmark.HtmlRenderer.prototype.render = function () { return 'bar' }
