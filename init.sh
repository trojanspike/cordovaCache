#!/usr/bin/env bash

BASE=$(pwd)

# Make cordova dir structure not saved in git
echo "Creating cordova dir structure"
sleep 2
mkdir $BASE/test/{hooks,platforms,plugins}


echo "Setting up the cordova app"
sleep 2

cd  $BASE/test && cordova plugin add add cordova-plugin-file && \
git clone https://github.com/trojanspike/CordovaAndroidCrosswalkInstall.git CrossWalk && \
\
mv $BASE/test/CrossWalk/CrossWalkInstall.sh $BASE/test/ && rm -Rf $BASE/test/CrossWalk/ && \
\
$BASE/test/CrossWalkInstall.sh && unlink $BASE/test/CrossWalkInstall.sh
