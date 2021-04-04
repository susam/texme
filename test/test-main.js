var assert = require('assert')
var url = require('url')
var path = require('path')
var jsdom = require('jsdom')
var marked = require('marked')
var texme = require('../texme.js')

describe('main', function () {
  afterEach(function () {
    // Reset the internal marked variable to the marked object
    // imported with the require() call to ensure that no fake
    // marked object lingers around.
    texme.main()
  })

  it('texme definition in browser', function () {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.marked = marked
    global.window.texme = {
      useMathJax: false,
      onRenderPage: function () {
        delete global.window
      }
    }
    texme.main()
    assert.notStrictEqual(typeof global.window.texme, 'undefined')
    assert.strictEqual(typeof global.window.texme.render, 'function')
  })

  it('marked definition in browser', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    var options = {
      url: new url.URL(path.join('file:///', __filename)),
      runScripts: 'dangerously',
      resources: 'usable'
    }
    global.window = new jsdom.JSDOM(html, options).window
    global.window.texme = {
      useMathJax: false,
      markdownURL: 'aux/fakemarked.js',
      onRenderPage: function () {
        assert.notStrictEqual(typeof global.window.marked, 'undefined')
        delete global.window
        done()
      }
    }
    texme.main()
  })

  it('render on load enabled', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.marked = marked

    global.window.texme = {
      useMathJax: false,
      onRenderPage: function () {
        delete global.window
        done()
      }
    }

    texme.main()
  })

  it('render on load disabled', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.marked = marked

    global.window.texme = { renderOnLoad: false }

    texme.main()

    setTimeout(function () {
      delete global.window
      done()
    }, 25)
  })
})
