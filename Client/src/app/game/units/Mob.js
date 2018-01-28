"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GameUnit_1 = require("../bases/GameUnit");
var babylonjs_1 = require("babylonjs");
var MobType;
(function (MobType) {
    MobType[MobType["Knuckles"] = 0] = "Knuckles";
    MobType[MobType["Nyan"] = 1] = "Nyan";
})(MobType = exports.MobType || (exports.MobType = {}));
var Mob = /** @class */ (function (_super) {
    __extends(Mob, _super);
    function Mob(scene, name, mobType) {
        var _this = _super.call(this, scene, name) || this;
        _this.mobType = mobType;
        _this.sounds = new Array();
        return _this;
    }
    Mob.prototype.onCreate = function () {
        var _this = this;
        babylonjs_1.Tags.AddTagsTo(this, 'enemy');
        switch (this.mobType) {
            case MobType.Knuckles:
                this.sounds.push(new BABYLON.Sound('deway', './assets/knuckles_dewey.mp3', this.scene.core));
                this.sounds.push(new BABYLON.Sound('qluck', './assets/knuckles_qlack.mp3', this.scene.core));
                this.scene.resourceManager.load('knuckles', function (model) {
                    if (model == null || model.meshes == null) {
                        return;
                    }
                    model.meshes.forEach(function (mesh) {
                        var newMesh = mesh.clone(_this.name + '_mesh', _this);
                        if (mesh.skeleton != null) {
                            newMesh.skeleton = mesh.skeleton.clone(_this.name + '_skeleton', '');
                            _this.scene.core.beginAnimation(newMesh.skeleton, 0, 63, true, 1);
                        }
                        babylonjs_1.Tags.AddTagsTo(newMesh, 'enemy');
                        newMesh.isVisible = true;
                    });
                });
                break;
            case MobType.Nyan:
                this.scene.resourceManager.load('nyan', function (model) {
                    if (model == null || model.meshes == null) {
                        return;
                    }
                    model.meshes.forEach(function (mesh) {
                        var newMesh = mesh.clone(_this.name + '_mesh', _this);
                        babylonjs_1.Tags.AddTagsTo(newMesh, 'enemy');
                        newMesh.isVisible = true;
                        _this.scene.shadowGenerator.getShadowMap().renderList.push(newMesh);
                    });
                });
                break;
        }
    };
    Mob.prototype.onUpdate = function () {
        if (this.target == null) {
            return;
        }
        if (this.sounds.length > 0 && Math.random() < 0.001) {
            this.sounds[0].play();
            this.sounds[0].setPosition(this.position);
        }
        else if (this.sounds.length > 1 && Math.random() < 0.01) {
            this.sounds[1].play();
            this.sounds[1].setPosition(this.position);
        }
        var direction = new BABYLON.Vector3(this.target.position.x, 0, this.target.position.z).subtract(this.position);
        if (direction.length() < 2) {
            this.target.applyDamage(0.3);
            this.scene.deleteUnit(this);
            return;
        }
        direction = direction.normalize();
        this.position = this.position.add(direction.scale(0.01 * this.scene.core.getEngine().getDeltaTime()));
        this.position.y = 0.8; // + Math.sin(new Date().getTime() * 0.000001);
        var targetPosition = this.target.position.clone();
        targetPosition.y = this.position.y;
        this.lookAt(targetPosition);
    };
    Mob.prototype.setTarget = function (target) {
        this.target = target;
    };
    Mob.prototype.getSyncData = function () {
        return {
            unitType: 'Mob',
            uid: this.uid,
            mobType: this.mobType,
            position: this.position,
            rotationY: this.rotation.y,
            hp: this.hp,
            maxHp: this.maxHp
        };
    };
    return Mob;
}(GameUnit_1.GameUnit));
exports.Mob = Mob;
//# sourceMappingURL=Mob.js.map