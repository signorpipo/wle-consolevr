WL.registerComponent('test-input-generator', {
    _myUseConsoleVR: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
        window.addEventListener('keydown', this.press.bind(this));
        if (this._myUseConsoleVR) {
            this._myConsole = PP.ConsoleVR;
        } else {
            this._myConsole = console;
        }
    },
    update: function (dt) {
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            this._myConsole.err4or("Watermelon");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            this._myConsole.error("Watermelon Error", 3);
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            this._myConsole.log("Watermelon Log");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            this._myConsole.debug("Archery Debug\nasdasdasd\nsdsdsd");
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed) {
            this._myConsole.assert(true, "Watermelon Assert True");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed) {
            this._myConsole.assert(false, "Watermelon Assert False");
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            this._myConsole.warn("Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn\n       Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warnWatermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) {
            this._myConsole.info("Archery info\nasdasdasd\nsdsdsd");
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressStart()) {
            PP.ConsoleVR.log("Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log Watermelon log");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressStart()) {
            console.log("Archery log\nasdasdasd\nsdsdsd", "boh");
        }
    },
    press: function () {
        this._myConsole.error("Watermelon");
    }
});