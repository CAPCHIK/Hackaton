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
var GameScene_1 = require("../bases/GameScene");
var babylonjs_1 = require("babylonjs");
var StaticObject_1 = require("../units/StaticObject");
var Player_1 = require("../units/Player");
require("babylonjs-materials");
var Treasure_1 = require("../units/Treasure");
var SpawnPoint_1 = require("../units/SpawnPoint");
var Weapon_1 = require("../units/Weapon");
var ResourceManager_1 = require("../stuff/ResourceManager");
var CarryScene = /** @class */ (function (_super) {
    __extends(CarryScene, _super);
    function CarryScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.spawnPoints = new Array();
        _this.triggerPressed = false;
        _this.gunCreated = false;
        return _this;
    }
    CarryScene.prototype.onStart = function () {
        var _this = this;
        var light1 = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-1, -1, -1), this.core);
        light1.position = new BABYLON.Vector3(50, 50, 50);
        var light2 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0), this.core);
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
        this.shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;
        var skyMaterial = new BABYLON.SkyMaterial('skyMaterial', this.core);
        skyMaterial.backFaceCulling = false;
        skyMaterial.useSunPosition = true;
        skyMaterial.sunPosition = new BABYLON.Vector3(100, 100, 100);
        var skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, this.core);
        skybox.material = skyMaterial;
        this.resourceManager = new ResourceManager_1.ResourceManager(this);
        this.resourceManager.bind('tower', 'tower_1.babylon', 'tower_1_diffuse.png');
        this.resourceManager.bind('terrain', 'terrain.babylon', 'terrain.png');
        this.resourceManager.bind('knuckles', 'knuckles.babylon');
        this.resourceManager.bind('nyan', 'nyan.babylon');
        this.resourceManager.bind('bitcoin', 'bitcoin.babylon');
        this.resourceManager.bind('banana', 'banana.babylon');
        this.tower = new StaticObject_1.StaticObject(this, 'tower', 'tower');
        this.spawnUnit(this.tower);
        this.tower.position = new BABYLON.Vector3(20, 0, -10);
        this.terrain = new StaticObject_1.StaticObject(this, 'terrain', 'terrain');
        this.spawnUnit(this.terrain);
        this.player = new Player_1.Player(this, 'player', new babylonjs_1.Vector3(5, 2, -10));
        this.spawnUnit(this.player);
        light1.parent = this.player;
        this.treasure = new Treasure_1.Treasure(this, 'treasure');
        this.spawnUnit(this.treasure);
        for (var i = 0; i < 5; ++i) {
            this.spawnPoints[i] = new SpawnPoint_1.SpawnPoint(this, 'spawn_point', this.treasure);
            this.spawnUnit(this.spawnPoints[i]);
        }
        //
        this.socket.freezeMobs.subscribe(function (vector) {
        }, function (error) {
        });
        // create vr
        var vrHelper = this.core.createDefaultVRExperience({
            controllerMeshes: false
        });
        this.player.parent = vrHelper.webVRCamera;
        vrHelper.webVRCamera.onControllersAttachedObservable.add(function (evData) {
            if (_this.gunCreated === false) {
                var cube = babylonjs_1.MeshBuilder.CreateBox('left_hand', { width: 0.2, depth: 0.1, height: 0.3 });
                cube.isVisible = false;
                vrHelper.webVRCamera.rightController.attachToMesh(cube);
                _this.weapon = new Weapon_1.Weapon(_this, 'banana', cube);
                _this.spawnUnit(_this.weapon);
                _this.gunCreated = true;
            }
            vrHelper.webVRCamera.rightController.onTriggerStateChangedObservable.add(function (evdata) {
                if (evdata.pressed && !_this.triggerPressed) {
                    _this.weapon.shoot();
                    _this.triggerPressed = true;
                }
                else if (!evdata.pressed && _this.triggerPressed) {
                    _this.triggerPressed = false;
                }
            });
        });
    };
    CarryScene.prototype.onClose = function () {
    };
    CarryScene.prototype.onGui = function () {
    };
    CarryScene.prototype.onUpdate = function () {
        if (this.timer > 2) {
            for (var i = 0; i < this.spawnPoints.length; ++i) {
                this.spawnPoints[i].position = new BABYLON.Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
            }
        }
        this.timer += 0.1;
    };
    CarryScene.prototype.onDraw = function () {
        this.core.render();
    };
    CarryScene.prototype.onResize = function () {
    };
    return CarryScene;
}(GameScene_1.GameScene));
exports.CarryScene = CarryScene;
//# sourceMappingURL=CarryScene.js.map