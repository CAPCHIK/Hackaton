import { GameScene } from '../bases/GameScene';
import { Scene, MeshBuilder, Vector3 } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';
import 'babylonjs-materials';
import { Treasure } from '../units/Treasure';
import { SpawnPoint } from '../units/SpawnPoint';
import { Weapon } from '../units/Weapon';
import { ResourceManager } from '../stuff/ResourceManager';

export class CarryScene extends GameScene {
    private timer = 0;

    private player: Player;
    private tower: StaticObject;
    private terrain: StaticObject;

    private treasure: Treasure;

    private spawnPoints = new Array<SpawnPoint>();

    private mainLight: BABYLON.DirectionalLight;
    private mainLightOffset = new BABYLON.Vector3(50, 50, 50);

    private weapon: Weapon;

    private triggerPressed = false;
    private gunCreated = false;

    private startPosition = new BABYLON.Vector3(5, 4, -10);

    onStart() {
        this.mainLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-1, -1, -1), this.core);

        const light2 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0), this.core);

        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, this.mainLight);
        this.shadowGenerator.useExponentialShadowMap = true;
        this.shadowGenerator.forceBackFacesOnly = true;

        const skyMaterial = new BABYLON.SkyMaterial('skyMaterial', this.core);
        skyMaterial.backFaceCulling = false;
        skyMaterial.useSunPosition = true;
        skyMaterial.sunPosition = new BABYLON.Vector3(100, 100, 100);

        const skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, this.core);
        skybox.material = skyMaterial;

        this.resourceManager = new ResourceManager(this);

        this.resourceManager.bind('tower', 'tower_1.babylon', 'tower_1_diffuse.png');
        this.resourceManager.bind('terrain', 'terrain.babylon', 'terrain.png');
        this.resourceManager.bind('knuckles', 'knuckles.babylon');
        this.resourceManager.bind('nyan', 'nyan.babylon');
        this.resourceManager.bind('bitcoin', 'bitcoin.babylon');
        this.resourceManager.bind('banana', 'banana.babylon');

        this.tower = new StaticObject(this, 'tower', 'tower');
        this.spawnUnit(this.tower);
        this.tower.position = new BABYLON.Vector3(20, 0, -10);

        this.terrain = new StaticObject(this, 'terrain', 'terrain');
        this.spawnUnit(this.terrain);

        this.player = new Player(this, 'player');
        this.spawnUnit(this.player);

        this.treasure = new Treasure(this, 'treasure');
        this.spawnUnit(this.treasure);

        for (let i = 0; i < 5; ++i) {
            this.spawnPoints[i] = new SpawnPoint(this, 'spawn_point', this.treasure);
            this.spawnUnit(this.spawnPoints[i]);
        }

        //
        this.mainCamera = new BABYLON.FreeCamera('camera', this.startPosition, this.core);
        this.mainCamera.attachControl(this.core.getEngine().getRenderingCanvas(), true);
        this.player.parent = this.mainCamera;

        // create vr
        const vrHelper = this.core.createDefaultVRExperience({
            controllerMeshes: false
        });

        vrHelper.webVRCamera.onControllersAttachedObservable.add(evData => {
            this.mainCamera = vrHelper.webVRCamera;
            this.mainCamera.position = this.startPosition;
            this.player.parent = this.mainCamera;

            if (this.gunCreated === false) {
                const cube = MeshBuilder.CreateBox('left_hand', { width: 0.2, depth: 0.1, height: 0.3 });
                cube.isVisible = false;

                vrHelper.webVRCamera.rightController.attachToMesh(cube);
                this.weapon = new Weapon(this, 'banana', cube);
                this.spawnUnit(this.weapon);

                this.gunCreated = true;
            }

            vrHelper.webVRCamera.rightController.onTriggerStateChangedObservable.add(evdata => {
                if (evdata.pressed && !this.triggerPressed) {
                    this.weapon.shoot();
                    this.triggerPressed = true;
                } else if (!evdata.pressed && this.triggerPressed) {
                    this.triggerPressed = false;
                }
            });
        });
    }

    onClose() {

    }

    onGui() {

    }

    onUpdate() {
        this.mainLight.position = this.player.absolutePosition.add(this.mainLightOffset);

        if (this.timer > 2) {
            for (let i = 0; i < this.spawnPoints.length; ++i) {
                this.spawnPoints[i].position = new BABYLON.Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
            }
        }

        this.timer += 0.1;
    }

    onDraw() {
        this.core.render();
    }

    onResize() {

    }
}
