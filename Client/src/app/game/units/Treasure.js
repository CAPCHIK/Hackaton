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
var Treasure = /** @class */ (function (_super) {
    __extends(Treasure, _super);
    function Treasure(scene, name) {
        return _super.call(this, scene, name, 100) || this;
    }
    Treasure.prototype.onCreate = function () {
        var _this = this;
        this.scene.resourceManager.load('bitcoin', function (model) {
            if (model == null || model.meshes == null) {
                return;
            }
            model.meshes.forEach(function (mesh) {
                var newMesh = mesh.clone(_this.name + '_mesh', _this);
                newMesh.isVisible = true;
                _this.scene.shadowGenerator.getShadowMap().renderList.push(newMesh);
            });
            var customMaterial = new babylonjs_materials_1.CustomMaterial('bitcointhp', _this.scene.core);
            customMaterial.diffuseColor = babylonjs_materials_1.Color3.Green();
            _this.hpMaterial = customMaterial;
            _this.RenderHp();
            _this.translate(babylonjs_materials_1.Vector3.Up(), 4);
        });
    };
    Treasure.prototype.onUpdate = function () {
        this.rotate(BABYLON.Vector3.Up(), 0.000000000000007 * new Date().getTime());
    };
    Treasure.prototype.onDamageApplied = function () {
        this.RenderHp();
    };
    Treasure.prototype.RenderHp = function () {
        if (this.hpIndicator) {
            this.hpIndicator.dispose();
        }
        var part = this.hp / this.maxHp;
        this.hpIndicator = BABYLON.MeshBuilder.CreateDisc('bitcoinhp', { radius: 2.9, arc: part, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
        this.hpIndicator.rotate(babylonjs_materials_1.Vector3.Forward(), Math.PI / 2);
        this.hpMaterial.diffuseColor = new babylonjs_materials_1.Color3(1 - part, part, 0);
        this.hpIndicator.parent = this;
        this.hpIndicator.material = this.hpMaterial;
    };
    Treasure.prototype.getSyncData = function () {
        return {
            unitType: 'Treasure',
            uid: this.uid,
            position: this.position,
            hp: this.hp,
            maxHp: this.maxHp
        };
    };
    return Treasure;
}(GameUnit_1.GameUnit));
exports.Treasure = Treasure;
//# sourceMappingURL=Treasure.js.map