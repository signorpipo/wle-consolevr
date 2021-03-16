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
        PP.LeftGamepad.start();
        PP.RightGamepad.start();
    },
    update: function (dt) {
        PP.LeftGamepad.update(dt);
        PP.RightGamepad.update(dt);
    },
});

PP.LeftGamepad = new PP.Gamepad(PP.Handedness.LEFT);
PP.RightGamepad = new PP.Gamepad(PP.Handedness.RIGHT);