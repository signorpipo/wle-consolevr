# :warning: Warning

This project have been deprecated and might no longer work with the latest version of the [Wonderland Engine](https://wonderlandengine.com/).

An updated version of this feature can be found in the [PP library](https://github.com/SignorPipo/wle_pp).

# 

<p align="center">
<br>
<img src="https://github.com/SignorPipo/wle_consolevr/blob/main/extra/showdonttell.gif">
</p>

## Overview
Have you ever wondered why you need to remove your headset to read the browser console? Well me too, that's why I've created the marvelous Console VR! 

And, you know, you don't even have to call something special, just spam those `console.logs`, and the Console VR will do the work for you! <3

You can find a live version of the Console VR [here](https://elia-ducceschi.itch.io/console-vr).

### Features
Console VR can do so many things! You may want to know some of them:
  - Read messages from the VR session, no need to remove your headset
  - Filter by message type, like log, error, warn, and info
  - Clear the console
  - Scroll up and down
  - Show and hide the Console VR
  - Get a pulse notification on your gamepad when a new message is received
  - Choose your handedness
  - Use it with hand tracking
  - Pin the console
  - Be marvelous


### Customization
You can customize the Console VR with a lot of parameters! 
Only some of them are shown on the component itself, while the majority of them can be edited inside the `console_vr_setup.js` script.
From the `console_vr_setup.js` script you can specify, for example:
  - Colors
  - Font size
  - Max number of lines shown
  - Scroll speed
  - ...

### Tricks
  - If you don't want to override the browser console, you can use `PP.ConsoleVR` instead
  - You can show and hide the Console VR by pressing L3 + R3
  - The Console VR can be scrolled by using the left thumbstick
  - If you click (instead of just hovering) on the Up or Down buttons the Console VR will automagically scroll to the top or the bottom
  - The little square in the corner tells you if a new message has arrived in case you have scrolled and could miss that
    - You can click the little square to instantly scroll down
  - You can pin the console through the little `P` button 


### Issues
There are sadly some things that the marvelous Console VR can't achieve yet, this includes:
  - Placeholders like `%d` and other similar kinds of way to build strings are not supported
  - Some messages are not intercepted, probably because they are printed directly onto the browser console without using the console functions
  - If you override the browser console, the link in the browser console related to the position of the log in the code will always refer to the Console VR component
  - When printing an array, all "," substrings are replaced with ", " to add a space between elements, this could also add an extra space to a string stored inside the array if it contains a "," character
  - To avoid filling up the memory, old messages are removed from the Console VR widget after a while
    - If you have scrolled to look at a specific message and then the message suddenly change it could be because it was removed
    - You can change how many messages are kept in the `console_vr_widget_setup.js` script

## How to import
To import the marvelous Console VR you have to:
  - Import the `pp` folder into your `project` folder, along with all the subfolders
    - This `pp` folder should only contain the `pp.js` file, apart for other folders
    - You must link this folder in the Java Script Sources list (under Project Settings) before any other folders that contain scripts that use the `PP` namespace
    - This is needed to make sure the `PP` namespace is created before it is used 
    - If you put it as first (after `/js/components/`) you should be safe
  - Add the `console-vr` component to an object
    - You can add it to one of the hands object to have it on your wrist
    - `_myHandedness`: this optimize the rotation and local position of the Console VR based on how you want to use it
    - `_myOverrideBrowserConsole`: specify if you want to override the browser console
    - `_myShowOnStart`: specify if the Console VR will be visible right from the start
    - `_myShowVisibilityButton`: specify if you want to show the little visibility button
    - `_myPulseOnNewMessage`: specify if the gamepad should pulse when a new message is logged
    - `_myPlaneMaterial`: create a new Flat material from the resources editor panel and add it here
      - to set it as Flat you have to create a new temp mesh object and edit the material from there
      - after creating it you may need to restart the engine
    - `_myTextMaterial`: set this to `DefaultFontMaterial`
  - Add the `tool-cursor` component to one of your hands object
    - `_myHandedness`: specify which hands is being used
    - `_myPulseOnHover`: specify if you want the gamepad to pulse on hover
    - `_myShowFingerCursor`: specify if you want to show the finger cursor for hand tracking, useful if you don't have a mesh on the hand
    - `_myCursorMesh`: set this to `PrimitiveSphere`
    - `_myCursorMaterial`: set this to the same Flat material created above

### Extra
  - **Gamepad**
    - If you want the gamepad extra features you will need to import it too
    - Extra features include
      - Pulse on new message
      - Hide and show the Console VR with L3 + R3
      - Scroll the Console VR with the thumbstick
    - You can find a guide on how to import the gamepad [here](https://github.com/SignorPipo/wle_gamepad)
  - **Font**
    - The Console VR has been tested using the `courier_new` font
    - You can find it inside the `assets` folder
    - It can be set as the project font from the Project Settings
    - Luckily the default font does its job too

## License
You are free to use this in your projects, just remember to credit me somewhere!

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab with small adjustments made by me.
