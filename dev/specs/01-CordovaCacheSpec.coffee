
describe "Suites runs through cordovaCache methods", ->
  window.Cache = null
  window.Crypt = null
  window.TestContainer = null

  beforeAll (done)->
    document.addEventListener 'deviceready',
    ->
      SI.cordovaCache 'test.units.jasmine', (cache, crypt)->
        window.Cache = cache
        window.Crypt = crypt

        done()
    , false

  it "ensures Cache & Crypt are available ", ->
    expect Cache
    .toBeDefined()
    expect Crypt
    .toBeDefined()

  # Checks Cache methods
  describe "Checks Cache methods are available", ->
    it "Should have 3 methods", ->
      expect Object.keys(Cache).length
      .toEqual 3

    it "should have list method", ->
      expect typeof Cache.list
      .toBe('function')

    it "should have container method", ->
      expect typeof Cache.container
      .toBe('function')

    it "should have rmAll method", ->
      expect typeof Cache.rmAll
      .toBe('function')

    # Check Crypt Methods
  describe "Checks Crypt methods are available", ->
    it "Should have 3 methods", ->
      expect Object.keys(Crypt).length
      .toEqual 3