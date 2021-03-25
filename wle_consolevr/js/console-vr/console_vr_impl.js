/* Doesn't support
    - Placeholder like %d and other similar kind of way to build strings
    - Object to string will result in [Object object]
*/

PP.ConsoleVR = class ConsoleVR {

    constructor() {
        this._myConsoleVRSetup = new PP.ConsoleVRSetup();
        this._myConsoleVR_UI = new PP.ConsoleVR_UI();

        this._myMessages = [];

        this._myIsActive = true;

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
    }

    start(consoleVRComponent) {
        this._myConsoleVR_UI.build(consoleVRComponent, this._myConsoleVRSetup);
        this._addButtonsListeners();

        this._setupGamepadsExtraActions();

        this._shimConsoleFunctions();
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
        if (this._myIsActive) {
            this._myOnClickAlreadyTriggeredThisFrame = false;
            this._updateScroll(dt);
        }

        this._updateGamepadsExtraActions(dt);
    }

    //Text section

    _updateText(messageType) {
        let consoleText = "";

        if (!this._myTypeFilters[messageType]) {
            let linesCount = 0;
            let i = this._myMessages.length - 1;

            let scrollLinesToSkip = this._myScrollOffset;

            while (i >= 0 && linesCount < this._myConsoleVRSetup.myMaxLines) {
                let message = this._myMessages[i];

                //skip filtered messages
                if (this._myTypeFilters[message.myType]) {
                    i -= 1;
                    continue;
                }

                let messageLines = message.myLines.length;

                //compute line to skip due to scroll offset
                let linesToSkip = 0;
                if (scrollLinesToSkip > 0) {
                    let additionalEmptyLines = 0;
                    if (i != this._myMessages.length - 1) {
                        additionalEmptyLines = this._myConsoleVRSetup.myLinesBetweenMessages;
                    }

                    if (scrollLinesToSkip >= messageLines + additionalEmptyLines) { // + empty lines between messages
                        scrollLinesToSkip -= messageLines + additionalEmptyLines;
                        linesToSkip = messageLines + additionalEmptyLines;
                    } else {
                        linesToSkip = scrollLinesToSkip;
                        scrollLinesToSkip = 0;
                    }
                }

                //add empty lines between messages
                if (i != this._myMessages.length - 1) {
                    let emptyLinesToSkip = this._myConsoleVRSetup.myLinesBetweenMessages - Math.max(this._myConsoleVRSetup.myLinesBetweenMessages - linesToSkip, 0);
                    let emptyLinesToShow = this._myConsoleVRSetup.myLinesBetweenMessages - emptyLinesToSkip;
                    if (linesCount + emptyLinesToShow > this._myConsoleVRSetup.myMaxLines) {
                        emptyLinesToShow = this._myMaxLines - linesCount;
                    }

                    for (let j = 0; j < emptyLinesToShow; j++) {
                        consoleText = ("\n").concat(consoleText);
                    }

                    linesCount += emptyLinesToShow;
                    linesToSkip -= emptyLinesToSkip;
                }

                //computing the number of message lines to show
                let linesToShow = messageLines - linesToSkip;
                if (linesCount + linesToShow > this._myConsoleVRSetup.myMaxLines) {
                    linesToShow = this._myConsoleVRSetup.myMaxLines - linesCount;
                }

                if (linesToShow > 0) {
                    if (message.myType == messageType) {
                        //if the message is the same type of this message text component, add the message lines

                        let linesToPrint = message.myLines.slice(messageLines - linesToShow - linesToSkip, messageLines - linesToSkip);
                        let text = linesToPrint.join("\n");
                        consoleText = (text.concat("\n")).concat(consoleText);

                        linesCount += linesToShow;
                    } else {
                        //otherwise add empty lines, so that the text component with the correct type will have space to show this message

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

        if (this._myMessages.length >= this._myConsoleVRSetup.myMaxMessages + this._myConsoleVRSetup.myMaxMessagesDeletePad) {
            this._myMessages = this._myMessages.slice(this._myMessages.length - this._myConsoleVRSetup.myMaxMessages);
        }

        this._updateAllTexts();

        this._pulseGamepad();

        this._myOldConsole[messageType].apply(console, args);
    }

    _argsToMessage(messageType, ...args) {
        let formattedText = this._formatArgs(...args);

        let lines = this._splitLongLines(formattedText);

        let message = new PP.ConsoleVR.Message(messageType, lines);

        return message;
    }

    //Here the formatting using placeholder like %d could be implemented in the future
    _formatArgs(...args) {
        let formattedString = args.join(" ");

        return formattedString;
    }

    _splitLongLines(messageText) {
        let linesToSplit = messageText.split("\n");
        let lines = [];
        for (let i = 0; i < linesToSplit.length; i++) {
            let lineToSplit = linesToSplit[i];

            if (lineToSplit.length > this._myConsoleVRSetup.myMaxCharactersPerLine) {
                let spacesAtStart = this._getSpacesAtStart(lineToSplit);
                let spaceToAdd = this._myConsoleVRSetup.myTabString.concat(spacesAtStart);
                let lineSplits = 0;

                while (lineToSplit.length > this._myConsoleVRSetup.myMaxCharactersPerLine && lineSplits < this._myConsoleVRSetup.myMaxLineSplits) {
                    let firstSub = lineToSplit.substr(0, this._myConsoleVRSetup.myMaxCharactersPerLine - 1);
                    let secondSub = lineToSplit.substr(this._myConsoleVRSetup.myMaxCharactersPerLine - 1);
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
            this._myScrollOffset += message.myLines.length + this._myConsoleVRSetup.myLinesBetweenMessages;
        }
    }

    _updateAllTexts() {
        if (this._myIsActive) {
            for (let key in PP.ConsoleVR.MessageType) {
                this._updateText(PP.ConsoleVR.MessageType[key]);
            }
        }
    }

    _updateScroll(dt) {
        if (this._myScrollUp) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myConsoleVRSetup.myScrollDelay) {
                this._myScrollTimer -= this._myConsoleVRSetup.myScrollDelay;
                this._myScrollOffset += 1;
            }
        } else if (this._myScrollDown) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myConsoleVRSetup.myScrollDelay) {
                this._myScrollTimer -= this._myConsoleVRSetup.myScrollDelay;
                this._myScrollOffset -= 1;
            }
        }

        this._clampScrollOffset();

        if (this._myScrollUp || this._myScrollDown) {
            this._updateAllTexts();
        }
    }

    _clampScrollOffset() {
        let maxScroll = this._getMaxScrollOffset();
        this._myScrollOffset = Math.min(Math.max(this._myScrollOffset, 0), maxScroll); //clamp 
    }

    _getMaxScrollOffset() {
        return Math.max(this._getLinesCount() - this._myConsoleVRSetup.myMaxLines, 0);
    }

    _getLinesCount() {
        let linesCount = 0;
        for (let message of this._myMessages) {
            if (!this._myTypeFilters[message.myType]) {
                linesCount += message.myLines.length + this._myConsoleVRSetup.myLinesBetweenMessages;
            }
        }
        linesCount -= this._myConsoleVRSetup.myLinesBetweenMessages; //empty line is added only between messages
        linesCount = Math.max(linesCount, 0);

        return linesCount;
    }

    //Listener section

    _addButtonsListeners() {
        let ui = this._myConsoleVR_UI;

        for (let key in PP.ConsoleVR.MessageType) {
            let cursorTarget = ui._myFilterButtonsCursorTargetComponents[PP.ConsoleVR.MessageType[key]];
            let backgroundMaterial = ui._myFilterButtonsBackgroundComponents[PP.ConsoleVR.MessageType[key]].material;
            let textMaterial = ui._myFilterButtonsTextComponents[PP.ConsoleVR.MessageType[key]].material;

            cursorTarget.addClickFunction(this._toggleFilter.bind(this, PP.ConsoleVR.MessageType[key], backgroundMaterial, textMaterial));
            cursorTarget.addHoverFunction(this._filterHover.bind(this, PP.ConsoleVR.MessageType[key], backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._filterUnHover.bind(this, PP.ConsoleVR.MessageType[key], backgroundMaterial));
        }

        {
            let cursorTarget = ui._myClearButtonCursorTargetComponent;
            let backgroundMaterial = ui._myClearButtonBackgroundComponent.material;

            cursorTarget.addClickFunction(this._clearConsole.bind(this));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui._myUpButtonCursorTargetComponent;
            let backgroundMaterial = ui._myUpButtonBackgroundComponent.material;

            cursorTarget.addClickFunction(this._instantScrollUp.bind(this));
            cursorTarget.addHoverFunction(this._setScrollUp.bind(this, backgroundMaterial, true));
            cursorTarget.addUnHoverFunction(this._setScrollUp.bind(this, backgroundMaterial, false));
        }

        {
            let cursorTarget = ui._myDownButtonCursorTargetComponent;
            let backgroundMaterial = ui._myDownButtonBackgroundComponent.material;

            cursorTarget.addClickFunction(this._instantScrollDown.bind(this));
            cursorTarget.addHoverFunction(this._setScrollDown.bind(this, backgroundMaterial, true));
            cursorTarget.addUnHoverFunction(this._setScrollDown.bind(this, backgroundMaterial, false));
        }
    }

    _toggleFilter(messageType, backgroundMaterial, textMaterial) {
        if (this._myOnClickAlreadyTriggeredThisFrame) {
            return;
        }

        this._myTypeFilters[messageType] = !this._myTypeFilters[messageType];
        if (this._myTypeFilters[messageType]) {
            textMaterial.color = this._myConsoleVRSetup.myFilterButtonDisabledTextColor;
        } else {
            textMaterial.color = this._myConsoleVRSetup.myMessageTypeColors[messageType];
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
            this._myScrollTimer = this._myConsoleVRSetup.myScrollDelay / 2;
            this._genericHover(material);
        } else {
            this._genericUnHover(material);
        }

        this._myScrollUp = value;
    }

    _setScrollDown(material, value) {
        if (value) {
            this._myScrollTimer = this._myConsoleVRSetup.myScrollDelay / 2;
            this._genericHover(material);
        } else {
            this._genericUnHover(material);
        }

        this._myScrollDown = value;
    }

    _instantScrollUp() {
        this._myScrollOffset = this._getMaxScrollOffset();
        this._updateAllTexts();
    }

    _instantScrollDown() {
        this._myScrollOffset = 0;
        this._updateAllTexts();
    }

    _filterHover(messageType, material) {
        this._genericHover(material);
    }

    _filterUnHover(messageType, material) {
        if (this._myTypeFilters[messageType]) {
            material.color = this._myConsoleVRSetup.myFilterButtonDisabledBackgroundColor;
        } else {
            material.color = this._myConsoleVRSetup.myBackgroundColor;
        }
    }

    _genericHover(material) {
        material.color = this._myConsoleVRSetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._myConsoleVRSetup.myBackgroundColor;
    }

    //Gamepad section 

    _setupGamepadsExtraActions() {
        this._myLeftGamepad = PP.LeftGamepad; //@EDIT get gamepad LEFT here based on how you store it in your game
        this._myRightGamepad = PP.RightGamepad; //@EDIT get gamepad RIGHT here based on how you store it in your game

        if (this._myLeftGamepad && this._myRightGamepad) {
            this._myLeftGamepad.registerAxesEvent(PP.AxesEvent.AXES_CHANGED, this, this._scrollWithThumbstick.bind(this));
        }
    }

    _updateGamepadsExtraActions(dt) {
        if (this._myLeftGamepad && this._myRightGamepad) {
            let leftThumbstickJustPressed = this._myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !this._myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed;
            let rightThumbstickJustPressed = this._myRightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !this._myRightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed;

            if ((leftThumbstickJustPressed && this._myRightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed) ||
                (rightThumbstickJustPressed && this._myLeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed)) {
                this._toggleConsoleVisibility();
            }
        }
    }

    _scrollWithThumbstick(axesInfo, gamepad) {

    }

    _pulseGamepad() {

    }

    _toggleConsoleVisibility() {
        if (this._myIsActive) {
            this._myConsoleVR_UI._myConsoleVRMainPanel.scale([0, 0, 0]);
            this._myConsoleVR_UI._myConsoleVRMainPanel.setTranslationWorld([0, -3000, 0]);

            this._myIsActive = false;
        } else {
            this._myConsoleVR_UI._myConsoleVRMainPanel.resetTransform();

            this._myIsActive = true;
        }
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