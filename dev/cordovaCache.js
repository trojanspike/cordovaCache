(function(window) {
  var cacheTasks, cordovaCache, crypt, defaultDir, opts, _RW, _content, _crypto, _entry, _getCache, _id, _ready;
  opts = {
    create: true,
    exclusive: false
  };
  defaultDir = 'cordova_cache';

  /* ---- Static variables ---- */
  _crypto = {
    set: false,
    passTest: false,
    _entry: null,
    password: null,
    content: {},
    write: function(con, cb) {
      return _crypto._entry.createWriter(function(W) {
        W.onwriteend = function(evt) {
          return cb();
        };
        return W.write(con);
      });
    },
    encrypt: function(con) {
      return CryptoJS.AES.encrypt(con, _crypto.password).toString();
    },
    decrypt: function(con) {
      return CryptoJS.AES.decrypt(con, _crypto.password).toString(CryptoJS.enc.Utf8);
    }
  };
  _ready = false;
  _id = null;
  _entry = null;
  _content = null;
  _RW = {
    write: function(content, callback) {
      return _entry.createWriter(function(writer) {
        writer.position = 0;
        writer.onwriteend = function(evt) {
          _content = content;
          return callback(content);
        };
        return writer.write(content);
      });
    },
    read: function(callback) {
      return _entry.file(function(file) {
        var reader;
        reader = new FileReader();
        reader.onloadend = function(event) {
          return callback(event);
        };
        return reader.readAsText(file);
      });
    }
  };
  _getCache = function(callback) {

    /* --- */
    return window.requestFileSystem(1, 0, function(fileSys) {
      return fileSys.root.getDirectory(defaultDir, opts, function(dir) {
        var getCache;
        dir.getFile('cacheCrypt.json', opts, function(entry) {
          _crypto._entry = entry;
          return entry.file(function(file) {
            var R;
            R = new FileReader();
            R.onloadend = function(evt) {
              var Result;
              Result = evt.target.result || evt.target._result;
              if (Result === 'null' || Result === '') {
                _crypto.content = {};
                return getCache();
              } else {
                _crypto.content = JSON.parse(Result);
                _crypto.set = typeof _crypto.content[_id] !== 'undefined' ? true : false;
                return getCache();
              }
            };
            return R.readAsText(file);
          });
        }, function() {
          throw new Error('#011 : crypt test file error');
        });
        return getCache = function() {
          return dir.getFile(_id + '.cache', opts, function(entry) {
            _entry = entry;
            if (_content === null) {
              return _RW.read(function(evt) {
                _content = evt.target.result || evt.target._result;
                _ready = true;
                return callback();
              });
            }
          }, function() {
            throw new Error('#006 : Directory error');
          });
        };
      }, function() {
        throw new Error('#005 : fileSystem error');
      });
    }, function() {
      throw new Error('#004 : Request error');
    });
  };

  /* ---- cordova cache class ----- */
  cordovaCache = (function() {
    function cordovaCache(container, cryptParam) {
      var cache, methods, _stamp;
      _stamp = new Date().getTime();
      cache = _content === '' ? {} : JSON.parse(_content);
      if (!cache.hasOwnProperty(container)) {
        cache[container] = {
          content: '',
          details: {
            created: _stamp,
            updated: _stamp,
            crypt: cryptParam
          }
        };
      }
      methods = {
        get: function() {
          if (cryptParam) {
            return _crypto.decrypt(cache[container].content);
          } else {
            return cache[container].content;
          }
        },
        put: function(data) {
          if (typeof data !== 'string') {
            throw new TypeError('#101 : user error, put($1) $1 must be a string');
          } else {
            cache[container].content = cryptParam ? _crypto.encrypt(data) : data;
            return this;
          }
        },
        details: function() {
          return cache[container].details;
        },
        rm: function() {
          var _CONT;
          _CONT = JSON.parse(_content);
          delete _CONT[container];
          cache = _CONT;
          return _RW.write(JSON.stringify(_CONT), function() {
            return true;
          });
        },
        save: function(cb) {
          var _Stamp;
          _Stamp = new Date().getTime();
          if (typeof cb !== 'undefined' && typeof cb !== 'function') {
            throw new TypeError('#102 : user error, save($1) $1 must be a function or empty');
          } else {
            cache[container].details.updated = _Stamp;
            return _RW.write(JSON.stringify(cache), cb || function() {
              return cache[container].content;
            });
          }
        }
      };
      return methods;
    }

    return cordovaCache;

  })();
  crypt = (function() {
    function crypt() {
      if (typeof window.CryptoJS !== 'object') {
        throw new Error('#012 : CryptoJS library required');
      }
    }

    crypt.prototype.init = function(pwd, success, fail) {
      var tryTest;
      if (this.isset() === false) {
        throw new Error('Cryption password is not set up yet: use crypt.setPwd()');
      }
      if (typeof pwd !== 'string' || typeof success !== 'function' || typeof fail !== 'function') {
        throw new Error('crypt.init $1 must be string, $2 must be function, $3 must be function');
      } else {
        _crypto.password = pwd;
        try {
          tryTest = JSON.parse(_crypto.decrypt(_crypto.content[_id]));
          if (tryTest.test) {
            _crypto.set = true;
            _crypto.passTest = true;
            return success();
          } else {
            return fail();
          }
        } catch (_error) {
          return fail();
        }
      }
    };

    crypt.prototype.isset = function() {
      return _crypto.set;
    };

    crypt.prototype.setPwd = function(pwd, callback) {
      if (this.isset() === true) {
        throw new Error('#015 : Password has already been set, use .init or .chngPwd');
      }
      if (typeof pwd !== 'string' || typeof callback !== 'function') {
        throw new Error('crypt.setPwd , $1 must be a string, $2 must be function');
      } else {
        _crypto.set = true;
        _crypto.password = pwd;
        _crypto.content[_id] = _crypto.encrypt(JSON.stringify({
          test: true
        }));
        return _crypto.write(JSON.stringify(_crypto.content), callback);
      }
    };

    return crypt;

  })();

  /* ----- Attach  ---- */
  cacheTasks = function(id, callback) {
    var CacheObj;
    if (typeof id !== 'string' || typeof callback !== 'function') {
      throw new Error('#001 : codovaCache params Error , $1 = string $2 = function');
    }
    if (_id === null) {
      _id = id;
    } else {
      throw new Error('#002 : id is already set');
    }
    if (typeof JSON.parse !== 'function' || typeof JSON.stringify !== 'function') {
      throw new Error('#007 : JSON not available');
    }
    CacheObj = {
      rmAll: function(callback) {
        if (typeof callback !== null && typeof callback !== 'function') {
          throw new Error('#018 : rmAll param to be function or empty');
        } else {
          return _RW.write(JSON.stringify({}), callback || function() {});
        }
      },
      list: function() {
        var key, _list, _obj;
        if (_content === '') {
          return [];
        } else {
          _obj = JSON.parse(_content);
          _list = [];
          for (key in _obj) {
            _list.push(key);
          }
          return _list;
        }
      },
      container: function(name, crypt) {
        if (crypt == null) {
          crypt = false;
        }
        if (typeof crypt !== 'boolean') {
          throw new Error('#018 , container cryption must be true or false');
        }
        if (crypt && !_crypto.passTest) {
          throw new Error('#023 , You must have a success crypt.init before you can use it.');
        }
        return new cordovaCache(name, crypt);
      }
    };
    if (typeof window.requestFileSystem !== 'function') {
      throw new Error('ErrorCode #003 : FileSystem not available');
    } else {
      return _getCache(function() {
        return callback(CacheObj, new crypt);
      });
    }
  };

  /* attach , jQuery , requireJS, angular */
  if (typeof window.jQuery === 'function') {
    jQuery.cordovaCache = cacheTasks;
  }
  if (typeof window.angular === 'object') {
    angular.module('SI.cordova', []).factory('cordovaCache', function() {
      return cacheTasks;
    });
  }
  if (typeof window.define === 'function' && window.define.amd) {
    define('cordovaCache', [], function() {
      return cacheTasks;
    });
  }
  if (typeof window.jQuery !== 'function' && typeof window.angular !== 'object' && typeof window.define !== 'function') {
    window.SI = window.SI || {};
    window.SI.cordovaCache = cacheTasks;
  }
  return null;
})(window);
