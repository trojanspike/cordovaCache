#!/usr/bin/bash

BASE=$(pwd)

bower install && \
cordova create ../TestApp && rm -Rf ../TestApp/www/ && rsync -avz ./* ../TestApp/ && \
cd ../TestApp && cordova platform add android && \
cordova plugin add org.apache.cordova.file && \
\
git clone https://github.com/trojanspike/CordovaAndroidCrosswalkInstall.git CrossWalk && \
\
mv ./CrossWalk/CrossWalkInstall.sh ./ && rm -Rf ./CrossWalk/ && \
./CrossWalkInstall.sh && unlink ./CrossWalkInstall.sh
