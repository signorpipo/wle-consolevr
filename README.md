
## Description
Have you ever wondered why you need to remove your headset to read the browser console? Well me too, that's why I've created the marvelous Console VR! 

And, you know, you don't even have to call something special, just spam those `console.logs`, and the Console VR will do the work for you! <3

### Features
Console VR can do so many things! You may want to know some of them:
  - Read messages from the VR session, no need to remove your headset
  - Filter by message type, like log, error, warn, and info
  - Clear the console
  - Scroll up and down
  - Show and hide the Console VR by pressing L3 + R3
  - Get a pulse notification on your gamepad when a new message is received
  - Choose your handedness
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

### Weaknesses
There are sadly some things that the marvelous Console VR can't achieve yet, this includes:
  - Object will be displayed as \[Object object]
  - Placeholders like %d and other similar kinds of way to build strings are not supported
  - Some messages are not intercepted, like the error from glMatrix.mat4.invert(null, null)

## How to import
TODO

## Credits
Oculus Quest Controller Models by Jezza3D on Sketchfab with small adjustments made by me.
