WL.registerComponent('magic-sphere', {
}, {
    init: function () {
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Magic Sphere X", 0, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Magic Sphere Y", 0.85, 0.5, 4));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Magic Sphere Z", -2, 0.5, 4));
    },
    start: function () {
        this.myCollider = this.object.getComponent("collision");
    },
    update: function (dt) {
        this.object.setTranslationLocal([PP.EasyTuneVariables.get("Magic Sphere X").myValue, PP.EasyTuneVariables.get("Magic Sphere Y").myValue, PP.EasyTuneVariables.get("Magic Sphere Z").myValue]);

        let collidingComps = this.myCollider.queryOverlaps();
        if (collidingComps.length > 0) {
            spawnParticles = true;
        } else {
            spawnParticles = false;

        }
    },
});

var spawnParticles = false;