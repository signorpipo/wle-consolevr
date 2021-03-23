PP.ConsoleVRSetup = class ConsoleVRSetup {

    constructor() {
        this.myConsoleVRObjectPosition = [-0.145, -0.035, -0.2];
        this.myConsoleVRObjectRotation = [-0.645, 0.425, 0.25, 0.584];

        this.myMessagesPanelPosition = [0, 0.075, 0];

        this.myMessagesBackgroundScale = [0.34, 0.15, 0.15];

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
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.LOG] = [1, 1, 1, 1];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.ERROR] = [1, 0, 0, 1];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.WARN] = [1, 1, 0, 1];
        this.myMessagesTextColors[PP.ConsoleVR.MessageType.INFO] = [0, 0, 1, 1];

    }
};