describe("Checks required object are abailable", function() {
  it("checks cordova FS is defined", function() {
    expect(window.requestFileSystem).toBeDefined();
  });
  it("checks CryptoJS object is defined", function() {
    expect(CryptoJS).toBeDefined();
  });
  return it("checks SI.cordovaCache is defined", function() {
    expect(SI.cordovaCache).toBeDefined();
  });
});

describe("Suites runs through cordovaCache methods", function() {
  window.Cache = null;
  window.Crypt = null;
  window.TestContainer = null;
  beforeAll(function(done) {
    return document.addEventListener('deviceready', function() {
      return SI.cordovaCache('test.units.jasmine', function(cache, crypt) {
        window.Cache = cache;
        window.Crypt = crypt;
        return done();
      });
    }, false);
  });
  it("ensures Cache & Crypt are available ", function() {
    expect(Cache).toBeDefined();
    return expect(Crypt).toBeDefined();
  });
  describe("Checks Cache methods are available", function() {
    it("Should have 3 methods", function() {
      return expect(Object.keys(Cache).length).toEqual(3);
    });
    it("should have list method", function() {
      return expect(typeof Cache.list).toBe('function');
    });
    it("should have container method", function() {
      return expect(typeof Cache.container).toBe('function');
    });
    return it("should have rmAll method", function() {
      return expect(typeof Cache.rmAll).toBe('function');
    });
  });
  return describe("Checks Crypt methods are available", function() {
    return it("Should have 3 methods", function() {
      return expect(Object.keys(Crypt).length).toEqual(3);
    });
  });
});

describe(" Are the avail on window ", function() {
  return it("checks cache and crypt are avail", function() {
    console.log(expect(''));
    return expect(window.Cache).toBeDefined();
  });
});

describe(" Are the avail on window ", function() {
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
  return it("checks cache and crypt are avail", function() {
    return expect(window.Cache).toBeDefined();
  });
});
