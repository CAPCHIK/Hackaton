import { GameScene } from '../bases/GameScene';
import { Scene, MeshBuilder, Vector3 } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';
import 'babylonjs-materials';
import { Treasure } from '../units/Treasure';
import { SpawnPoint } from '../units/SpawnPoint';
import { Weapon } from '../units/Weapon';
import { ResourceManager } from '../stuff/ResourceManager';
import { Teleport } from '../units/Teleport';

export class CarryScene extends GameScene {
    private timer = 0;

    private player: Player;
    private tower: StaticObject;
    private terrain: StaticObject;

    private treasure: Treasure;

    private spawnPoints = new Array<SpawnPoint>();

    private mainLight: BABYLON.DirectionalLight;
    private mainLightOffset = new BABYLON.Vector3(50, 50, 50);

    private weaponLeft: Weapon;
    private weaponRight: Weapon;

    private rightTriggerPressed = false;
    private leftTriggerPressed = false;
    private teleportButtonPressed = false;
    private gunCreated = false;

    private startPosition = new BABYLON.Vector3(5, 4, -10);

    onStart() {
        this.mainLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-1, -1, -1), this.core);
        this.mainLight.position = this.mainLightOffset;

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
        // this.resourceManager.bind('pepe', 'pepe.babylon', );

        this.tower = new StaticObject(this, 'tower', 'tower');
        this.spawnUnit(this.tower);
        this.tower.position = new BABYLON.Vector3(20, 0, -10);

        this.terrain = new StaticObject(this, 'terrain', 'terrain');
        this.spawnUnit(this.terrain);

        this.player = new Player(this, 'player');
        this.spawnUnit(this.player);

        this.treasure = new Treasure(this, 'treasure');
        this.spawnUnit(this.treasure);

        for (let i = 0; i < 6; ++i) {
            this.spawnPoints[i] = new SpawnPoint(this, 'spawn_point', this.treasure);
            this.spawnUnit(this.spawnPoints[i]);
        }

        //
        this.mainCamera = new BABYLON.FreeCamera('camera', this.startPosition, this.core);
        this.mainCamera.attachControl(this.core.getEngine().getRenderingCanvas(), true);
        this.player.parent = this.mainCamera;


        //
        const teleportCount = 3;
        for (let i = 0; i < 3; ++i) {
            const angle = Math.PI * 2 * i / teleportCount;

            const tp = new Teleport(this, 'first_tp', (new BABYLON.Vector3(Math.cos(angle), 0, Math.sin(angle)).scale(25)));
            this.spawnUnit(tp);
        }

        const nbPoints = 20;                     // the number of points between each Vector3 control points
        const points = [
            new Vector3(0, 0, 0),
            new Vector3(0, 6, 0),
            new Vector3(0, 6, 6),
            new Vector3(0, 3, 12),
            new Vector3(10, 3, 12),
        ];
        points.push(points[0]);
        const catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(points, nbPoints);
        const catmullRomSpline = BABYLON.Mesh.CreateLines('catmullRom', catmullRom.getPoints(), this.core);
        console.log(catmullRom.getPoints());
        const path = catmullRom.getPoints();
        const box = MeshBuilder.CreateBox('redBox', { size: 2 });
        let r = 0;

        setInterval(() => {
            if (box.position.equalsWithEpsilon(path[r % (path.length)], 0.011)) {
                r++;
            }
            const target = path[r % (path.length)];
            box.lookAt(target);
            box.position.copyFrom(target.subtract(box.position).normalize().scale(0.01).add(box.position));
        }, 1);
        // create vr
        const vrHelper = this.core.createDefaultVRExperience({
            controllerMeshes: false
        });

        vrHelper.webVRCamera.onControllersAttachedObservable.add(evData => {
            this.mainCamera = vrHelper.webVRCamera;
            this.mainCamera.position = this.startPosition;
            this.player.parent = this.mainCamera;

            if (this.gunCreated === false) {
                const cubeRight = MeshBuilder.CreateBox('right_hand', { width: 0.2, depth: 0.1, height: 0.3 });
                cubeRight.isVisible = false;

                vrHelper.webVRCamera.rightController.attachToMesh(cubeRight);
                this.weaponRight = new Weapon(this, 'banana1', cubeRight, this.player);
                this.spawnUnit(this.weaponRight);

                const cubeleft = MeshBuilder.CreateBox('left_hand', { width: 0.2, depth: 0.1, height: 0.3 });
                cubeleft.isVisible = false;

                vrHelper.webVRCamera.leftController.attachToMesh(cubeleft);
                this.weaponLeft = new Weapon(this, 'banana2', cubeleft, this.player);
                this.spawnUnit(this.weaponLeft);

                this.gunCreated = true;
            }

            vrHelper.webVRCamera.rightController.onTriggerStateChangedObservable.add(evdata => {
                if (evdata.pressed && !this.rightTriggerPressed) {
                    this.weaponRight.shoot();
                    this.rightTriggerPressed = true;
                } else if (!evdata.pressed && this.rightTriggerPressed) {
                    this.rightTriggerPressed = false;
                }
            });

            vrHelper.webVRCamera.leftController.onTriggerStateChangedObservable.add(evdata => {
                if (evdata.pressed && !this.leftTriggerPressed) {
                    this.weaponLeft.shoot();
                    this.leftTriggerPressed = true;
                } else if (!evdata.pressed && this.leftTriggerPressed) {
                    this.leftTriggerPressed = false;
                }
            });

            vrHelper.webVRCamera.rightController.onMainButtonStateChangedObservable.add(evdata => {
                if (evdata.pressed && !this.teleportButtonPressed) {
                    this.weaponRight.enableTeleport();
                    this.teleportButtonPressed = true;
                } else if (!evdata.pressed && this.teleportButtonPressed) {
                    this.weaponRight.makeTeleport();
                    this.teleportButtonPressed = false;
                }
            });
        });
    }

    onClose() {

    }

    onGui() {

    }

    onUpdate() {
        if (this.timer > 2) {
            for (let i = 0; i < this.spawnPoints.length; ++i) {
                this.spawnPoints[i].position.copyFrom(new BABYLON.Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50));
            }
        }

        this.timer += 0.01 * this.core.getEngine().getDeltaTime();
    }

    onDraw() {
        this.core.render();
    }

    onResize() {

    }
}
