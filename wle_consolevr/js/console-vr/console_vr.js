WL.registerComponent('console-vr', {
    _myLog: { type: WL.Type.Object, default: null },
    _myError: { type: WL.Type.Object, default: null },
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
