WL.registerComponent('console-vr-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myCursorMesh: { type: WL.Type.Mesh, default: null },
    _myCursorMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
        this._myConsoleVRCursorSetup = new PP.ConsoleVRCursorSetup();
    },
    start: function () {
        this._myConsoleVRCursorObject = WL.scene.addObject(this.object);
        this._myConsoleVRCursorObject.setTranslationLocal(this._myConsoleVRCursorSetup.myCursorPosition);
        this._myConsoleVRCursorObject.rotateObject(this._myConsoleVRCursorSetup.myCursorRotation);

        this._myCursorMeshObject = WL.scene.addObject(this._myConsoleVRCursorObject);
        this._myCursorMeshObject.scale(this._myConsoleVRCursorSetup.myCursorMeshScale);

        this._myCursorMeshComponent = this._myCursorMeshObject.addComponent("mesh");
        this._myCursorMeshComponent.mesh = this._myCursorMesh;
        this._myCursorMeshComponent.material = this._myCursorMaterial.clone();
        this._myCursorMeshComponent.material.color = this._myConsoleVRCursorSetup.myCursorColor;

        this._myCursorComponent = this._myConsoleVRCursorObject.addComponent("cursor", { "collisionGroup": this._myConsoleVRCursorSetup.myCursorTargetCollisionGroup });
        this._myCursorComponent.cursorObject = this._myCursorMeshObject;
        this._myCursorComponent.handedness = this._myHandedness + 1;
        this._myCursorComponent.rayCastMode = 0; //collision
    }
});