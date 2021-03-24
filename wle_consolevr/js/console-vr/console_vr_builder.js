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

        this._createMessagesSkeleton();
        this._createButtonsSkeleton();
        this._createPointerSkeleton();
    }

    _createMessagesSkeleton() {
        this._myMessagesPanel = WL.scene.addObject(this._myConsoleVRMainPanel);
        this._myMessagesBackground = WL.scene.addObject(this._myMessagesPanel);
        this._myMessagesTextsPanel = WL.scene.addObject(this._myMessagesPanel);

        this._myMessagesTexts = [];
        for (let key in PP.ConsoleVR.MessageType) {
            this._myMessagesTexts[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myMessagesTextsPanel);
        }
    }

    _createButtonsSkeleton() {
        this._myButtonsPanel = WL.scene.addObject(this._myConsoleVRMainPanel);

        this._myFilterButtonsPanels = [];
        this._myFilterButtonsBackgrounds = [];
        this._myFilterButtonsTexts = [];
        this._myFilterButtonsCursorTargets = [];

        for (let key in PP.ConsoleVR.MessageType) {
            this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myButtonsPanel);
            this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]]);
            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]]);
            this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]] = WL.scene.addObject(this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]]);
        }

        this._myClearButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myClearButtonBackground = WL.scene.addObject(this._myClearButtonPanel);
        this._myClearButtonText = WL.scene.addObject(this._myClearButtonPanel);
        this._myClearButtonCursorTarget = WL.scene.addObject(this._myClearButtonPanel);

        this._myUpButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myUpButtonBackground = WL.scene.addObject(this._myUpButtonPanel);
        this._myUpButtonText = WL.scene.addObject(this._myUpButtonPanel);
        this._myUpButtonCursorTarget = WL.scene.addObject(this._myUpButtonPanel);

        this._myDownButtonPanel = WL.scene.addObject(this._myButtonsPanel);
        this._myDownButtonBackground = WL.scene.addObject(this._myDownButtonPanel);
        this._myDownButtonText = WL.scene.addObject(this._myDownButtonPanel);
        this._myDownButtonCursorTarget = WL.scene.addObject(this._myDownButtonPanel);
    }

    _createPointerSkeleton() {
        this._myPointerCursorTarget = WL.scene.addObject(this._myConsoleVRMainPanel);
    }
    //Transforms
    _setTransforms() {
        this._myConsoleVRObject.setTranslationLocal(this._myConsoleVRSetup.myConsoleVRObjectPosition);
        this._myConsoleVRObject.rotateObject(this._myConsoleVRSetup.myConsoleVRObjectRotation);

        this._setMessagesTransforms();
        this._setButtonsTransforms();
        this._setPointerTransform();

    }

    _setMessagesTransforms() {
        this._myMessagesPanel.setTranslationLocal(this._myConsoleVRSetup.myMessagesPanelPosition);
        this._myMessagesBackground.scale(this._myConsoleVRSetup.myMessagesBackgroundScale);

        this._myMessagesTextsPanel.setTranslationLocal(this._myConsoleVRSetup.myMessagesTextsPanelPosition);
        this._myMessagesTextsPanel.scale(this._myConsoleVRSetup.myMessagesTextsPanelScale);
    }

    _setButtonsTransforms() {
        this._myButtonsPanel.setTranslationLocal(this._myConsoleVRSetup.myButtonsPanelPosition);

        //Filter Buttons
        for (let key in PP.ConsoleVR.MessageType) {
            this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]].setTranslationLocal(this._myConsoleVRSetup.myFilterButtonsPositions[PP.ConsoleVR.MessageType[key]]);

            this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]].scale(this._myConsoleVRSetup.myButtonBackgroundScale);

            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].setTranslationLocal(this._myConsoleVRSetup.myButtonTextPosition);
            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].scale(this._myConsoleVRSetup.myButtonTextScale);

            this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].setTranslationLocal(this._myConsoleVRSetup.myButtonCursorTargetPosition);
        }

        //Clear
        {
            this._myClearButtonPanel.setTranslationLocal(this._myConsoleVRSetup.myClearButtonPosition);

            this._myClearButtonBackground.scale(this._myConsoleVRSetup.myButtonBackgroundScale);

            this._myClearButtonText.setTranslationLocal(this._myConsoleVRSetup.myButtonTextPosition);
            this._myClearButtonText.scale(this._myConsoleVRSetup.myButtonTextScale);

            this._myClearButtonCursorTarget.setTranslationLocal(this._myConsoleVRSetup.myButtonCursorTargetPosition);
        }

        //Up
        {
            this._myUpButtonPanel.setTranslationLocal(this._myConsoleVRSetup.myUpButtonPosition);

            this._myUpButtonBackground.scale(this._myConsoleVRSetup.myButtonBackgroundScale);

            this._myUpButtonText.setTranslationLocal(this._myConsoleVRSetup.myButtonTextPosition);
            this._myUpButtonText.scale(this._myConsoleVRSetup.myButtonTextScale);

            this._myUpButtonCursorTarget.setTranslationLocal(this._myConsoleVRSetup.myButtonCursorTargetPosition);
        }

        //Down
        {
            this._myDownButtonPanel.setTranslationLocal(this._myConsoleVRSetup.myDownButtonPosition);

            this._myDownButtonBackground.scale(this._myConsoleVRSetup.myButtonBackgroundScale);

            this._myDownButtonText.setTranslationLocal(this._myConsoleVRSetup.myButtonTextPosition);
            this._myDownButtonText.scale(this._myConsoleVRSetup.myButtonTextScale);

            this._myDownButtonCursorTarget.setTranslationLocal(this._myConsoleVRSetup.myButtonCursorTargetPosition);
        }
    }

    _setPointerTransform() {
        this._myPointerCursorTarget.setTranslationLocal(this._myConsoleVRSetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this._addMessagesComponents();
        this._addButtonsComponents();
        this._addPointerComponents();
    }

    _addMessagesComponents() {
        let messagesBackgroundMeshComp = this._myMessagesBackground.addComponent('mesh');
        messagesBackgroundMeshComp.mesh = this._myConsoleVRComponent._myPlaneMesh;
        messagesBackgroundMeshComp.material = this._myConsoleVRComponent._myPlaneMaterial.clone();
        messagesBackgroundMeshComp.material.color = this._myConsoleVRSetup.myBackgroundColor;
        messagesBackgroundMeshComp.active = true;

        this._myMessagesTextComponents = [];
        for (let key in PP.ConsoleVR.MessageType) {
            let textComp = this._myMessagesTexts[PP.ConsoleVR.MessageType[key]].addComponent('text');

            textComp.alignment = this._myConsoleVRSetup.myMessagesTextAlignment;
            textComp.justification = this._myConsoleVRSetup.myMessagesTextJustification;
            textComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            textComp.material.color = this._myConsoleVRSetup.myMessagesTextColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineColor = this._myConsoleVRSetup.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineRange = this._myConsoleVRSetup.myMessagesTextOutlineRange;
            textComp.material.text = this._myConsoleVRSetup.myMessagesTextStartString;

            this._myMessagesTextComponents[PP.ConsoleVR.MessageType[key]] = textComp;
        }
    }

    _addButtonsComponents() {
        //worship the code copy pasteness

        this._myFilterButtonsBackgroundComponents = [];
        this._myFilterButtonsTextComponents = [];
        this._myFilterButtonsCursorTargetComponents = [];
        this._myFilterButtonsCollisionComponents = [];

        //Filter Buttons
        for (let key in PP.ConsoleVR.MessageType) {
            let buttonBackgroundMeshComp = this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]].addComponent('mesh');
            buttonBackgroundMeshComp.mesh = this._myConsoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myConsoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConsoleVRSetup.myBackgroundColor;
            buttonBackgroundMeshComp.active = true;

            let buttonTextComp = this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].addComponent('text');
            buttonTextComp.alignment = this._myConsoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = this._myConsoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = this._myConsoleVRSetup.myFilterButtonsTextColors[PP.ConsoleVR.MessageType[key]];
            buttonTextComp.material.outlineColor = this._myConsoleVRSetup.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType[key]];
            buttonTextComp.material.outlineRange = this._myConsoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = this._myConsoleVRSetup.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType[key]];

            //let buttonCursorTargetComp = this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].addComponent('cursor-target');

            let buttonCollisionComp = this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].addComponent('collision');
            buttonCollisionComp.collider = this._myConsoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = this._myConsoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConsoleVRSetup.myButtonsCollisionExtents;

            this._myFilterButtonsBackgroundComponents[PP.ConsoleVR.MessageType[key]] = buttonBackgroundMeshComp;
            this._myFilterButtonsTextComponents[PP.ConsoleVR.MessageType[key]] = buttonTextComp;
            //this._myFilterButtonsCursorTargetComponents[PP.ConsoleVR.MessageType[key]] = buttonCursorTargetComp;
            this._myFilterButtonsCollisionComponents[PP.ConsoleVR.MessageType[key]] = buttonCollisionComp;
        }

        //Clear 
        {
            let buttonBackgroundMeshComp = this._myClearButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = this._myConsoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myConsoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConsoleVRSetup.myBackgroundColor;
            buttonBackgroundMeshComp.active = true;

            let buttonTextComp = this._myClearButtonText.addComponent('text');
            buttonTextComp.alignment = this._myConsoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = this._myConsoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = this._myConsoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = this._myConsoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = this._myConsoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = this._myConsoleVRSetup.myClearButtonTextLabel;

            //let buttonCursorTargetComp = this._myClearButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myClearButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = this._myConsoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = this._myConsoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConsoleVRSetup.myButtonsCollisionExtents;

            this._myClearButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myClearButtonTextComponent = buttonTextComp;
            //this._myClearButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myClearButtonCollisionComponent = buttonCollisionComp;
        }

        //Up 
        {
            let buttonBackgroundMeshComp = this._myUpButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = this._myConsoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myConsoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConsoleVRSetup.myBackgroundColor;
            buttonBackgroundMeshComp.active = true;

            let buttonTextComp = this._myUpButtonText.addComponent('text');
            buttonTextComp.alignment = this._myConsoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = this._myConsoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = this._myConsoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = this._myConsoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = this._myConsoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = ""; //to fix a weird and mysterious bug where up was not added to the text
            buttonTextComp.text = this._myConsoleVRSetup.myUpButtonTextLabel;

            //let buttonCursorTargetComp = this._myUpButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myUpButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = this._myConsoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = this._myConsoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConsoleVRSetup.myButtonsCollisionExtents;

            this._myUpButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myUpButtonTextComponent = buttonTextComp;
            //this._myUpButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myUpButtonCollisionComponent = buttonCollisionComp;
        }

        //Down 
        {
            let buttonBackgroundMeshComp = this._myDownButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = this._myConsoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = this._myConsoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = this._myConsoleVRSetup.myBackgroundColor;
            buttonBackgroundMeshComp.active = true;

            let buttonTextComp = this._myDownButtonText.addComponent('text');
            buttonTextComp.alignment = this._myConsoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = this._myConsoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = this._myConsoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = this._myConsoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = this._myConsoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = this._myConsoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = this._myConsoleVRSetup.myDownButtonTextLabel;

            //let buttonCursorTargetComp = this._myDownButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myDownButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = this._myConsoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = this._myConsoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = this._myConsoleVRSetup.myButtonsCollisionExtents;

            this._myDownButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myDownButtonTextComponent = buttonTextComp;
            //this._myDownButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myDownButtonCollisionComponent = buttonCollisionComp;
        }
    }

    _addPointerComponents() {
        //let cursorTargetComp = this._myPointerCursorTarget.addComponent('cursor-target');

        let collisionComp = this._myPointerCursorTarget.addComponent('collision');
        collisionComp.collider = this._myConsoleVRSetup.myPointerCollisionCollider;
        collisionComp.group = this._myConsoleVRSetup.myPointerCollisionGroup;
        collisionComp.extents = this._myConsoleVRSetup.myPointerCollisionExtents;

        //this._myPointerCursorTargetComponent = cursorTargetComp;
        this._myPointerCollisionComponent = collisionComp;
    }

};