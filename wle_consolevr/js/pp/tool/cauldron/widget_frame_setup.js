PP.WidgetFrameSetup = class WidgetFrameSetup {

    constructor(widgetLetterID, buttonsColumnIndex) {

        this._initializeBuildSetup(widgetLetterID, buttonsColumnIndex);
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup(widgetLetterID, buttonsColumnIndex) {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 7;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = 2; // center
        this.myTextJustification = 2; // middle
        this.myTextOutlineRange = [0.45, 0.45];
        this.myTextColor = this.myDefaultTextColor;
        this.myTextOutlineColor = this.myDefaultTextColor;


        this.myVisibilityButtonBackgroundScale = [0.015, 0.015, 1];
        this.myVisibilityButtonTextPosition = [0, 0, 0.007];
        this.myVisibilityButtonTextScale = [0.18, 0.18, 0.18];

        let distanceBetweenToolsVisibilityButtons = 0.01;
        let buttonXOffset = this.myVisibilityButtonBackgroundScale[0] * (2 * buttonsColumnIndex) + distanceBetweenToolsVisibilityButtons * buttonsColumnIndex;

        this.myVisibilityButtonPosition = [];
        this.myVisibilityButtonPosition[PP.HandednessIndex.NONE] = {};
        this.myVisibilityButtonPosition[PP.HandednessIndex.NONE].myPosition = [-0.3 + buttonXOffset, -0.205, 0.035];

        this.myVisibilityButtonPosition[PP.HandednessIndex.LEFT] = {};
        this.myVisibilityButtonPosition[PP.HandednessIndex.LEFT].myPosition = [-0.2 + buttonXOffset, 0.025, 0.015];

        this.myVisibilityButtonPosition[PP.HandednessIndex.RIGHT] = {};
        this.myVisibilityButtonPosition[PP.HandednessIndex.RIGHT].myPosition = [0.2 - buttonXOffset, 0.025, 0.015];

        this.myVisibilityButtonText = widgetLetterID;

        this.myVisibilityButtonCursorTargetPosition = [0, 0, 0];
        this.myVisibilityButtonCursorTargetPosition[2] = this.myVisibilityButtonTextPosition[2];
        this.myVisibilityButtonCollisionExtents = this.myVisibilityButtonBackgroundScale.slice(0);
        this.myVisibilityButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myFlagButtonBackgroundScale = [0.0125, 0.0125, 1];
        this.myFlagButtonTextPosition = [0, 0, 0.007];
        this.myFlagButtonTextScale = [0.15, 0.15, 0.15];

        let distanceBetweenFlagButtons = 0.0075;
        let pinFlagIndex = 0;
        let pinButtonYOffset = this.myVisibilityButtonBackgroundScale[1] + this.myFlagButtonBackgroundScale[1] + distanceBetweenFlagButtons +
            this.myFlagButtonBackgroundScale[1] * (2 * pinFlagIndex) + distanceBetweenFlagButtons * pinFlagIndex;

        this.myPinButtonPosition = [];
        this.myPinButtonPosition[PP.HandednessIndex.NONE] = {};
        this.myPinButtonPosition[PP.HandednessIndex.NONE].myPosition = this.myVisibilityButtonPosition[PP.HandednessIndex.NONE].myPosition.slice(0);
        this.myPinButtonPosition[PP.HandednessIndex.NONE].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[PP.HandednessIndex.LEFT] = {};
        this.myPinButtonPosition[PP.HandednessIndex.LEFT].myPosition = this.myVisibilityButtonPosition[PP.HandednessIndex.LEFT].myPosition.slice(0);
        this.myPinButtonPosition[PP.HandednessIndex.LEFT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[PP.HandednessIndex.RIGHT] = {};
        this.myPinButtonPosition[PP.HandednessIndex.RIGHT].myPosition = this.myVisibilityButtonPosition[PP.HandednessIndex.RIGHT].myPosition.slice(0);
        this.myPinButtonPosition[PP.HandednessIndex.RIGHT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonText = "P";

        this.myPinButtonCursorTargetPosition = [0, 0, 0];
        this.myPinButtonCursorTargetPosition[2] = this.myFlagButtonTextPosition[2];
        this.myPinButtonCollisionExtents = this.myFlagButtonBackgroundScale.slice(0);
        this.myPinButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;
    }

    _initializeRuntimeSetup() {
        this._initializeObjectsTransforms();

        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = [110 / 255, 110 / 255, 110 / 255, 1];
    }

    _initializeObjectsTransforms() {
        this.myPivotObjectTransforms = this._createDefaultObjectTransforms();

        this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.LEFT].myRotation = [-0.645, 0.425, 0.25, 0.584];
        glMatrix.quat.normalize(this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.LEFT].myRotation, this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.LEFT].myRotation);

        this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.RIGHT].myRotation = [-0.645, -0.425, -0.25, 0.584];
        glMatrix.quat.normalize(this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.RIGHT].myRotation, this.myPivotObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.RIGHT].myRotation);

        this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.LEFT].myPosition = [-0.04, 0.045, -0.055];
        this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.LEFT].myRotation = [0, 0.536, -0.43, 0.727];
        glMatrix.quat.normalize(this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.LEFT].myRotation, this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.LEFT].myRotation);

        this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.RIGHT].myPosition = [0.04, 0.045, -0.055];
        this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.RIGHT].myRotation = [0, -0.536, 0.43, 0.727];
        glMatrix.quat.normalize(this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.RIGHT].myRotation, this.myPivotObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.RIGHT].myRotation);

        this.myWidgetObjectTransforms = this._createDefaultObjectTransforms();

        this.myWidgetObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.LEFT].myPosition = [0.1, 0.23, -0.02];
        this.myWidgetObjectTransforms[PP.InputSourceType.GAMEPAD][PP.HandednessIndex.RIGHT].myPosition = [0.07, 0.23, -0.02];

        this.myWidgetObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.LEFT].myPosition = [0.1, 0.23, -0.02];
        this.myWidgetObjectTransforms[PP.InputSourceType.HAND][PP.HandednessIndex.RIGHT].myPosition = [0.07, 0.23, -0.02];

    }

    _createDefaultObjectTransforms() {
        let defaultObjectTransforms = [];

        for (let inputSourceTypeKey in PP.InputSourceType) {
            let inputSourceType = PP.InputSourceType[inputSourceTypeKey];
            defaultObjectTransforms[inputSourceType] = [];
            for (let handednessKey in PP.HandednessIndex) {
                let handedness = PP.HandednessIndex[handednessKey];
                defaultObjectTransforms[inputSourceType][handedness] = {};
                defaultObjectTransforms[inputSourceType][handedness].myPosition = [0, 0, 0];
                defaultObjectTransforms[inputSourceType][handedness].myRotation = [0, 0, 0, 1];
            }
        }

        return defaultObjectTransforms;
    }
};