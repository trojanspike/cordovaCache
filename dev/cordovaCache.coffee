do (window)->
  opts = {create: true, exclusive: false}
  defaultDir = 'codova_cache'
  ### ---- Static variables ---- ###
  _crypto =
    set : false
    passTest : false
    _entry : null
    password : null
    content : {}
    write : (con, cb)->
      _crypto._entry.createWriter (W)->
        W.onwriteend=(evt) ->
          cb()
        W.write con
    encrypt : (con) ->
      CryptoJS.AES.encrypt(con, _crypto.password).toString()
    decrypt : (con) ->
      CryptoJS.AES.decrypt(con, _crypto.password).toString CryptoJS.enc.Utf8
############################################
  # _pwdChangeCycle = (cb)->
  #  console.log _content
  #  cb()

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
            dir.getFile 'cacheCrypt.json', opts,
              (entry)->
                # logic for cryption #
                _crypto._entry = entry
                entry.file (file)->
                  R = new FileReader()
                  R.onloadend = (evt)->
                    if evt.target.result is 'null'
                      _crypto.content = {}
                      getCache()
                    else
                      _crypto.content = JSON.parse evt.target.result
                      _crypto.set = if typeof _crypto.content[_id] isnt 'undefined' then true else false
                      getCache()

                  R.readAsText(file)
              -> throw new Error '#011 : crypt test file error'

            getCache = ->
              dir.getFile _id+'.cache', opts,
                (entry)->
                  _entry = entry
                  # _crypt.set = true
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
    constructor:(container, cryptParam)->
      _stamp = new Date().getTime()
      if _content is ''
        cache = {}
        cache[container] = { content : '', details : { created : _stamp, updated : _stamp, crypt : cryptParam } }
      else
        cache = JSON.parse _content

      if typeof cache[container] is 'undefined' then cache[container] = { content : '', details : { created : _stamp, updated : _stamp, crypt : cryptParam } }

      methods =
        get : ->
          if cryptParam then _crypto.decrypt cache[container].content else cache[container].content
        put : (data)->
          if typeof data isnt 'string' then throw new TypeError '#101 : user error, put($1) $1 must be a string'
          else
            cache[container].content = if cryptParam then _crypto.encrypt data else data
            @
        details : ->
          cache[container].details
        save : (cb)->
          _Stamp = new Date().getTime()
          if typeof cb isnt 'undefined' and typeof cb isnt 'function' then throw new TypeError '#102 : user error, save($1) $1 must be a function or empty'
          else
            cache[container].details.updated = _Stamp
            _RW.write JSON.stringify(cache), cb || -> return cache[container].content
      return methods

  class crypt
    constructor:->
      if typeof window.CryptoJS isnt 'object'
        throw new Error '#012 : CryptoJS library required'

    @::init = (pwd, success, fail)->
      if @isset() is false then throw new Error 'Cryption password is not set up yet: use crypt.setPwd()'
      if typeof pwd isnt 'string' or typeof success isnt 'function' or typeof fail isnt 'function'
        throw new Error 'crypt.init $1 must be string, $2 must be function, $3 must be function'
      else
          _crypto.password = pwd
          try
            tryTest = JSON.parse _crypto.decrypt _crypto.content[_id]
            if tryTest.test then _crypto.set=true; _crypto.passTest=true; success() else fail()
          catch
            fail()

    @::isset = -> _crypto.set
    @::setPwd = (pwd, callback)->
      if @isset() is true then throw new Error '#015 : Password has already been set, use .init or .chngPwd'
      if typeof pwd isnt 'string' or typeof callback isnt 'function' then throw new Error 'crypt.setPwd , $1 must be a string, $2 must be function'
      else
        _crypto.set = true
        _crypto.password = pwd
        _crypto.content[_id] = _crypto.encrypt JSON.stringify {test:true}
        _crypto.write JSON.stringify(_crypto.content), callback
    # @::chngPwd = (pwd, callback)->
    #  if typeof pwd isnt 'string' or typeof callback isnt 'function'
    #    throw new Error '#015 : crypt.chngPwd $1 must be string, $2 must be function'
    #  if _crypto.passTest
    #    _crypto.password = pwd
    #    _crypto.content[_id] = _crypto.encrypt JSON.stringify {test:true}
    #    _pwdChangeCycle =>
    #      _crypto.write JSON.stringify(_crypto.content), callback
    #  else
    #    throw new Error 'crypt has no password set correctly'


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
      container : (name, crypt=false)->
        if typeof crypt isnt 'boolean' then throw new Error '#018 , container cryption must be true or false'
        if crypt and !_crypto.passTest then throw new Error '#023 , You must have a success crypt.init before you can use it.'
        new cordovaCache name, crypt
      # crypt : new crypt

    if typeof window.requestFileSystem isnt 'function' then throw new Error 'ErrorCode #003 : FileSystem not available'
    else
      _getCache ->
        callback CacheObj, new crypt