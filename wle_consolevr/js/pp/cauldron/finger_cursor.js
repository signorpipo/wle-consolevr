WL.registerComponent('finger-cursor', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myCollisionGroup: { type: WL.Type.Int, default: 1 },
    _myCursorMesh: { type: WL.Type.Mesh, default: null },
    _myCursorMaterial: { type: WL.Type.Material, default: null },
    _myCursorSize: { type: WL.Type.Float, default: 0.0125 }
}, {
    init: function () {
        this._myLastTarget = null;
        this._myRefSpace = null;
        this._myHandInputSource = null;
        this._myHandednessString = ['left', 'right'][this._myHandedness];
    },
    start: function () {
        this._myCursorObject = WL.scene.addObject(this.object.parent);
        this._myCursorObject.scale([this._myCursorSize, this._myCursorSize, this._myCursorSize]);

        if (this._myCursorMesh) {
            this._myCursorMeshComponent = this._myCursorObject.addComponent("mesh");
            this._myCursorMeshComponent.mesh = this._myCursorMesh;
            this._myCursorMeshComponent.material = this._myCursorMaterial.clone();
        }

        this._myCollisionComponent = this._myCursorObject.addComponent('collision');
        this._myCollisionComponent.collider = 0; //sphere
        this._myCollisionComponent.group = 1 << this._myCollisionGroup;
        this._myCollisionComponent.extents = [this._myCursorSize, this._myCursorSize, this._myCursorSize];

        if (WL.xrSession) {
            this._setupVREvents(WL.xrSession);
        } else {
            WL.onXRSessionStart.push(this._setupVREvents.bind(this));
        }
    },
    update: function (dt) {
        this._updateHand();

        if (this._myHandInputSource) {
            let overlaps = this._myCollisionComponent.queryOverlaps();
            let overlapObject = null;
            for (let i = 0; i < overlaps.length; ++i) {
                let object = overlaps[i].object;
                let target = object.getComponent('cursor-target');
                if (target) {
                    overlapObject = target;
                    break;
                }
            }

            if (!overlapObject) {
                if (this._myLastTarget) {
                    this._myLastTarget.onUnhover(this._myLastTarget.object, this);
                    this._myLastTarget = null;
                }
            } else if (!overlapObject.equals(this._myLastTarget)) {
                if (this._myLastTarget) {
                    this._myLastTarget.onUnhover(this._myLastTarget.object, this);
                }

                this._myLastTarget = overlapObject;

                overlapObject.onHover(this._myLastTarget.object, this);
                overlapObject.onClick(this._myLastTarget.object, this);
            }
        } else if (this._myLastTarget) {
            this._myLastTarget.onUnhover(this._myLastTarget.object, this);
            this._myLastTarget = null;
        }
    },
    setActive: function (active) {
        if (this.active != active) {
            if (!active) {
                this._myCursorObject.scale([0, 0, 0]);
                this._myCursorObject.setTranslationLocal([0, -7777, 0]);
            } else {
                this._myCursorObject.resetTransform();
            }
        }

        this.active = active;
    },
    _updateHand() {
        this._myHandInputSource = PP.InputUtils.getInputSource(this._myHandednessString, PP.InputSourceType.HAND);

        if (this._myHandInputSource) {
            let tip = Module['webxr_frame'].getJointPose(this._myHandInputSource.hand.get("index-finger-tip"), this._myRefSpace);

            if (tip) {
                this._myCursorObject.resetTransform();
                this._myCursorObject.transformLocal.set([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);
                this._myCursorObject.translate([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
                this._myCursorObject.scale([this._myCursorSize, this._myCursorSize, this._myCursorSize]);
            }
        }
    },
    _setupVREvents: function (s) {
        s.requestReferenceSpace('local').then(function (refSpace) { this._myRefSpace = refSpace; }.bind(this));
    },
});