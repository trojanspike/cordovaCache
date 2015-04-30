#!/usr/bin/env bash

BASE=$(pwd)

# Do some init install for dev env
echo "Running init install of node module"
sleep 2
npm install && \
\
# Make cordova dir structure not saved in git
echo "Creating cordova dir structure"
sleep 2
mkdir $BASE/test/{hooks,platforms,plugins} && \
\
\
echo "Setting up the cordova app"
sleep 2

cd  $BASE/test && cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git && \
git clone https://github.com/trojanspike/CordovaAndroidCrosswalkInstall.git CrossWalk && \
\
mv $BASE/test/CrossWalk/CrossWalkInstall.sh $BASE/test/ && rm -Rf $BASE/test/CrossWalk/ && \
\
$BASE/test/CrossWalkInstall.sh && unlink $BASE/test/CrossWalkInstall.sh
