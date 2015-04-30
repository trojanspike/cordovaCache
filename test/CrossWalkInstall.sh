#!/usr/bin/env bash

# INFO on version @
# https://download.01.org/crosswalk/releases/crosswalk/android/stable/

base=$(pwd)

CROSSWALK_VERSION="10.39.235.15"
CROSS_WALK_86="https://download.01.org/crosswalk/releases/crosswalk/android/stable/$CROSSWALK_VERSION/x86/crosswalk-cordova-$CROSSWALK_VERSION-x86.zip"
CROSS_WALK_ARM="https://download.01.org/crosswalk/releases/crosswalk/android/stable/$CROSSWALK_VERSION/arm/crosswalk-cordova-$CROSSWALK_VERSION-arm.zip"

ENGINE_DIR="$base/engine"
ANDROID_DIR="$base/platforms/android"

function end(){
echo "Crosswalk installed into cordova "
echo "You need to add permission to platforms/android/AndroidManifest.xml"
echo "<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\" />"
echo "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />"
echo "============================================================================"
}

if [ ! -d "$ANDROID_DIR" ]; then
 cordova platform add android
 sleep 3
fi

rm -Rf $ENGINE_DIR && mkdir $ENGINE_DIR && cd $ENGINE_DIR && \
echo "Downloading Crosswalk engine" && \
wget $CROSS_WALK_86 $CROSS_WALK_ARM && \
\
echo "Unzipping crosswalk" && \
unzip crosswalk-cordova-$CROSSWALK_VERSION-x86.zip && \
unzip crosswalk-cordova-$CROSSWALK_VERSION-arm.zip && cd $base && \

echo "Clearing CordovaLib for updating" && \
rm -Rf $ANDROID_DIR/CordovaLib/* && cp -a $ENGINE_DIR/crosswalk-cordova-$CROSSWALK_VERSION-x86/framework/* $ANDROID_DIR/CordovaLib/ \
&& cp -a $ENGINE_DIR/crosswalk-cordova-$CROSSWALK_VERSION-arm/framework/xwalk_core_library/libs/armeabi-v7a/ $ANDROID_DIR/CordovaLib/xwalk_core_library/libs/ \
\
&& cp $ENGINE_DIR/crosswalk-cordova-$CROSSWALK_VERSION-x86/VERSION $ANDROID_DIR/ \

echo "Updating project using apache-ant"
cd $ANDROID_DIR/CordovaLib && android update project --subprojects --path . --target "android-19" && ant debug && cd $base \
&& end
