cordova cache
=============

Javascript class for cordova app caching using file system api.

### usage - with cryption
```js
try{
    SI.cordovaCache('co.uk.sites-ignite.cache', function(cache, crypto){
        console.log(crypto);
        var DoSuccess = function(){
                console.log(cache.list());
                var MyCrypt = cache.container('MyCrypt', true); // true means to encrypt the data , defaults to false
                MyCrypt.put( JSON.stringify( { secretKey : 'acbef12345' } ) );
                MyCrypt.save(function(allC){
                    console.log('All data from cache');
                    console.log(allC);
                });
                MyCrypt.get();  // return the value held within the container
                console.log(MyCrypt.details());
                console.log(MyCrypt.details().crypt);
            },
            DoFailure = function(){
                // inform user of wrong password -> try again ?
                crypto.init('WrongPassword', DoSuccess, DoFailure);
            };

        if(crypto.isset()){
            // crypto has been set with a password , now we need to verify
            crypto.init('password', DoSuccess, DoFailure);
        }else{
            // crypto setup is required, obv you would have a user form & view with PWD vs PWD etc
            crypto.setPwd('password', DoSuccess);
        }
    });
}catch(e){
    console.log(e.message);
}
```

### Usage - no cryption
```js
// initiate the class which will create your caching file
try {
    SI.cordovaCache('io.cordova.cordovaCache', function(cache){
        console.log(cache);
        console.log(cache.list()); // array of created container

        var myContainer = cache.container('containerName');
        myContainer.get(); // return the value held within the container
        myContainer.put('Hello world'); // add to the container , overwrites previous data
        myContainer.save(); // save the data to the cache file, callback option param
        myContainer.save(function(content){
            console.log(content);
            // all content from the cache file in JSON string format
        });
        myContainer.details(); // object { created & updated } times
        
        var myOtherContainer = cache.container('myOtherContainer');
        var another = cache.container('another');
    });
} catch(e){
    console.log(e.message);
}
```

### window.SI
* .cordovaCache : 2 params { 1 - string(id of your cordova app) , 2 - callback with cache and crypto:(optional) objects } throws exceptions on errors

```js
    SI.cordovaCache('io.hellocordova.cache', function(cache){
        // etc
    });
```
```js
    SI.cordovaCache('io.hellocordova.cache', function(cache, crypto){
        // etc
    });
```
### cache methods
* .list : 0 params , returns array of container available
* .container : 1 param { 1 - string } throws exception if not a string
* example might be :
```js
    if( cache.list().indexOf('myContainer') < 0 ){
        // display to the user maybe to make a name for it?
        $('#create').on('click' , function(){
            var Container = cache.container('myContainer');
            Container.put($('#someInput').val()).save(function(){
                $('#feedback').html('<h3> Saved </h3>');
            }); //chained saved
        });
    }
```
### container methods
* .get  : 0 param
* .put  : 1 param { 1 - string } throws exception if not a string
* .save : 1 param , optional { 1 - function } completes when files is written to and saved , has param of file data in JSON string format
* .details : 0 params , return array of created container available to use
* Example could be :
```js
    var UserPoints = cache.container('UserPoint');
    if (UserPoints.get() == ''){
        UserPoints.put(JSON.stringify({ strength : 0, speed : 0, flight : 0 }));
        UserPoints.save();
    }
    $('#Load').on('click' , function(){
        var _data = JSON.parse( UserPoints.get() );
        $('#strength').text( _data.strength );
        $('#speed').text( _data.speed );
        $('#flight').text( _data.flight );
        $('#updated').text( UserPoint.details().updated );
    });
```
### crypto methods
* .isset : 0 params , return boolean ( password has previously been set for the user )
* .setPwd : 2 params { 1 string, 2 - function:success callback } ( set the users password ) // it's up to you to validate before running this method
* .init : 3 params { 1 - string, 2 - function, 3 - function }
    > ( 1:try a password for the users crypto key )
    > ( 2:success callback - password can decrypt data )
    > ( 3:failure callback - password cannot decrypt data )
* Example could be : note that it's up to you to validate the password before setting it for the user, also inform the user that only they will know the password.
* You could use a general password ( but that's not really secure )
* Or use a password from a server request
```js
    // password was previously set
    if( crypto.isset() ){
        $.somEvent {
            crypto.init( $('#someInput').val(), function(){
                $('#feedback').html('<p class="success">Success</p>');
                doSuccess();
            } , function(){
                $('#feedback').html('<p class="notice">Error</p>');
            } );
        }
    }
    // no password set ?
    if( ! crypto.isset() ){
        // Form displayed to user and validated before running setPwd method
        crypto.setPwd( $('#someInput').val() , doSuccess );
    }
    // using crypto in a container
    var SensitiveData = cache.container('SomeName', true); // true sets it to use crypto : defaults false
    SensitiveData.put( JSON.stringify( { APIkey : 'abc123' } ) );
    SensitiveData.save();

    SensitiveData.details().crypt; // = true, otherwise false
```
## TODO
* make delete method for container
* make clearAll method for cache object
* try to get the app id automatically
* make test suites
* attach for other libs : jQuery , requirejs & angular
* ~~add secure data saving logic for containers~~
