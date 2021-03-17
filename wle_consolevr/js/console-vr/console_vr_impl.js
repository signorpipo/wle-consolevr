PP.ConsoleVR = class ConsoleVR {

    constructor(consoleVRComponent) {
        this._myConsoleVRComponent = consoleVRComponent;

        this._myTextComponents = [];

        this._myMessages = [];

        this.myIsActive = true;

        this._myMaxCharactersPerLine = 110;
        this._myMaxLines = 23;
        this._myMaxMessages = 100;
        this._myMaxMessagesDeletePad = 20; // to prevent deleting at every message, delay the delete after the limit is exceed by this value

        this._myOldConsole = [];
    }

    start() {
        window.addEventListener('keydown', this.press.bind(this));

        this._myOldConsole[PP.ConsoleVR.MessageType.ERROR] = console.error;
        console.error = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.ERROR);

        this._myOldConsole[PP.ConsoleVR.MessageType.LOG] = console.log;
        console.log = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.LOG);

        this._myTextComponents = [];
        this._myTextComponents[PP.ConsoleVR.MessageType.LOG] = this._myConsoleVRComponent._myLog.getComponent("text");
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR] = this._myConsoleVRComponent._myError.getComponent("text");

        this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material = this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.LOG].material.color = [1, 1, 1, 1];
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material = this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material.clone();
        this._myTextComponents[PP.ConsoleVR.MessageType.ERROR].material.color = [1, 0, 0, 1];
    }

    press() {
        console.error("Watermelon");
    }

    update(dt) {
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            console.err4or("Watermelon");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            console.error("Watermelon Error");
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            console.log("Watermelon Log");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            console.log("Archery Log\nasdasdasd\nsdsdsd");
        }
    }

    _updateText(messageType) {
        let consoleText = "";
        let linesCount = 0;
        let i = this._myMessages.length - 1;

        while (i >= 0 && linesCount < this._myMaxLines) {
            let message = this._myMessages[i];
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

        consoleText = (".\n").concat(consoleText);

        this._myTextComponents[messageType].text = consoleText;
    }

    _consolePrint(messageType, ...args) {
        let message = this._argsToMessage(messageType, ...args);
        this._addMessage(message);

        if (this._myMessages.length >= this._myMaxMessages + this._myMaxMessagesDeletePad) {
            this._myMessages = this._myMessages.slice(this._myMessages.length - this._myMaxMessages);
        }

        if (this.myIsActive) {
            for (let key in PP.ConsoleVR.MessageType) {
                this._updateText(PP.ConsoleVR.MessageType[key]);
            }
        }

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
};

PP.ConsoleVR.MessageType = {
    LOG: 0,
    ERROR: 1,
    /*
    WARNING: 2,
    INFO: 3
    */
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