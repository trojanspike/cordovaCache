do (window)->
  opts = {create: true, exclusive: false}
  defaultDir = 'codova_cache'
  ### ---- Static variables ---- ###
  _ready = false;
  _id = null
  _entry = null
  _content = null
  _RW =
    write : (content, callback)->
      _entry.createWriter (writer)->
        writer.position = 0
        writer.onwriteend = (evt)->
          _content = content
          callback content
        writer.write content
    read : (callback)->
      _entry.file (file) ->
        reader = new FileReader()
        reader.onloadend = (event)->
          callback event
        reader.readAsText file
  _getCache = (callback)->
    ### --- ###
    window.requestFileSystem 1, 0 ,
      (fileSys)->
        fileSys.root.getDirectory defaultDir, opts,
          (dir)->
            dir.getFile _id+'.cache', opts,
              (entry)->
                _entry = entry
                if _content is null then _RW.read (evt)->
                  _content = evt.target.result
                  _ready = true
                  callback()
                ## silent else , should never be gotten to
                ##
              -> throw new Error '#006 : Directory error'
          -> throw new Error '#005 : fileSystem error'
      -> throw new Error '#004 : Request error'

  ### ---- cordova cache class ----- ###
  class cordovaCache
    constructor:(container)->
      if _content is ''
        _stamp = new Date().getTime()
        cache = {}
        cache[container] = { content : '', created : _stamp, updated : _stamp }
      else
        cache = JSON.parse _content

      if typeof cache[container] is 'undefined' then cache[container] = { content : '', created : _stamp, updated : _stamp }

      methods =
        get : ->
          cache[container].content
        put : (data)->
          if typeof data isnt 'string' then throw new TypeError '#101 : user error, put($1) $1 must be a string'
          else
            cache[container].content = data
            @
        details : ->
          return {
          created : cache[container].created
          updated : cache[container].updated
          }
        save : (cb)->
          _Stamp = new Date().getTime()
          if typeof cb isnt 'undefined' and typeof cb isnt 'function' then throw new TypeError '#102 : user error, save($1) $1 must be a function or empty'
          else
            if typeof cache[container].created is 'undefined' then cache[container].created = _Stamp
            cache[container].updated = _Stamp
            _RW.write JSON.stringify(cache), cb || -> return cache[container].content
      return methods

  ### ----- Attach  ---- ###
  window.SI = window.SI or {}
  window.SI.cordovaCache = (id, callback) ->
    if typeof id isnt 'string' or typeof callback isnt 'function'
      throw new Error '#001 : codovaCache params Error , $1 = string $2 = function'
    if _id is null then _id = id
    else throw new Error '#002 : id is already set'
    if typeof JSON.parse isnt 'function' or typeof JSON.stringify isnt 'function'
      throw new Error '#007 : JSON not available'

    CacheObj =
      list : ->
        if _content is '' then []
        else
          _obj = JSON.parse(_content)
          _list = []
          _list.push key for key of _obj
          return _list
      container : (name)->
        new cordovaCache name

    if typeof window.requestFileSystem isnt 'function' then throw new Error 'ErrorCode #003 : FileSystem not available'
    else
      if _ready is false then _getCache ->
        callback CacheObj
      else
        callback CacheObj