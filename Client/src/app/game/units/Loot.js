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
var LootType;
(function (LootType) {
    LootType[LootType["Meal"] = 0] = "Meal";
    LootType[LootType["Mana"] = 1] = "Mana";
})(LootType = exports.LootType || (exports.LootType = {}));
var Loot = /** @class */ (function (_super) {
    __extends(Loot, _super);
    function Loot(scene, name) {
        var _this = _super.call(this, scene, name) || this;
        _this.type = (Math.random() < 0.3) ? LootType.Meal : LootType.Mana;
        _this.amount = 1 + Math.random() * 10;
        return _this;
    }
    Loot.prototype.onUpdate = function () {
    };
    Loot.prototype.getSyncData = function () {
        return {
            unitType: 'Loot',
            uid: this.uid,
            position: this.position,
            type: this.type,
            amount: this.amount
        };
    };
    return Loot;
}(GameUnit_1.GameUnit));
exports.Loot = Loot;
//# sourceMappingURL=Loot.js.map