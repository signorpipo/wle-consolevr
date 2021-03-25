WL.registerComponent('console-vr', {
    _myPlaneMesh: { type: WL.Type.Mesh, default: null },
    _myPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
    },
    start: function () {
        this._myImpl = new PP.ConsoleVR();
        this._myImpl.start(this);
    },
    update: function (dt) {
        this._myImpl.update(dt);
    }
});
