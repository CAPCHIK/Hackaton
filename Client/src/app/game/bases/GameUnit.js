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
var babylonjs_1 = require("babylonjs");
var GameUnit = /** @class */ (function (_super) {
    __extends(GameUnit, _super);
    function GameUnit(scene, name, _hp) {
        var _this = _super.call(this, name) || this;
        _this.scene = scene;
        _this._hp = _hp;
        _this.uid = -1;
        _this.maxHp = _hp;
        _this.name = name;
        _this.uid = GameUnit.currentUid++;
        return _this;
    }
    Object.defineProperty(GameUnit.prototype, "hp", {
        get: function () { return this._hp; },
        enumerable: true,
        configurable: true
    });
    GameUnit.prototype.onCreate = function () { };
    GameUnit.prototype.onDestroy = function () { };
    GameUnit.prototype.onDamageApplied = function () { };
    GameUnit.prototype.onUpdate = function () { };
    GameUnit.prototype.applyDamage = function (damage) {
        this._hp -= damage;
        if (this._hp <= 0) {
            this.scene.deleteUnit(this);
            return;
        }
        this.onDamageApplied();
    };
    GameUnit.currentUid = 0;
    return GameUnit;
}(babylonjs_1.TransformNode));
exports.GameUnit = GameUnit;
//# sourceMappingURL=GameUnit.js.map