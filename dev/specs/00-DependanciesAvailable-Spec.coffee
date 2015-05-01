# http://jasmine.github.io/2.1/introduction.html

describe "Checks required object are abailable", ->

  it "checks cordova FS is defined", ->
    expect window.requestFileSystem
    .toBeDefined()
    return

  it "checks CryptoJS object is defined", ->
    expect CryptoJS
    .toBeDefined()
    return

  it "checks SI.cordovaCache is defined", ->
    expect SI.cordovaCache
    .toBeDefined()
    return
