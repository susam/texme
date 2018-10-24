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

  it('render on load enabled', function (done) {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark

    global.window.texme = {
      useMathJax: false,
      onRenderPage: function () {
        var textareaList = window.document.getElementsByTagName('textarea')
        var mainList = window.document.getElementsByTagName('main')

        assert.strictEqual(textareaList.length, 0)
        assert.strictEqual(mainList.length, 1)

        delete global.window
        delete global.MathJax

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
      var textareaList = window.document.getElementsByTagName('textarea')
      var mainList = window.document.getElementsByTagName('main')

      assert.strictEqual(textareaList.length, 1)
      assert.strictEqual(mainList.length, 0)

      delete global.window

      done()
    }, 25)
  })
})
