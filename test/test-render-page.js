var assert = require('assert')
var jsdom = require('jsdom')
var commonmark = require('commonmark')
var sinon = require('sinon')
var texme = require('../texme.js')

describe('renderPage', function () {
  it('mathjax typeset', function () {
    var html = '<!DOCTYPE html><textarea>Foo'
    var fakeQueueFunction = sinon.fake()

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: fakeQueueFunction } }

    texme.renderPage()

    assert(fakeQueueFunction.called)
  })

  it('implicit title from content', function () {
    var html = '<!DOCTYPE html><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, 'Foo')
  })

  it('remove leading and trailing spaces in implicit title', function () {
    var html = '<!DOCTYPE html><textarea> \n \tFoo\t \nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, 'Foo')
  })

  it('remove leading and trailing hashes in implicit title', function () {
    var html = '<!DOCTYPE html><textarea>### Foo ###\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, 'Foo')
  })

  it('explicit title intact', function () {
    var html = '<!DOCTYPE html><title>Qux</title><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, 'Qux')
  })

  it('spaces and hashes intact in explicit title', function () {
    var html = '<!DOCTYPE html><title>### Qux ###</title><textarea>Foo'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, '### Qux ###')
  })

  it('explicit title intact', function () {
    var html = '<!DOCTYPE html><title>Qux</title><textarea>Foo\nBar\nBaz'

    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: sinon.fake() } }

    texme.renderPage()

    assert.strictEqual(global.window.document.title, 'Qux')
  })

  /*
  it('in browser with render on load', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: function () {} } } // mock
    global.window.texme = {
      renderOnLoad: true,
      onRenderPage: function () {
        assert.notStrictEqual(typeof global.window.texme, 'undefined')

        delete global.window
        delete global.MathJax

        done()
      }
    }

    texme.renderPage()
  })

  it('in browser use mathjax', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.window.MathJax = { Hub: { Queue: function () {} } } // mock
    global.window.texme = {
      onRenderPage: function () {
        delete global.window
        delete global.MathJax
        done()
      }
    }
    texme.renderPage()
  })
  */
})
