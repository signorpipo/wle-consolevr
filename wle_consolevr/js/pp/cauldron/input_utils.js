PP.InputUtils = {
    getHandednessByIndex: function (index) {
        let handedness = PP.Handedness.NONE;

        switch (index) {
            case PP.HandednessIndex.NONE:
                handedness = PP.Handedness.NONE;
                break;
            case PP.HandednessIndex.LEFT:
                handedness = PP.Handedness.LEFT;
                break;
            case PP.HandednessIndex.RIGHT:
                handedness = PP.Handedness.RIGHT;
                break;
        }

        return handedness;
    },
    getInputSource: function (handedness, inputSourceType) {
        let inputSource = null;

        if (WL.xrSession) {
            for (let i = 0; i < WL.xrSession.inputSources.length; i++) {
                let input = WL.xrSession.inputSources[i];

                let isCorrectType = (!inputSourceType) || (inputSourceType == PP.InputSourceType.GAMEPAD && !input.hand) || (inputSourceType == PP.InputSourceType.HAND && input.hand);
                if (isCorrectType && input.handedness == handedness) {
                    inputSource = input;
                    break;
                }
            }
        }

        return inputSource;
    },
    getInputSourceType: function (handedness) {
        let inputSourceType = PP.InputSourceType.NONE;

        let inputSource = PP.InputUtils.getInputSource(handedness);
        if (inputSource) {
            if (inputSource.hand) {
                inputSourceType = PP.InputSourceType.HAND;
            } else {
                inputSourceType = PP.InputSourceType.GAMEPAD;
            }
        }

        return inputSourceType;
    }
};