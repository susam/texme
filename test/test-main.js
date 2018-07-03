var jsdom = require('jsdom')
var commonmark = require('commonmark')
var texme = require('../texme.js')

describe('main', function () {
  beforeEach(function () {
    var html = '<!DOCTYPE html><textarea>Foo'
    global.window = new jsdom.JSDOM(html).window
    global.window.commonmark = commonmark
    global.MathJax = {'Hub': {'Queue': function () {}}} // mock
  })

  afterEach(function () {
    delete global.window
    delete global.MathJax
  })

  it('in browser', function () {
    texme.main()
  })

  it('in node', function () {
    texme.main()
  })
})
