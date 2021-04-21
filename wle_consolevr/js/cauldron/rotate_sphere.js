WL.registerComponent('rotate-sphere', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        this.object.rotateAxisAngleRadObject([-1, 0, 0], Math.PI * dt / 2);
    },
});

var spawnParticles = false;