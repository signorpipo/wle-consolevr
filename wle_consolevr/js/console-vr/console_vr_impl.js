/* Doesn't support
    - Placeholder like %d and other similar kind of way to build strings
    - Object to string will result in [Object object]
*/

PP.ConsoleVR = class ConsoleVR {

    constructor(consoleVRComponent) {
        this._myConsoleVRComponent = consoleVRComponent;
        this._myConsoleVRSetup = new PP.ConsoleVRSetup();
        this._myConsoleVR_UI = new PP.ConsoleVR_UI();

        this._myTextComponents = [];

        this._myMessages = [];

        this.myIsActive = true;

        this._myOldConsole = [];

        this._myTypeFilters = [];
        for (let key in PP.ConsoleVR.MessageType) {
            this._myTypeFilters[PP.ConsoleVR.MessageType[key]] = false;
        }

        this._myOnClickAlreadyTriggeredThisFrame = false; //fix an issue in cursor-target that calls onclick twice

        this._myScrollUp = false;
        this._myScrollDown = false;
        this._myScrollOffset = 0;
        this._myScrollTimer = 0;

        //Constants
        this._myMessageTypeColors = [];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.LOG] = [1, 1, 1, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.ERROR] = [1, 0, 0, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.WARN] = [1, 1, 0, 1];
        this._myMessageTypeColors[PP.ConsoleVR.MessageType.INFO] = [0, 0, 1, 1];

        this._myTabString = "    ";

        this._myMaxCharactersPerLine = 100;
        this._myMaxLineSplits = 10; //prevent infinite splitting
        this._myMaxLines = 23;
        this._myMaxMessages = 100;
        this._myMaxMessagesDeletePad = 20; // to prevent deleting at every message, delay the delete after the limit is exceed by this value

        this._myLinesBetweenMessages = 1;

        this._myButtonNormalColor = [46 / 255, 46 / 255, 46 / 255, 1];
        this._myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];

        this._myFilterButtonDisabledTextColor = [100 / 255, 100 / 255, 100 / 255, 1];

        this._myScrollDelay = 0.1;
    }

    start() {
        this._myConsoleVR_UI.build(this._myConsoleVRComponent, this._myConsoleVRSetup);

        this._shimConsoleFunctions();

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

    //This must be done only when all the setup is complete, to avoid issues with other part of the code calling the console and then triggering the console vr while not ready yet
    _shimConsoleFunctions() {
        this._myOldConsole[PP.ConsoleVR.MessageType.ERROR] = console.error;
        console.error = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.ERROR);

        this._myOldConsole[PP.ConsoleVR.MessageType.LOG] = console.log;
        console.log = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.LOG);

        this._myOldConsole[PP.ConsoleVR.MessageType.WARN] = console.warn;
        console.warn = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.WARN);

        this._myOldConsole[PP.ConsoleVR.MessageType.INFO] = console.info;
        console.info = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.INFO);

    }

    update(dt) {
        if (this.myIsActive) {
            this._myOnClickAlreadyTriggeredThisFrame = false;
            this._updateScroll(dt);
        }
    }

    _updateText(messageType) {
        let consoleText = "";

        if (!this._myTypeFilters[messageType]) {
            let linesCount = 0;
            let i = this._myMessages.length - 1;

            let scrollLinesToSkip = this._myScrollOffset;

            while (i >= 0 && linesCount < this._myMaxLines) {
                let message = this._myMessages[i];

                if (this._myTypeFilters[message.myType]) {
                    i -= 1;
                    continue;
                }

                let messageLines = message.myLines.length;

                let linesToSkip = 0;

                if (scrollLinesToSkip > 0) {
                    let additionalEmptyLines = 0;
                    if (i != this._myMessages.length - 1) {
                        additionalEmptyLines = this._myLinesBetweenMessages;
                    }

                    if (scrollLinesToSkip >= messageLines + additionalEmptyLines) { // + empty lines between messages
                        scrollLinesToSkip -= messageLines + additionalEmptyLines;
                        linesToSkip = messageLines + additionalEmptyLines;
                    } else {
                        linesToSkip = scrollLinesToSkip;
                        scrollLinesToSkip = 0;
                    }
                }

                //Add empty lines between messages
                if (i != this._myMessages.length - 1) {
                    let emptyLinesToSkip = this._myLinesBetweenMessages - Math.max(this._myLinesBetweenMessages - linesToSkip, 0);
                    let emptyLinesToShow = this._myLinesBetweenMessages - emptyLinesToSkip;
                    if (linesCount + emptyLinesToShow > this._myMaxLines) {
                        emptyLinesToShow = this._myMaxLines - linesCount;
                    }

                    for (let j = 0; j < emptyLinesToShow; j++) {
                        consoleText = ("\n").concat(consoleText);
                    }

                    linesCount += emptyLinesToShow;
                    linesToSkip -= emptyLinesToSkip;
                }

                let linesToShow = messageLines - linesToSkip;
                if (linesCount + linesToShow > this._myMaxLines) {
                    linesToShow = this._myMaxLines - linesCount;
                }

                if (linesToShow > 0) {
                    if (message.myType == messageType) {
                        let linesToPrint = message.myLines.slice(messageLines - linesToShow - linesToSkip, messageLines - linesToSkip);
                        let text = linesToPrint.join("\n");
                        consoleText = (text.concat("\n")).concat(consoleText);

                        linesCount += linesToShow;
                    } else {
                        for (let j = 0; j < linesToShow; j++) {
                            consoleText = ("\n").concat(consoleText);
                        }

                        linesCount += linesToShow;
                    }
                }

                i -= 1;
            }
        }

        consoleText = this._myConsoleVRSetup.myMessagesTextStartString.concat(consoleText);

        this._myConsoleVR_UI._myMessagesTextComponents[messageType].text = consoleText;
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
        let formattedText = this._formatArgs(...args);

        let lines = this._splitLongLines(formattedText);

        let message = new PP.ConsoleVR.Message(messageType, lines);

        return message;
    }

    _splitLongLines(messageText) {
        let linesToSplit = messageText.split("\n");
        let lines = [];
        for (let i = 0; i < linesToSplit.length; i++) {
            let lineToSplit = linesToSplit[i];

            if (lineToSplit.length > this._myMaxCharactersPerLine) {
                let spacesAtStart = this._getSpacesAtStart(lineToSplit);
                let spaceToAdd = this._myTabString.concat(spacesAtStart);
                let lineSplits = 0;

                while (lineToSplit.length > this._myMaxCharactersPerLine && lineSplits < this._myMaxLineSplits) {
                    let firstSub = lineToSplit.substr(0, this._myMaxCharactersPerLine - 1);
                    let secondSub = lineToSplit.substr(this._myMaxCharactersPerLine - 1);
                    secondSub = spaceToAdd.concat(secondSub);

                    lines.push(firstSub);

                    lineToSplit = secondSub;
                    lineSplits++;
                }
                lines.push(lineToSplit);
            } else {
                lines.push(lineToSplit);
            }
        }

        return lines;
    }

    _getSpacesAtStart(text) {
        let spaces = "";
        let i = 0;

        while (i < text.length && text[i] == ' ') {
            spaces = spaces.concat(" ");
            i++;
        }

        return spaces;
    }

    //Here the formatting using placeholder like %d could be implemented in the future
    _formatArgs(...args) {
        let formattedString = args.join(" ");

        return formattedString;
    }

    _addMessage(message) {
        let hasSameInfoAsPrev = false;
        if (this._myMessages.length > 0) {
            let lastMessage = this._myMessages[this._myMessages.length - 1];
            if (lastMessage.hasSameInfo(message)) {
                lastMessage.increaseCount();
                hasSameInfoAsPrev = true;
            }
        }

        if (!hasSameInfoAsPrev) {
            this._myMessages.push(message);
        }

        this._adjustScrollOffsetAfterMessageAdded(message, hasSameInfoAsPrev);
    }

    //if you have scrolled, new messages does not move the scroll position
    _adjustScrollOffsetAfterMessageAdded(message, hasSameInfoAsPrev) {
        if (!hasSameInfoAsPrev && !(this._myTypeFilters[message.myType]) && this._myScrollOffset > 0) {
            this._myScrollOffset += message.myLines.length + this._myLinesBetweenMessages;
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

        {
            let tempMaterial = this._myConsoleVRComponent._myUpButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myUpButton.children[0].getComponent("mesh").material = tempMaterial;

            let cursorTarget = this._myConsoleVRComponent._myUpButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._instantScrollUp.bind(this));
            cursorTarget.addHoverFunction(this._setScrollUp.bind(this, tempMaterial, true));
            cursorTarget.addUnHoverFunction(this._setScrollUp.bind(this, tempMaterial, false));
        }

        {
            let tempMaterial = this._myConsoleVRComponent._myDownButton.children[0].getComponent("mesh").material.clone();
            this._myConsoleVRComponent._myDownButton.children[0].getComponent("mesh").material = tempMaterial;

            let cursorTarget = this._myConsoleVRComponent._myDownButton.getComponent("cursor-target");
            cursorTarget.addClickFunction(this._instantScrollDown.bind(this));
            cursorTarget.addHoverFunction(this._setScrollDown.bind(this, tempMaterial, true));
            cursorTarget.addUnHoverFunction(this._setScrollDown.bind(this, tempMaterial, false));
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

        this._clampScrollOffset();
        this._updateAllTexts();

        this._myOnClickAlreadyTriggeredThisFrame = true;
    }

    _clearConsole() {
        if (this._myOnClickAlreadyTriggeredThisFrame) {
            return;
        }

        this._myMessages = [];
        this._clampScrollOffset();
        this._updateAllTexts();

        console.clear();

        this._myOnClickAlreadyTriggeredThisFrame = true;
    }

    _setScrollUp(material, value) {
        if (value) {
            this._myScrollTimer = this._myScrollDelay / 2;
            this._genericHover(material);
        } else {
            this._genericUnHover(material);
        }

        this._myScrollUp = value;
    }

    _setScrollDown(material, value) {
        if (value) {
            this._myScrollTimer = this._myScrollDelay / 2;
            this._genericHover(material);
        } else {
            this._genericUnHover(material);
        }

        this._myScrollDown = value;
    }

    _updateScroll(dt) {
        if (this._myScrollUp) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myScrollDelay) {
                this._myScrollTimer -= this._myScrollDelay;
                this._myScrollOffset += 1;
            }
        } else if (this._myScrollDown) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myScrollDelay) {
                this._myScrollTimer -= this._myScrollDelay;
                this._myScrollOffset -= 1;
            }
        }

        this._clampScrollOffset();

        if (this._myScrollUp || this._myScrollDown) {
            this._updateAllTexts();
        }
    }

    _clampScrollOffset() {
        let maxScroll = Math.max(this._getLinesCount() - this._myMaxLines, 0);
        this._myScrollOffset = Math.min(Math.max(this._myScrollOffset, 0), maxScroll); //clamp 
    }

    _instantScrollUp() {
        this._myScrollOffset = Math.max(this._getLinesCount() - this._myMaxLines, 0);
        this._updateAllTexts();
    }

    _instantScrollDown() {
        this._myScrollOffset = 0;
        this._updateAllTexts();
    }

    _genericHover(material) {
        material.color = this._myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._myButtonNormalColor;
    }

    _getLinesCount() {
        let linesCount = 0;
        for (let message of this._myMessages) {
            if (!this._myTypeFilters[message.myType]) {
                linesCount += message.myLines.length + this._myLinesBetweenMessages;
            }
        }
        linesCount -= this._myLinesBetweenMessages; //empty line is added only between messages
        linesCount = Math.max(linesCount, 0);

        return linesCount;
    }
};

PP.ConsoleVR.MessageType = {
    INFO: 0,
    WARN: 1,
    ERROR: 2,
    LOG: 3
};

PP.ConsoleVR.Message = class Message {
    constructor(messageType, messageLines) {
        this.myType = messageType;
        this.myLines = messageLines;

        this._myOriginalText = messageLines.join("\n");

        this._myMessagesCount = 1;
    }

    hasSameInfo(message) {
        return this._myOriginalText == message._myOriginalText && this.myType == message.myType;
    }

    increaseCount() {
        this._myMessagesCount += 1;

        let countString = (("(x").concat(this._myMessagesCount)).concat(") ");

        let text = this._myOriginalText.slice(0);
        text = countString.concat(text);
        this.myLines = text.split("\n");
    }
};