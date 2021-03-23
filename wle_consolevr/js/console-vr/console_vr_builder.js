PP.ConsoleVRBuilder = class ConsoleVRBuilder {

    constructor(consoleVRImpl) {
        this._myConsoleVRImpl = consoleVRImpl;
        this._myConsoleVRComponent = consoleVRImpl._myConsoleVRComponent;
        this._myConsoleVRSetup = consoleVRImpl._myConsoleVRSetup;
    }

    build() {
        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._myConsoleVRImpl._myConsoleVRObject = this._myConsoleVRObject;
        this._myConsoleVRImpl._myConsoleVRMainPanel = this._myConsoleVRMainPanel;
        this._myConsoleVRImpl._myMessagesTextComponents = this._myMessagesTextComponents;
    }

    //Skeleton
    _createSkeleton() {
        this._myConsoleVRObject = WL.scene.addObject(this._myConsoleVRComponent.object);
        this._myConsoleVRMainPanel = WL.scene.addObject(this._myConsoleVRObject);

        this._createMessagesPanelSkeleton();
        this._createButtonsPanelSkeleton();
    }

    _createMessagesPanelSkeleton() {
        this._myMessagesPanel = WL.scene.addObject(this._myConsoleVRMainPanel);
        this._myMessagesBackground = WL.scene.addObject(this._myMessagesPanel);
        this._myMessagesTextsPanel = WL.scene.addObject(this._myMessagesPanel);

        this._myMessagesTexts = [];
        for (let key in PP.ConsoleVR.MessageType) {
            this._myMessagesTexts[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myMessagesTextsPanel);
        }
    }

    _createButtonsPanelSkeleton() {
        this._myButtonsPanel = WL.scene.addObject(this._myConsoleVRMainPanel);

        this._myFilterButtonsPanels = [];
        this._myFilterButtonsBackgrounds = [];
        this._myFilterButtonsTexts = [];

        for (let key in PP.ConsoleVR.MessageType) {
            this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myButtonsPanel);
            this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]]);
            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]]);
        }

        this._myClearButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myClearButtonBackground = WL.scene.addObject(this._myClearButtonPanel);
        this._myClearButtonText = WL.scene.addObject(this._myClearButtonPanel);

        this._myUpButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myUpButtonBackground = WL.scene.addObject(this._myUpButtonPanel);
        this._myUpButtonText = WL.scene.addObject(this._myUpButtonPanel);

        this._myDownButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myDownButtonBackground = WL.scene.addObject(this._myDownButtonPanel);
        this._myDownButtonText = WL.scene.addObject(this._myDownButtonPanel);
    }

    //Transforms
    _setTransforms() {
        this._myConsoleVRObject.setTranslationLocal(this._myConsoleVRSetup.myConsoleVRObjectPosition);
        this._myConsoleVRObject.rotateObject(this._myConsoleVRSetup.myConsoleVRObjectRotation);

        this._setMessagesPanelTransforms();
        this._setButtonsPanelTransforms();

    }

    _setMessagesPanelTransforms() {
        this._myMessagesPanel.setTranslationLocal(this._myConsoleVRSetup.myMessagesPanelPosition);
        this._myMessagesBackground.scale(this._myConsoleVRSetup.myMessagesBackgroundScale);

        this._myMessagesTextsPanel.setTranslationLocal(this._myConsoleVRSetup.myMessagesTextsPanelPosition);
        this._myMessagesTextsPanel.scale(this._myConsoleVRSetup.myMessagesTextsPanelScale);
    }

    _setButtonsPanelTransforms() {
    }

    //Components
    _addComponents() {
        this._addMessagesPanelComponents();
        this._addButtonsPanelComponents();
    }

    _addMessagesPanelComponents() {
        let messagesBackgroundMesh = this._myMessagesBackground.addComponent('mesh');
        messagesBackgroundMesh.mesh = this._myConsoleVRComponent._myBackgroundPlaneMesh;
        messagesBackgroundMesh.material = this._myConsoleVRComponent._myBackgroundPlaneMaterial;
        messagesBackgroundMesh.active = true;

        this._myMessagesTextComponents = [];
        for (let key in PP.ConsoleVR.MessageType) {
            let textComp = this._myMessagesTexts[PP.ConsoleVR.MessageType[key]].addComponent('text');

            textComp.alignment = this._myConsoleVRSetup.myMessagesTextAlignment;
            textComp.justification = this._myConsoleVRSetup.myMessagesTextJustification;
            textComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            textComp.material.color = this._myConsoleVRSetup.myMessagesTextColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineColor = this._myConsoleVRSetup.myMessagesTextColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineRange = this._myConsoleVRSetup.myMessagesTextOutlineRange;
            textComp.material.text = this._myConsoleVRSetup.myMessagesTextStartString.slice(0);

            this._myMessagesTextComponents[PP.ConsoleVR.MessageType[key]] = textComp;
        }


    }

    _addButtonsPanelComponents() {

    }

};