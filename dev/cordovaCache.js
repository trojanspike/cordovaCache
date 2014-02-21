(function(window) {
  var cordovaCache, defaultDir, opts, _RW, _content, _entry, _getCache, _id, _ready;
  opts = {
    create: true,
    exclusive: false
  };
  defaultDir = 'codova_cache';

  /* ---- Static variables ---- */
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
        return dir.getFile(_id + '.cache', opts, function(entry) {
          _entry = entry;
          if (_content === null) {
            return _RW.read(function(evt) {
              _content = evt.target.result;
              _ready = true;
              return callback();
            });
          }
        }, function() {
          throw new Error('#006 : Directory error');
        });
      }, function() {
        throw new Error('#005 : fileSystem error');
      });
    }, function() {
      throw new Error('#004 : Request error');
    });
  };

  /* ---- cordova cache class ----- */
  cordovaCache = (function() {
    function cordovaCache(container) {
      var cache, methods, _stamp;
      if (_content === '') {
        _stamp = new Date().getTime();
        cache = {};
        cache[container] = {
          content: '',
          created: _stamp,
          updated: _stamp
        };
      } else {
        cache = JSON.parse(_content);
      }
      if (typeof cache[container] === 'undefined') {
        cache[container] = {
          content: '',
          created: _stamp,
          updated: _stamp
        };
      }
      methods = {
        get: function() {
          return cache[container].content;
        },
        put: function(data) {
          if (typeof data !== 'string') {
            throw new TypeError('#101 : user error, put($1) $1 must be a string');
          } else {
            cache[container].content = data;
            return this;
          }
        },
        details: function() {
          return {
            created: cache[container].created,
            updated: cache[container].updated
          };
        },
        save: function(cb) {
          var _Stamp;
          _Stamp = new Date().getTime();
          if (typeof cb !== 'undefined' && typeof cb !== 'function') {
            throw new TypeError('#102 : user error, save($1) $1 must be a function or empty');
          } else {
            if (typeof cache[container].created === 'undefined') {
              cache[container].created = _Stamp;
            }
            cache[container].updated = _Stamp;
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

  /* ----- Attach  ---- */
  window.SI = window.SI || {};
  return window.SI.cordovaCache = function(id, callback) {
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
      container: function(name) {
        return new cordovaCache(name);
      }
    };
    if (typeof window.requestFileSystem !== 'function') {
      throw new Error('ErrorCode #003 : FileSystem not available');
    } else {
      if (_ready === false) {
        return _getCache(function() {
          return callback(CacheObj);
        });
      } else {
        return callback(CacheObj);
      }
    }
  };
})(window);
