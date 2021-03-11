/**
 * A quick and simple way to have the gamepads up and running
 * Add this manager to an object that will never available destroyed (like the Player object)
 * otherwise the gamepads will not be updated anymore
 */
WL.registerComponent('gamepads-manager', {
}, {
    init: function () {
    },
    start: function () {
        LeftGamepad.start();
        RightGamepad.start();
    },
    update: function (dt) {
        LeftGamepad.update(dt);
        RightGamepad.update(dt);
    },
});

var LeftGamepad = new PP.Gamepad(PP.Handedness.LEFT);
var RightGamepad = new PP.Gamepad(PP.Handedness.RIGHT);