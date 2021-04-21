
PP.WidgetFrame = class WidgetFrame {

    constructor(widgetLetterID, buttonsColumnIndex) {
        this.myIsWidgetVisible = true;
        this.myIsPinned = false;

        this._mySetup = new PP.WidgetFrameSetup(widgetLetterID, buttonsColumnIndex);
        this._myAdditionalSetup = null;

        this._myUI = new PP.WidgetFrameUI();

        this._myWidgetVisibleChangedCallbacks = new Map();
        this._myPinnedChangedCallbacks = new Map();
    }

    getWidgetObject() {
        return this._myUI.myWidgetObject;
    }

    toggleVisibility() {
        this._toggleVisibility(false);
    }

    togglePin() {
        this._togglePin(false);
    }

    registerWidgetVisibleChangedEventListener(id, callback) {
        this._myWidgetVisibleChangedCallbacks.set(id, callback);
    }

    unregisterWidgetVisibleChangedEventListener(id) {
        this._myWidgetVisibleChangedCallbacks.delete(id);
    }

    registerPinnedChangedEventListener(id, callback) {
        this._myPinnedChangedCallbacks.set(id, callback);
    }

    unregisterPinnedChangedEventListener(id) {
        this._myPinnedChangedCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._myUI.setVisibilityButtonVisible(additionalSetup.myShowVisibilityButton);
        if (!additionalSetup.myShowOnStart) {
            this._toggleVisibility(false);
        }

        this._addListeners();
    }

    update(dt) {
        this._myUI.update(dt);
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myPinButtonCursorTargetComponent.addClickFunction(this._togglePin.bind(this, true));
        ui.myPinButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPinButtonBackgroundComponent.material));
        ui.myPinButtonCursorTargetComponent.addUnHoverFunction(this._pinUnHover.bind(this, ui.myPinButtonBackgroundComponent.material));

        if (this._myAdditionalSetup.myShowVisibilityButton) {
            ui.myVisibilityButtonCursorTargetComponent.addClickFunction(this._toggleVisibility.bind(this, true));
            ui.myVisibilityButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
            ui.myVisibilityButtonCursorTargetComponent.addUnHoverFunction(this._visibilityUnHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
        }
    }

    _toggleVisibility(isButton) {
        this.myIsWidgetVisible = !this.myIsWidgetVisible;

        this._myUI.setWidgetVisible(this.myIsWidgetVisible);

        let textMaterial = this._myUI.myVisibilityButtonTextComponent.material;
        let backgroundMaterial = this._myUI.myVisibilityButtonBackgroundComponent.material;
        if (this.myIsWidgetVisible) {
            textMaterial.color = this._mySetup.myDefaultTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myBackgroundColor;
            }
        } else {
            textMaterial.color = this._mySetup.myButtonDisabledTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
            }
        }

        for (let value of this._myWidgetVisibleChangedCallbacks.values()) {
            value(this.myIsWidgetVisible);
        }
    }

    _togglePin(isButton) {
        if (this.myIsWidgetVisible) {
            this.myIsPinned = !this.myIsPinned;

            this._myUI.setPinned(this.myIsPinned);

            let textMaterial = this._myUI.myPinButtonTextComponent.material;
            let backgroundMaterial = this._myUI.myPinButtonBackgroundComponent.material;
            if (this.myIsPinned) {
                textMaterial.color = this._mySetup.myDefaultTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myBackgroundColor;
                }
            } else {
                textMaterial.color = this._mySetup.myButtonDisabledTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
                }
            }

            for (let value of this._myPinnedChangedCallbacks.values()) {
                value(this.myIsPinned);
            }
        }
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _visibilityUnHover(material) {
        if (this.myIsWidgetVisible) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }

    _pinUnHover(material) {
        if (this.myIsPinned) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }
};