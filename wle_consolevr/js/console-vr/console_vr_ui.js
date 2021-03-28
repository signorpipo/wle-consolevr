PP.ConsoleVR_UI = class ConsoleVR_UI {

    build(consoleVRComponent, consoleVRSetup) {
        this._createSkeleton(consoleVRComponent);
        this._setTransforms(consoleVRComponent, consoleVRSetup);
        this._addComponents(consoleVRComponent, consoleVRSetup);
    }

    //Skeleton
    _createSkeleton(consoleVRComponent) {
        this._myConsoleVRObject = WL.scene.addObject(consoleVRComponent.object);
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
    _setTransforms(consoleVRComponent, consoleVRSetup) {
        this._myConsoleVRObject.setTranslationLocal(consoleVRSetup.myConsoleVRObjectTransforms[consoleVRComponent._myHandedness].myPosition);
        this._myConsoleVRObject.rotateObject(consoleVRSetup.myConsoleVRObjectTransforms[consoleVRComponent._myHandedness].myRotation);

        this._setMessagesTransforms(consoleVRComponent, consoleVRSetup);
        this._setButtonsTransforms(consoleVRComponent, consoleVRSetup);
        this._setPointerTransform(consoleVRComponent, consoleVRSetup);
    }

    _setMessagesTransforms(consoleVRComponent, consoleVRSetup) {
        this._myMessagesPanel.setTranslationLocal(consoleVRSetup.myMessagesPanelPosition);
        this._myMessagesBackground.scale(consoleVRSetup.myMessagesBackgroundScale);

        this._myMessagesTextsPanel.setTranslationLocal(consoleVRSetup.myMessagesTextsPanelPosition);
        this._myMessagesTextsPanel.scale(consoleVRSetup.myMessagesTextsPanelScale);
    }

    _setButtonsTransforms(consoleVRComponent, consoleVRSetup) {
        this._myButtonsPanel.setTranslationLocal(consoleVRSetup.myButtonsPanelPosition);

        //Filter Buttons
        for (let key in PP.ConsoleVR.MessageType) {
            this._myFilterButtonsPanels[PP.ConsoleVR.MessageType[key]].setTranslationLocal(consoleVRSetup.myFilterButtonsPositions[PP.ConsoleVR.MessageType[key]]);

            this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]].scale(consoleVRSetup.myButtonBackgroundScale);

            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].setTranslationLocal(consoleVRSetup.myButtonTextPosition);
            this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].scale(consoleVRSetup.myButtonTextScale);

            this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].setTranslationLocal(consoleVRSetup.myButtonCursorTargetPosition);
        }

        //Clear
        {
            this._myClearButtonPanel.setTranslationLocal(consoleVRSetup.myClearButtonPosition);

            this._myClearButtonBackground.scale(consoleVRSetup.myButtonBackgroundScale);

            this._myClearButtonText.setTranslationLocal(consoleVRSetup.myButtonTextPosition);
            this._myClearButtonText.scale(consoleVRSetup.myButtonTextScale);

            this._myClearButtonCursorTarget.setTranslationLocal(consoleVRSetup.myButtonCursorTargetPosition);
        }

        //Up
        {
            this._myUpButtonPanel.setTranslationLocal(consoleVRSetup.myUpButtonPosition);

            this._myUpButtonBackground.scale(consoleVRSetup.myButtonBackgroundScale);

            this._myUpButtonText.setTranslationLocal(consoleVRSetup.myButtonTextPosition);
            this._myUpButtonText.scale(consoleVRSetup.myButtonTextScale);

            this._myUpButtonCursorTarget.setTranslationLocal(consoleVRSetup.myButtonCursorTargetPosition);
        }

        //Down
        {
            this._myDownButtonPanel.setTranslationLocal(consoleVRSetup.myDownButtonPosition);

            this._myDownButtonBackground.scale(consoleVRSetup.myButtonBackgroundScale);

            this._myDownButtonText.setTranslationLocal(consoleVRSetup.myButtonTextPosition);
            this._myDownButtonText.scale(consoleVRSetup.myButtonTextScale);

            this._myDownButtonCursorTarget.setTranslationLocal(consoleVRSetup.myButtonCursorTargetPosition);
        }
    }

    _setPointerTransform(consoleVRComponent, consoleVRSetup) {
        this._myPointerCursorTarget.setTranslationLocal(consoleVRSetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents(consoleVRComponent, consoleVRSetup) {
        this._addMessagesComponents(consoleVRComponent, consoleVRSetup);
        this._addButtonsComponents(consoleVRComponent, consoleVRSetup);
        this._addPointerComponents(consoleVRComponent, consoleVRSetup);
    }

    _addMessagesComponents(consoleVRComponent, consoleVRSetup) {
        let messagesBackgroundMeshComp = this._myMessagesBackground.addComponent('mesh');
        messagesBackgroundMeshComp.mesh = consoleVRComponent._myPlaneMesh;
        messagesBackgroundMeshComp.material = consoleVRComponent._myPlaneMaterial.clone();
        messagesBackgroundMeshComp.material.color = consoleVRSetup.myBackgroundColor;

        this._myMessagesTextComponents = [];
        for (let key in PP.ConsoleVR.MessageType) {
            let textComp = this._myMessagesTexts[PP.ConsoleVR.MessageType[key]].addComponent('text');

            textComp.alignment = consoleVRSetup.myMessagesTextAlignment;
            textComp.justification = consoleVRSetup.myMessagesTextJustification;
            textComp.material = consoleVRComponent._myTextMaterial.clone();
            textComp.material.color = consoleVRSetup.myMessagesTextColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineColor = consoleVRSetup.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType[key]];
            textComp.material.outlineRange = consoleVRSetup.myMessagesTextOutlineRange;
            textComp.material.text = consoleVRSetup.myMessagesTextStartString;

            this._myMessagesTextComponents[PP.ConsoleVR.MessageType[key]] = textComp;
        }
    }

    _addButtonsComponents(consoleVRComponent, consoleVRSetup) {
        //worship the code copy pasteness

        this._myFilterButtonsBackgroundComponents = [];
        this._myFilterButtonsTextComponents = [];
        this._myFilterButtonsCursorTargetComponents = [];
        this._myFilterButtonsCollisionComponents = [];

        //Filter Buttons
        for (let key in PP.ConsoleVR.MessageType) {
            let buttonBackgroundMeshComp = this._myFilterButtonsBackgrounds[PP.ConsoleVR.MessageType[key]].addComponent('mesh');
            buttonBackgroundMeshComp.mesh = consoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = consoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = consoleVRSetup.myBackgroundColor;

            let buttonTextComp = this._myFilterButtonsTexts[PP.ConsoleVR.MessageType[key]].addComponent('text');
            buttonTextComp.alignment = consoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = consoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = consoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = consoleVRSetup.myFilterButtonsTextColors[PP.ConsoleVR.MessageType[key]];
            buttonTextComp.material.outlineColor = consoleVRSetup.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType[key]];
            buttonTextComp.material.outlineRange = consoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = consoleVRSetup.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType[key]];

            let buttonCursorTargetComp = this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].addComponent('cursor-target');

            let buttonCollisionComp = this._myFilterButtonsCursorTargets[PP.ConsoleVR.MessageType[key]].addComponent('collision');
            buttonCollisionComp.collider = consoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << consoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = consoleVRSetup.myButtonsCollisionExtents;

            this._myFilterButtonsBackgroundComponents[PP.ConsoleVR.MessageType[key]] = buttonBackgroundMeshComp;
            this._myFilterButtonsTextComponents[PP.ConsoleVR.MessageType[key]] = buttonTextComp;
            this._myFilterButtonsCursorTargetComponents[PP.ConsoleVR.MessageType[key]] = buttonCursorTargetComp;
            this._myFilterButtonsCollisionComponents[PP.ConsoleVR.MessageType[key]] = buttonCollisionComp;
        }

        //Clear 
        {
            let buttonBackgroundMeshComp = this._myClearButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = consoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = consoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = consoleVRSetup.myBackgroundColor;

            let buttonTextComp = this._myClearButtonText.addComponent('text');
            buttonTextComp.alignment = consoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = consoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = consoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = consoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = consoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = consoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = consoleVRSetup.myClearButtonTextLabel;

            let buttonCursorTargetComp = this._myClearButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myClearButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = consoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << consoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = consoleVRSetup.myButtonsCollisionExtents;

            this._myClearButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myClearButtonTextComponent = buttonTextComp;
            this._myClearButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myClearButtonCollisionComponent = buttonCollisionComp;
        }

        //Up 
        {
            let buttonBackgroundMeshComp = this._myUpButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = consoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = consoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = consoleVRSetup.myBackgroundColor;

            let buttonTextComp = this._myUpButtonText.addComponent('text');
            buttonTextComp.alignment = consoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = consoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = consoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = consoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = consoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = consoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = ""; //to fix a weird and mysterious bug where up was not added to the text
            buttonTextComp.text = consoleVRSetup.myUpButtonTextLabel;

            let buttonCursorTargetComp = this._myUpButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myUpButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = consoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << consoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = consoleVRSetup.myButtonsCollisionExtents;

            this._myUpButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myUpButtonTextComponent = buttonTextComp;
            this._myUpButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myUpButtonCollisionComponent = buttonCollisionComp;
        }

        //Down 
        {
            let buttonBackgroundMeshComp = this._myDownButtonBackground.addComponent('mesh');
            buttonBackgroundMeshComp.mesh = consoleVRComponent._myPlaneMesh;
            buttonBackgroundMeshComp.material = consoleVRComponent._myPlaneMaterial.clone();
            buttonBackgroundMeshComp.material.color = consoleVRSetup.myBackgroundColor;

            let buttonTextComp = this._myDownButtonText.addComponent('text');
            buttonTextComp.alignment = consoleVRSetup.myButtonTextAlignment;
            buttonTextComp.justification = consoleVRSetup.myButtonTextJustification;
            buttonTextComp.material = consoleVRComponent._myTextMaterial.clone();
            buttonTextComp.material.color = consoleVRSetup.myButtonTextColor;
            buttonTextComp.material.outlineColor = consoleVRSetup.myButtonTextOutlineColor;
            buttonTextComp.material.outlineRange = consoleVRSetup.myButtonTextOutlineRange;
            buttonTextComp.text = consoleVRSetup.myDownButtonTextLabel;

            let buttonCursorTargetComp = this._myDownButtonCursorTarget.addComponent('cursor-target');

            let buttonCollisionComp = this._myDownButtonCursorTarget.addComponent('collision');
            buttonCollisionComp.collider = consoleVRSetup.myButtonsCollisionCollider;
            buttonCollisionComp.group = 1 << consoleVRSetup.myButtonsCollisionGroup;
            buttonCollisionComp.extents = consoleVRSetup.myButtonsCollisionExtents;

            this._myDownButtonBackgroundComponent = buttonBackgroundMeshComp;
            this._myDownButtonTextComponent = buttonTextComp;
            this._myDownButtonCursorTargetComponent = buttonCursorTargetComp;
            this._myDownButtonCollisionComponent = buttonCollisionComp;
        }
    }

    _addPointerComponents(consoleVRComponent, consoleVRSetup) {
        let cursorTargetComp = this._myPointerCursorTarget.addComponent('cursor-target');

        let collisionComp = this._myPointerCursorTarget.addComponent('collision');
        collisionComp.collider = consoleVRSetup.myPointerCollisionCollider;
        collisionComp.group = 1 << consoleVRSetup.myPointerCollisionGroup;
        collisionComp.extents = consoleVRSetup.myPointerCollisionExtents;

        this._myPointerCursorTargetComponent = cursorTargetComp;
        this._myPointerCollisionComponent = collisionComp;
    }
};