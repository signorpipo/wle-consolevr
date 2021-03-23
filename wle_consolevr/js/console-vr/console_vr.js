WL.registerComponent('console-vr', {
    _myLog: { type: WL.Type.Object, default: null },
    _myError: { type: WL.Type.Object, default: null },
    _myWarn: { type: WL.Type.Object, default: null },
    _myInfo: { type: WL.Type.Object, default: null },
    _myFilterLogButton: { type: WL.Type.Object, default: null },
    _myFilterErrorButton: { type: WL.Type.Object, default: null },
    _myFilterWarnButton: { type: WL.Type.Object, default: null },
    _myFilterInfoButton: { type: WL.Type.Object, default: null },
    _myClearButton: { type: WL.Type.Object, default: null },
    _myUpButton: { type: WL.Type.Object, default: null },
    _myDownButton: { type: WL.Type.Object, default: null },
    _myBackgroundPlaneMesh: { type: WL.Type.Mesh, default: null },
    _myBackgroundPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
    },
    start: function () {
        this._myImpl = new PP.ConsoleVR(this);
        this._myImpl.start();
    },
    update: function (dt) {
        this._myImpl.update(dt);
    }
});
