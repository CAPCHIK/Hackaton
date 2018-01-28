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
var StaticObject = /** @class */ (function (_super) {
    __extends(StaticObject, _super);
    function StaticObject(scene, name, modelName) {
        var _this = _super.call(this, scene, name) || this;
        _this.modelName = modelName;
        return _this;
    }
    StaticObject.prototype.onCreate = function () {
        var _this = this;
        this.scene.resourceManager.load(this.modelName, function (model) {
            if (model == null || model.meshes == null) {
                return;
            }
            model.meshes.forEach(function (mesh) {
                var newMesh = mesh.clone(_this.name + '_mesh', _this, false);
                newMesh.isVisible = true;
                newMesh.receiveShadows = true;
            });
        });
    };
    StaticObject.prototype.onUpdate = function () {
    };
    StaticObject.prototype.getSyncData = function () {
        return {};
    };
    return StaticObject;
}(GameUnit_1.GameUnit));
exports.StaticObject = StaticObject;
//# sourceMappingURL=StaticObject.js.map