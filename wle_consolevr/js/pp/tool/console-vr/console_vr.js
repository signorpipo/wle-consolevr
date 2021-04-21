WL.registerComponent('console-vr', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myOverrideBrowserConsole: { type: WL.Type.Bool, default: true },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: true },
    _myPulseOnNewMessage: { type: WL.Type.Enum, values: ['none', 'always', 'when hidden'], default: 'when hidden' },
    _myPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
    },
    start: function () {
        let additionalSetup = {};
        additionalSetup.myHandednessIndex = this._myHandedness;
        additionalSetup.myHandedness = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        additionalSetup.myOverrideBrowserConsole = this._myOverrideBrowserConsole;
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myPulseOnNewMessage = this._myPulseOnNewMessage;
        additionalSetup.myPlaneMaterial = this._myPlaneMaterial;
        additionalSetup.myTextMaterial = this._myTextMaterial;

        this._myWidget = new PP.ConsoleVRWidget();
        this._myWidget.start(this.object, additionalSetup);
    },
    update: function (dt) {
        this._myWidget.update(dt);
    }
});
