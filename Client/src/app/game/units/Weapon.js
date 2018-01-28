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
var babylonjs_materials_1 = require("babylonjs-materials");
var Weapon = /** @class */ (function (_super) {
    __extends(Weapon, _super);
    function Weapon(scene, name, baseMesh) {
        var _this = _super.call(this, scene, name) || this;
        _this.baseMesh = baseMesh;
        return _this;
    }
    Weapon.prototype.onCreate = function () {
        var _this = this;
        this.scene.resourceManager.load('banana', function (model) {
            if (model == null || model.meshes == null) {
                return;
            }
            model.meshes.forEach(function (mesh) {
                mesh.parent = _this.baseMesh;
                mesh.position = _this.position;
                mesh.rotate(babylonjs_materials_1.Vector3.Up(), Math.PI / 2);
                mesh.rotate(babylonjs_materials_1.Vector3.Right(), Math.PI);
                mesh.rotate(babylonjs_materials_1.Vector3.Forward(), -Math.PI / 2);
                mesh.scaling = mesh.scaling.scale(0.1);
                mesh.isVisible = true;
                babylonjs_materials_1.Tags.AddTagsTo(mesh, 'banana');
            });
            _this.weapon = model.meshes[0];
        });
    };
    Weapon.prototype.onUpdate = function () {
    };
    Weapon.prototype.initParticle = function () {
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene.core);
        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", this.scene.core);
        // Where the particles come from
        // the starting object, the emitter
        particleSystem.createSphereEmitter(1.2);
        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 0.8;
        // Emission rate
        particleSystem.emitRate = 1500;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 20;
        particleSystem.updateSpeed = 0.005;
        this.phontain = BABYLON.MeshBuilder.CreateSphere("foutain", {
            diameter: 1
        }, this.scene.core);
        this.phontain.isVisible = false;
    };
    Weapon.prototype.shoot = function () {
        var direction = this.weapon.getDirection(babylonjs_materials_1.Vector3.Up().add(babylonjs_materials_1.Vector3.Right().negate().scale(1.7))).normalize();
        var right = BABYLON.Vector3.Cross(direction, BABYLON.Vector3.Up()).normalize();
        var up = BABYLON.Vector3.Cross(right, direction).normalize();
        var ray = new BABYLON.Ray(this.baseMesh.absolutePosition.add(up.scale(0.05)), direction);
        var rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this.scene.core, new BABYLON.Color3(1, 1, 0.1));
        // const hit = this.scene.core.pickWithRay(ray, (M) => (M.name.indexOf('mob') !== -1) || (M.name.indexOf('node_id') !== -1));
        var hit = this.scene.core.pickWithRay(ray, function (M) { return babylonjs_materials_1.Tags.MatchesQuery(M, 'enemy'); });
        if (hit.hit) {
            console.log(hit.pickedMesh.name);
            this.scene.deleteUnit(hit.pickedMesh.parent);
        } /* else {
            const nextHit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, '!banana'));
            if (nextHit.hit) {
                // const sp = MeshBuilder.CreateSphere('hit_sphere', {segments: 15, diameter: 0.1}, this.scene.core);
                // sp.position = nextHit.pickedPoint;
                // cnst mat = new CustomMaterial('customMaterial', this.scene.core);
                // mat.diffuseColor = Color3.Red();
                // sp.material = mat;
            }
        }*/
    };
    Weapon.prototype.getSyncData = function () {
        return {};
    };
    return Weapon;
}(GameUnit_1.GameUnit));
exports.Weapon = Weapon;
//# sourceMappingURL=Weapon.js.map