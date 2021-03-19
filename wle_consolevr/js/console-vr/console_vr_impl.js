/* Doesn't support
    - Placeholder like %d and other similar kind of way to build strings
    - Object to string will result in [Object object]
*/

PP.ConsoleVR = class ConsoleVR {

    constructor(consoleVRComponent) {
        this._myConsoleVRComponent = consoleVRComponent;

        this._myTextComponents = [];

        this._myMessages = [];

        this.myIsActive = true;

        this._myOldConsole = [];

        this._myTypeFilters = [];
        for (let key in PP.ConsoleVR.MessageType) {
            this._myTypeFilters[PP.ConsoleVR.MessageType[key]] = false;
        }

        this._myOnClickAlreadyTriggeredThisFrame = false; //fix an issue in cursor-target that calls onclick twice

        //Constants
        this._myMessageTypeColors = [];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.LOG] = [1, 1, 1, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR] = [1, 0, 0, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.WARN] = [1, 1, 0, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.INFO] = [0, 0, 1, 1];

        this._myMaxCharactersPerLine = 110;
        this._myMaxLines = 23;
        this._myMaxMessages = 100;
        this._myMaxMessagesDeletePad = 20; // to prevent deleting at every message, delay the delete after the limit is exceed by this value

        this._myButtonNormalColor = [46 / 255, 46 / 255, 46 / 255, 1];
        this._myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];

        this._myFilterButtonDisabledTextColor = [100 / 255, 100 / 255, 100 / 255, 1];
    }

    start() {
        this._myOldConsole[PP.ConsoleVR.MessageType.ERROR] = console.error;
        console.error = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.ERROR);

        this._myOldConsole[PP.ConsoleVR.MessageType.LOG] = console.log;
        console.log = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.LOG);

        this._myOldConsole[PP.ConsoleVR.MessageType.WARN] = console.warn;
        console.warn = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.WARN);

        this._myOldConsole[PP.ConsoleVR.MessageType.INFO] = console.info;
        console.info = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.INFO);

        this._myTextComponents = [];
        this._myTextComponents[PP.ConsoleVR.MessageType.LOG] = this._myConsoleVRComponent._myLog.getComponent("text");
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR] = this._myConsoleVRComponent._myError.getComponent("text");
        this._myTextComponents[PP.ConsoleVR.MessageType.WARN] = this._myConsoleVRComponent._myWarn.getComponent("text");
        this._myTextComponents[PP.ConsoleVR.MessageType.INFO] = this._myConsoleVRComponent._myInfo.getComponent("text");

        this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material = this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material.color = this._myMessageTypeColors[PP.ConsoleVR.MessageType.LOG];
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material = this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material.color = this._myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR];
        this._myTextComponents[PP.ConsoleVR.MessageType.WARN].material = this._myTextComponents[PP.ConsoleVR.MessageType.WARN].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.WARN].material.color = this._myMessageTypeColors[PP.ConsoleVR.MessageType.WARN];
        this._myTextComponents[PP.ConsoleVR.MessageType.INFO].material = this._myTextComponents[PP.ConsoleVR.MessageType.INFO].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.INFO].material.color = this._myMessageTypeColors[PP.ConsoleVR.MessageType.INFO];

        this._initializeButtons();
    }

    update(dt) {
        this._myOnClickAlreadyTriggeredThisFrame = false;
    }

    _updateText(messageType) {
        let consoleText = "";

        if (!this._myTypeFilters[messageType]) {
            let linesCount = 0;
            let i = this._myMessages.length - 1;

            while (i >= 0 && linesCount < this._myMaxLines) {
                let message = this._myMessages[i];

                if (this._myTypeFilters[message.myType]) {
                    i -= 1;
                    continue;
                }

                let messageLines = message.myLines.length;

                if (i != this._myMessages.length - 1) {
                    linesCount += 1;
                    consoleText = ("\n").concat(consoleText);
                }

                if (message.myType == messageType) {
                    if (linesCount + messageLines <= this._myMaxLines) {
                        consoleText = (message.myText.concat("\n")).concat(consoleText);
                        linesCount += messageLines;
                    } else {
                        let linesToShow = this._myMaxLines - linesCount;
                        if (linesToShow > 0) {
                            let lastLines = message.myLines.slice(messageLines - linesToShow);

                            let text = lastLines.join("\n");
                            consoleText = (text.concat("\n")).concat(consoleText);

                            linesCount += linesToShow;
                        }
                    }
                } else {
                    if (linesCount + messageLines <= this._myMaxLines) {
                        for (let j = 0; j < messageLines; j++) {
                            consoleText = ("\n").concat(consoleText);
                        }
                        linesCount += messageLines;
                    } else {
                        let linesToShow = this._myMaxLines - linesCount;

                        for (let j = 0; j < linesToShow; j++) {
                            consoleText = ("\n").concat(consoleText);
                        }

                        linesCount += linesToShow;
                    }
                }

                i -= 1;
            }
        }

        consoleText = (".\n").concat(consoleText);

        this._myTextComponents[messageType].text = consoleText;
    }

    _consolePrint(messageType, ...args) {
        let message = this._argsToMessage(messageType, ...args);
        this._addMessage(message);

        if (this._myMessages.length >= this._myMaxMessages + this._myMaxMessagesDeletePad) {
            this._myMessages = this._myMessages.slice(this._myMessages.length - this._myMaxMessages);
        }

        this._updateAllTexts();

        this._myOldConsole[messageType].apply(console, args);
    }

    _argsToMessage(messageType, ...args) {
        let formattedString = this._formatArgs(...args);

        let lines = formattedString.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.length > this._myMaxCharactersPerLine) {
                let firstSub = line.substr(0, this._myMaxCharactersPerLine - 1);
                let secondSub = line.substr(this._myMaxCharactersPerLine - 1);
                secondSub = "\t".concat(secondSub);

                lines[i] = firstSub;
                lines.splice(i + 1, 0, secondSub);
            }
        }

        let message = new PP.ConsoleVR.Message(messageType, lines);

        return message;
    }

    //Here the formatting using placeholder like %d could be implemented in the future
    _formatArgs(...args) {
        let formattedString = args.join(" ");

        return formattedString;
    }

    _addMessage(message) {
        if (this._myMessages.length > 0) {
            let lastMessage = this._myMessages[this._myMessages.length - 1];
            if (lastMessage.hasSameInfo(message)) {
                lastMessage.increaseCount();
            } else {
                this._myMessages.push(message);
            }
        } else {
            this._myMessages.push(message);
        }
    }

    _updateAllTexts() {
        if (this.myIsActive) {
            for (let key in PP.ConsoleVR.MessageType) {
                this._updateText(PP.ConsoleVR.MessageType[key]);
            }
        }
    }

    _initializeButtons() {
        this._myFilterTextMaterials = [];

        {
            let tempMaterial = this._myConsoleVRComponent._myFilterLogButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myFilterLogButton.children[0].getComponent("mesh").material = tempMaterial;
            this._myFilterTextMaterials[PP.ConsoleVR.MessageType.LOG] = this._myConsoleVRComponent._myFilterLogButton.children[1].getComponent("text").material.clone();
            this._myConsoleVRComponent._myFilterLogButton.children[1].getComponent("text").material = this._myFilterTextMaterials[PP.ConsoleVR.MessageType.LOG];

            let cursorTarget = this._myConsoleVRComponent._myFilterLogButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._toggleFilter.bind(this, PP.ConsoleVR.MessageType.LOG));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, tempMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, tempMaterial));
        }

        {
            let tempMaterial = this._myConsoleVRComponent._myFilterErrorButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myFilterErrorButton.children[0].getComponent("mesh").material = tempMaterial;
            this._myFilterTextMaterials[PP.ConsoleVR.MessageType.ERROR] = this._myConsoleVRComponent._myFilterErrorButton.children[1].getComponent("text").material.clone();
            this._myConsoleVRComponent._myFilterErrorButton.children[1].getComponent("text").material = this._myFilterTextMaterials[PP.ConsoleVR.MessageType.ERROR];

            let cursorTarget = this._myConsoleVRComponent._myFilterErrorButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._toggleFilter.bind(this, PP.ConsoleVR.MessageType.ERROR));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, tempMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, tempMaterial));
        }

        {
            let tempMaterial = this._myConsoleVRComponent._myFilterWarnButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myFilterWarnButton.children[0].getComponent("mesh").material = tempMaterial;
            this._myFilterTextMaterials[PP.ConsoleVR.MessageType.WARN] = this._myConsoleVRComponent._myFilterWarnButton.children[1].getComponent("text").material.clone();
            this._myConsoleVRComponent._myFilterWarnButton.children[1].getComponent("text").material = this._myFilterTextMaterials[PP.ConsoleVR.MessageType.WARN];

            let cursorTarget = this._myConsoleVRComponent._myFilterWarnButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._toggleFilter.bind(this, PP.ConsoleVR.MessageType.WARN));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, tempMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, tempMaterial));
        }

        {
            let tempMaterial = this._myConsoleVRComponent._myFilterInfoButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myFilterInfoButton.children[0].getComponent("mesh").material = tempMaterial;
            this._myFilterTextMaterials[PP.ConsoleVR.MessageType.INFO] = this._myConsoleVRComponent._myFilterInfoButton.children[1].getComponent("text").material.clone();
            this._myConsoleVRComponent._myFilterInfoButton.children[1].getComponent("text").material = this._myFilterTextMaterials[PP.ConsoleVR.MessageType.INFO];

            let cursorTarget = this._myConsoleVRComponent._myFilterInfoButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._toggleFilter.bind(this, PP.ConsoleVR.MessageType.INFO));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, tempMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, tempMaterial));
        }


        {
            let tempMaterial = this._myConsoleVRComponent._myClearButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myClearButton.children[0].getComponent("mesh").material = tempMaterial;

            let cursorTarget = this._myConsoleVRComponent._myClearButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._clearConsole.bind(this));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, tempMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, tempMaterial));
        }

    }

    _toggleFilter(messageType) {
        if (this._myOnClickAlreadyTriggeredThisFrame) {
            return;
        }

        this._myTypeFilters[messageType] = !this._myTypeFilters[messageType];
        if (this._myTypeFilters[messageType]) {
            this._myFilterTextMaterials[messageType].color = this._myFilterButtonDisabledTextColor;
        } else {
            this._myFilterTextMaterials[messageType].color = this._myMessageTypeColors[messageType];
        }

        this._updateAllTexts();

        this._myOnClickAlreadyTriggeredThisFrame = true;
    }

    _clearConsole() {
        if (this._myOnClickAlreadyTriggeredThisFrame) {
            return;
        }

        this._myMessages = [];
        this._updateAllTexts();

        console.clear();

        this._myOnClickAlreadyTriggeredThisFrame = true;
    }

    _genericHover(material) {
        material.color = this._myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._myButtonNormalColor;
    }
};

PP.ConsoleVR.MessageType = {
    LOG: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3
};

PP.ConsoleVR.Message = class Message {
    constructor(messageType, messageLines) {
        this.myType = messageType;

        this._myOriginalText = messageLines.join("\n");
        this._myOriginalLines = messageLines;
        this._myMessagesCount = 1;

        this.myText = this._myOriginalText.slice(0);
        this.myLines = this._myOriginalLines.slice(0);
    }

    hasSameInfo(message) {
        return this._myOriginalText == message._myOriginalText && this.myType == message.myType;
    }

    increaseCount() {
        this._myMessagesCount += 1;

        let countString = (("(x").concat(this._myMessagesCount)).concat(") ");

        this.myText = this._myOriginalText.slice(0);
        this.myText = countString.concat(this.myText);
        this.myLines = this.myText.split("\n");
    }
};