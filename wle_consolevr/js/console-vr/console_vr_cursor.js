WL.registerComponent('console-vr-cursor', {
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
        this._myConsoleVRCursorObject.scale(this._myConsoleVRCursorSetup.myCursorScale);

        this._myCursorMesh = WL.scene.addObject(this._myConsoleVRCursorObject);

        this._myCursorMeshComponent = this._myCursorMesh.addComponent("mesh");
        this._myCursorMeshComponent.mesh = this._myCursorMeshComponent;
        this._myCursorMeshComponent.material = this._myCursorMaterial.clone();
        this._myCursorMeshComponent.material.color = this._myConsoleVRCursorSetup.myCursorColor;

        this._myCursorComponent = this._myConsoleVRCursorObject.addComponent("cursor");
        this._myCursorComponent.cursorObject = this._myCursorMesh;
        this._myCursorComponent.collisionGroup = this.myCursorTargetCollisionGroup;
        this._myCursorComponent.handedness = 2; //right
        this._myCursorComponent.rayCastMode = 0; //collision
    }
});