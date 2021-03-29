WL.registerComponent('test-input-generator', {
}, {
    init: function () {
    },
    start: function () {
        window.addEventListener('keydown', this.press.bind(this));
    },
    update: function (dt) {
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            console.err4or("Watermelon");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            console.error("Watermelon Error", 3);
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed) {
            console.log("Watermelon Log");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPrevPressed) {
            console.debug("Archery Debug\nasdasdasd\nsdsdsd");
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !PP.LeftGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed) {
            console.assert(true, "Watermelon Assert True");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPressed && !PP.RightGamepad.getButtonInfo(PP.ButtonType.THUMBSTICK).myIsPrevPressed) {
            console.assert(false, "Watermelon Assert False");
        }

        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            console.warn("Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn\n       Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warnWatermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn Watermelon warn");
        }
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) {
            console.warn("Archery warn\nasdasdasd\nsdsdsd");
        }

        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).myIsPressed) {
            console.info("Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info Watermelon info");
        }
        if (PP.LeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) {
            console.info("Archery info\nasdasdasd\nsdsdsd", "boh");
        }
    },
    press: function () {
        console.error("Watermelon");
    }
});