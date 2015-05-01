#!/usr/bin/bash

BASE=$(pwd)

mkdir $BASE/{hooks,platforms,plugins} && cordova platform add android && cordova plugin add org.apache.cordova.file && \
git clone https://github.com/trojanspike/CordovaAndroidCrosswalkInstall.git CrossWalk && \
\
mv $BASE/CrossWalk/CrossWalkInstall.sh $BASE/ && rm -Rf $BASE/CrossWalk/ && \
$BASE/CrossWalkInstall.sh && unlink $BASE/CrossWalkInstall.sh && cp -r $BASE/AndroidManifest.xml $BASE/platforms/android/ && clear && \
echo " Test App Created "
