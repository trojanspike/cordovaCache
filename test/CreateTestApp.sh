#!/usr/bin/bash

BASE=$(pwd)
clear
echo "Installing bower components" && sleep 2 && \
bower install

echo "setting up the test app" && sleep 2 && \

mkdir $BASE/{hooks,platforms,plugins} && cordova platform add android && cordova plugin add org.apache.cordova.file && \
\
clear && echo "Installing CrossWalk browser" && sleep 2 && \
\
git clone https://github.com/trojanspike/CordovaAndroidCrosswalkInstall.git CrossWalk && \
\
mv $BASE/CrossWalk/CrossWalkInstall.sh $BASE/ && rm -Rf $BASE/CrossWalk/ && \
$BASE/CrossWalkInstall.sh && unlink $BASE/CrossWalkInstall.sh && cp -r $BASE/AndroidManifest.xml $BASE/platforms/android/ && clear && \
echo " Test App Created , Ensure /www/index.html is using the correct ip address for accessing the local javascript."
