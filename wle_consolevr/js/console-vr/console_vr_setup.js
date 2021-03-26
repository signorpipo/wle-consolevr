PP.ConsoleVRSetup = class ConsoleVRSetup {

    constructor() {
        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        //General
        this.myConsoleVRObjectPosition = [-0.145, -0.035, -0.2];
        this.myConsoleVRObjectRotation = [-0.645, 0.425, 0.25, 0.584];

        this.myDefaultTextColor = [1, 1, 1, 1];

        this.myMessageTypeColors = [];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG] = this.myDefaultTextColor;
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR] = [1, 0, 0, 1];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN] = [1, 1, 0, 1];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO] = [0, 0, 1, 1];

        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 1 << 7;
        this.myCursorTargetCollisionThickness = 0.001;


        //Messages
        this.myMessagesPanelPosition = [0, 0.075, 0];

        this.myMessagesBackgroundScale = [0.34, 0.15, 1];

        {
            let xPaddingPercentage = 0.03;
            let yPaddingPercentage = xPaddingPercentage * this.myMessagesBackgroundScale[0] / this.myMessagesBackgroundScale[1] * 0.8; //a bit less padding
            let xPosition = -this.myMessagesBackgroundScale[0] + this.myMessagesBackgroundScale[0] * xPaddingPercentage;
            let yPosition = this.myMessagesBackgroundScale[1] - this.myMessagesBackgroundScale[1] * yPaddingPercentage;
            this.myMessagesTextsPanelPosition = [xPosition, yPosition, 0.01];
        }
        this.myMessagesTextsPanelScale = [0.1, 0.1, 0.1];

        this.myMessagesTextStartString = ".\n"; // to avoid issue with text component padding
        this.myMessagesTextAlignment = 1; // left
        this.myMessagesTextJustification = 3; // top
        this.myMessagesTextOutlineRange = [0.45, 0.45];

        this.myMessagesTextColors = [];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.INFO] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO];

        this.myMessagesTextOutlineColors = [];
        this.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG];
        this.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR];
        this.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN];
        this.myMessagesTextOutlineColors[PP.ConsoleVR.MessageType.INFO] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO];

        //Buttons     
        this.myButtonsPanelPosition = [0, -0.11, 0.015];

        this.myButtonBackgroundScale = [0.04, 0.02, 1];

        this.myButtonTextPosition = [0, 0, 0.0065];
        this.myButtonTextScale = [0.18, 0.18, 0.18];
        this.myButtonTextAlignment = 2; // center
        this.myButtonTextJustification = 2; // middle
        this.myButtonTextOutlineRange = [0.45, 0.45];
        this.myButtonTextColor = this.myDefaultTextColor;
        this.myButtonTextOutlineColor = this.myDefaultTextColor;

        this.myButtonCursorTargetPosition = [0, 0, 0];
        this.myButtonCursorTargetPosition[2] = this.myButtonTextPosition[2];

        this.myButtonsCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myButtonsCollisionGroup = this.myCursorTargetCollisionGroup;
        this.myButtonsCollisionExtents = this.myButtonBackgroundScale;
        this.myButtonsCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myClearButtonTextLabel = "clear";
        this.myUpButtonTextLabel = "up";
        this.myDownButtonTextLabel = "down";

        this.myFilterButtonsTextColors = [];
        this.myFilterButtonsTextColors[PP.ConsoleVR.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG];
        this.myFilterButtonsTextColors[PP.ConsoleVR.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR];
        this.myFilterButtonsTextColors[PP.ConsoleVR.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN];
        this.myFilterButtonsTextColors[PP.ConsoleVR.MessageType.INFO] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO];

        this.myFilterButtonsTextOutlineColors = [];
        this.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG];
        this.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR];
        this.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN];
        this.myFilterButtonsTextOutlineColors[PP.ConsoleVR.MessageType.INFO] = this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO];

        this.myFilterButtonsTextLabel = [];
        this.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType.LOG] = "log";
        this.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType.ERROR] = "error";
        this.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType.WARN] = "warn";
        this.myFilterButtonsTextLabel[PP.ConsoleVR.MessageType.INFO] = "info";

        //Buttons positioning
        {
            let numberOfButtons = 7;
            let buttonsHorizontalSpace = Math.max(0.68, this.myButtonBackgroundScale[0] * numberOfButtons);
            //2 at start, 3 between filters, 4 spaces between filter and clear and 4 spaces between clear and up/down, 1 space between up and down, 1 at end
            let numberOfSpacesBetweenButtons = 2 + 3 + 4 + 4 + 1 + 2;
            let spaceWidth = Math.max((buttonsHorizontalSpace - numberOfButtons * this.myButtonBackgroundScale[0] * 2) / numberOfSpacesBetweenButtons, 0);
            let halfButtonWidth = this.myButtonBackgroundScale[0];
            let initialPosition = - buttonsHorizontalSpace / 2;

            this.myFilterButtonsPositions = [];
            this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.LOG] = [initialPosition + spaceWidth * 2 + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.ERROR] = [this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.LOG][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.WARN] = [this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.ERROR][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.INFO] = [this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.WARN][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];

            this.myClearButtonPosition = [this.myFilterButtonsPositions[PP.ConsoleVR.MessageType.INFO][0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myUpButtonPosition = [this.myClearButtonPosition[0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myDownButtonPosition = [this.myUpButtonPosition[0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
        }

        //Pointer
        this.myPointerCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myPointerCollisionGroup = this.myCursorTargetCollisionGroup;

        {
            let spaceBetweenMessagesAndButtons = Math.abs((this.myMessagesPanelPosition[1] - this.myMessagesBackgroundScale[1]) - (this.myButtonsPanelPosition[1] + this.myButtonBackgroundScale[1]));
            let pointerCollisionHalfHeight = this.myMessagesBackgroundScale[1] + this.myButtonBackgroundScale[1] + spaceBetweenMessagesAndButtons / 2;
            this.myPointerCollisionExtents = [this.myMessagesBackgroundScale[0], pointerCollisionHalfHeight, this.myCursorTargetCollisionThickness];
        }

        this.myPointerCursorTargetPosition = [0, 0, 0];
        this.myPointerCursorTargetPosition[1] = (this.myMessagesPanelPosition[1] + this.myMessagesBackgroundScale[1]) - this.myPointerCollisionExtents[1];
        this.myPointerCursorTargetPosition[2] = this.myButtonsPanelPosition[2] + this.myButtonTextPosition[2] - 0.0001; // a little behind the button target to avoid hiding it
    }

    _initializeRuntimeSetup() {
        this.myStartVisible = true;

        this.myMessageTypeColors = [];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.LOG] = [1, 1, 1, 1];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR] = [1, 0, 0, 1];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.WARN] = [1, 1, 0, 1];
        this.myMessageTypeColors[PP.ConsoleVR.MessageType.INFO] = [0, 0, 1, 1];

        this.myTabString = "    ";

        this.myMaxCharactersPerLine = 100;
        this.myMaxLineSplits = 10; //prevent infinite splitting
        this.myMaxLines = 23;
        this.myMaxMessages = 100;
        this.myMaxMessagesDeletePad = 20; // to prevent deleting at every message, delay the delete after the limit is exceed by this value

        this.myLinesBetweenMessages = 1;

        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];

        this.myFilterButtonDisabledTextColor = this.myBackgroundColor;
        this.myFilterButtonDisabledBackgroundColor = [110 / 255, 110 / 255, 110 / 255, 1];

        this.myScrollDelay = 0.1;

        this.myPulseDelay = 5;
        this.myPulseWhenVisible = true;
        this.myPulseIntensity = 0.35;
        this.myPulseDuration = 0.1;
    }
};