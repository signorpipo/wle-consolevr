PP.ConsoleVR = class ConsoleVR {

    constructor(consoleVRComponent) {
        this._myConsoleVRComponent = consoleVRComponent;
        this._myTextComponent = this._myConsoleVRComponent.object.getComponent("text");

        this._myMessages = [];

        this.myIsActive = true;

        this._myMaxCharactersPerLine = 110;
        this._myMaxLines = 25;
        this._myMaxMessages = 100;
        this._myMaxMessagesDeletePad = 20; // to prevent deleting at every message, delay the delete after the limit is exceed by this value
    }

    start() {
        window.addEventListener('keydown', this.press.bind(this));

        this._myOldConsoleError = console.error;
        console.error = this._consolePrint.bind(this, PP.ConsoleVR.MessageType.ERROR);
    }

    press() {
        console.error("Watermelon");
    }

    update(dt) {
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            console.err4or("Watermelon");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            console.error("Watermelon");
        }
    }

    _updateText() {
        let consoleText = "";
        let linesCount = 0;
        let i = this._myMessages.length - 1;

        while (i > 0 && linesCount < this._myMaxLines) {
            let message = this._myMessages[i];
            let messageLines = message.myLines.length;

            if (consoleText != "") {
                linesCount += 1;
                consoleText = ("\n\n").concat(consoleText);
            }

            if (linesCount + messageLines <= this._myMaxLines) {
                consoleText = message.myText.concat(consoleText);
                linesCount += messageLines;
            } else {
                let linesToShow = this._myMaxLines - linesCount;
                let lastLines = message.myLines.slice(messageLines - linesToShow);

                let text = lastLines.join("\n");
                consoleText = text.concat(consoleText);

                linesCount += linesToShow;
            }

            i -= 1;
        }

        this._myTextComponent.text = consoleText;
    }

    _consolePrint(messageType, ...args) {
        let message = this._argsToMessage(messageType, ...args);
        this._myMessages.push(message);

        if (this._myMessages.length >= this._myMaxMessages + this._myMaxMessagesDeletePad) {
            this._myMessages = this._myMessages.slice(this._myMessages.length - this._myMaxMessages);
        }

        if (this.myIsActive) {
            this._updateText();
        }

        this._myOldConsoleError.apply(console, args);
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
};

PP.ConsoleVR.MessageType = {
    LOG: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3
};

PP.ConsoleVR.Message = class Message {
    constructor(messageType, messageLines) {
        this.myType = messageType;
        this.myLines = messageLines;

        this.myText = messageLines.join("\n");

        this.myMessagesCount = 1;
    }
};