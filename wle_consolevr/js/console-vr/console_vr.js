WL.registerComponent('console-vr', {
}, {
    init: function () {
        this._myImpl = new PP.ConsoleVR(this);
        this._myImpl.start();
    },
    start: function () {
    },
    update: function (dt) {
        this._myImpl.update(dt);
    }
});
