WL.registerComponent('console-vr', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _mShowOnStart: { type: WL.Type.Bool, default: false },
    _myPulseOnNewMessage: { type: WL.Type.Enum, values: ['none', 'always', 'when hidden'], default: 'when hidden' },
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
