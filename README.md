cordova cache
=============

Javascript class for cordova app caching using file system api.
Note: It would be bad practice to use this for caching sensitive data like user passwords , user API keys etc.

### Usage
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
* .save : 1 param , options { 1 - function } completes when files is written to and saved , has param of file data in JSON string format
* .details : 0 params , return array of created container available to use
* Example could be :
```js
    var UserPoint = cache.container('UserPoint');
    if (UserPoints.get() == ''){
        UserPoints.put(JSON.stringify({ strength : 0, speed : 0, flight : 0 }));
        UserPoints.save();
    }
    $('#Load').on('click' , function(){
        var _data = JSON.parse( UserPoints.get() );
        _data.updated = UserPoints.details().updated;
        $('#strength').text( _data.strength );
        $('#speed').text( _data.speed );
        $('#flight').text( _data.flight );
        $('#updated').text( _data.updated );
    });
```

## TODO
* make delete method for container
* make clearAll method for cache object
* try to get the app id automatically
* make test suites
* attach for other libs : jQuery , requirejs & angular
