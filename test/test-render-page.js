var assert = require('assert')
var jsdom = require('jsdom')
var sinon = require('sinon')
var texme = require('../texme.js')

describe('renderPage', function () {
  before(function () {
    // Ensure that markdown module is loaded.
    texme.main()
  })

  it('content in textarea', function () {
    var html = '<textarea>Foo'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.body.innerHTML,
      '<main><p>Foo</p>\n</main>')

    delete global.window
  })

  it('content in body', function () {
    var html = 'Foo'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.body.innerHTML,
      '<main><p>Foo</p>\n</main>')

    delete global.window
  })

  it('mathjax typeset', function () {
    var html = '<!DOCTYPE html><textarea>Foo'
    var fakeTypesetFunction = sinon.fake()

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: fakeTypesetFunction }

    texme.renderPage()
    assert(fakeTypesetFunction.called)

    delete global.window
  })

  it('implicit title from content', function () {
    var html = '<!DOCTYPE html><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, 'Foo')

    delete global.window
  })

  it('remove leading and trailing spaces in implicit title', function () {
    var html = '<!DOCTYPE html><textarea> \n \tFoo\t \nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, 'Foo')

    delete global.window
  })

  it('remove leading and trailing hashes in implicit title', function () {
    var html = '<!DOCTYPE html><textarea>### Foo ###\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, 'Foo')

    delete global.window
  })

  it('explicit title intact', function () {
    var html = '<!DOCTYPE html><title>Qux</title><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, 'Qux')

    delete global.window
  })

  it('spaces and hashes intact in explicit title', function () {
    var html = '<!DOCTYPE html><title>### Qux ###</title><textarea>Foo'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, '### Qux ###')

    delete global.window
  })

  it('explicit title intact', function () {
    var html = '<!DOCTYPE html><title>Qux</title><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.MathJax = { typeset: sinon.fake() }

    texme.renderPage()
    assert.strictEqual(global.window.document.title, 'Qux')

    delete global.window
  })
})
