WL.registerComponent('test-console', {
    _myConsoleVR: { type: WL.Type.Object, default: null },
}, {
    init: function () {
    },
    start: function () {
        window.addEventListener('keydown', this.press.bind(this));

        this._myNeedReset = false;

        this._myConsoleVRImpl = this._myConsoleVR.getComponent("console-vr")._myImpl;
    },
    update: function (dt) {
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


        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            console.warn("Watermelon warn");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) {
            console.warn("Archery warn\nasdasdasd\nsdsdsd");
        }


        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            console.info("Watermelon info");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) {
            console.info("Archery info\nasdasdasd\nsdsdsd");
        }

        let axes = PP.RightGamepad.getAxesInfo().myAxes;

        if (this._myNeedReset) {
            if (glMatrix.vec2.length(axes) < 0.1) {
                this._myNeedReset = false;
            }
        } else {
            if (axes[0] > 0.8) {
                this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.LOG] = !this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.LOG];
                this._myNeedReset = true;
            } else if (axes[0] < -0.8) {
                this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.ERROR] = !this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.ERROR];
                this._myNeedReset = true;
            } else if (axes[1] > 0.8) {
                this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.WARN] = !this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.WARN];
                this._myNeedReset = true;
            } else if (axes[1] < -0.8) {
                this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.INFO] = !this._myConsoleVRImpl._myTypeFilters[PP.ConsoleVR.MessageType.INFO];
                this._myNeedReset = true;
            }
        }
    },
    press: function () {
        console.error("Watermelon");
    }
});