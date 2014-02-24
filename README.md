cordova cache
=============

Javascript class for cordova app caching using file system api.

Note: It would be bad practice to use this for caching sensitive data like user passwords , user API keys etc in it's current state.

### usage - with cryption
```js
var crypt = function(){
    try{
        SI.cordovaCache('co.uk.sites-ignite.cache', function(cache, crypt){
            console.log(cache);
            console.log(crypt);
            var DoSuccess = function(){
                    console.log(cache.list());
                    var MyCrypt = cache.container('MyCrypt', true); // true means to encrypt the data , defaults to false
                    MyCrypt.put( JSON.stringify( { secretKey : 'acbef12345' } ) );
                    MyCrypt.save(function(allC){
                        console.log('All data from cache');
                        console.log(allC);
                    });
                    MyCrypt.get();  // return the value held within the container

                    // no encryption container
                    var MyNoCrypt = cache.container('MyNoCrypt');
                    MyNoCrypt.put('hello World').save(function(allC){
                        console.log(allC);
                    });
                    console.log(MyCrypt.details().crypt);
                    console.log(MyNoCrypt.details().crypt);
                    console.log(MyCrypt.details());
                },
                DoFailure = function(){
                    // inform user of wrong password -> try again ?
                    crypt.init('WrongPassword', DoSuccess, DoFailure);
                };

            if(crypt.isset()){
                // crypt has been set with a password , now we need to verify
                crypt.init('password', DoSuccess, DoFailure);
            }else{
                // crypt setup is required, obv you would have a user form & view with PWD vs PWD etc
                crypt.setPwd('password', DoSuccess);
            }
        });
    }catch(e){
        console.log(e.message);
    }
};
document.addEventListener('deviceready', crypt, false);
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
* .cordovaCache : 2 params { 1 - string(id of your cordova app) , 2 - function & callback with cache object } throw exceptions

```js
    SI.cordovaCache('io.hellocordova.cache', function(cache){
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

## TODO
* make delete method for container
* make clearAll method for cache object
* try to get the app id automatically
* make test suites
* attach for other libs : jQuery , requirejs & angular
* add secure data saving logic for containers
