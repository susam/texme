var assert = require('assert')
var jsdom = require('jsdom')
var commonmark = require('commonmark')
var texme = require('../texme.js')

describe('main', function () {
  it('texme definition in browser', function () {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
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

  it('commonmark definition in browser', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    var options = { runScripts: 'dangerously', resources: 'usable' }
    this.timeout(10000) // Allow some time for commonmark to load
    global.window = new jsdom.JSDOM(html, options).window
    global.window.texme = {
      useMathJax: false,
      onRenderPage: function () {
        assert.notStrictEqual(typeof global.window.commonmark, 'undefined')
        delete global.window
        done()
      }
    }
    texme.main()
  })

  it('render on load enabled', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark

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
    global.window.commonmark = commonmark

    global.window.texme = { renderOnLoad: false }

    texme.main()

    setTimeout(function () {
      delete global.window
      done()
    }, 25)
  })
})
