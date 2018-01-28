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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene, name, startPosition) {
        var _this = _super.call(this, scene, name) || this;
        _this.startPosition = startPosition;
        return _this;
    }
    Player.prototype.onCreate = function () {
        this.camera = new BABYLON.FreeCamera('camera', this.startPosition, this.scene.core);
        this.parent = this.camera;
        this.camera.attachControl(this.scene.core.getEngine().getRenderingCanvas(), true);
    };
    Player.prototype.onUpdate = function () {
    };
    Player.prototype.getSyncData = function () {
        return {
            unitType: 'Player',
            uid: this.uid,
            position: this.position,
            rotationY: this.rotation.y
        };
    };
    return Player;
}(GameUnit_1.GameUnit));
exports.Player = Player;
//# sourceMappingURL=Player.js.map