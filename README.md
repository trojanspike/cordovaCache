cordova_cache
=============

Javascript class for cordova app caching using file system api

### Usage
```js
// initiate the class which will create a catching file
SI.cordovaCache('io.cordova.cordovaCache', function(cache){
    console.log(cache);
    console.log(cache.list()); // array of created container

    var myContainer = cache.container('helloWorld');
    myContainer.get(); // return the value help within the container
    myContainer.put('Hello world'); // add to the container , overwrites previous data
    myContainer.save(); // save the data to the cache file, callback option param
    myContainer.save(function(content){
        console.log(content);
        // all contant from the cache file is JSON string format
    });
    myContainer.details(); // object { created & updated } times
});
```
