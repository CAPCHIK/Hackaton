import { GameScene } from '../bases/GameScene';
import { Scene, MeshBuilder, Vector3 } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';
import 'babylonjs-materials';
import { Treasure } from '../units/Treasure';
import { SpawnPoint } from '../units/SpawnPoint';
import { Weapon } from '../units/Weapon';

export class CarryScene extends GameScene {
    private timer = 0;

    private player: Player;
    private tower: StaticObject;
    private terrain: StaticObject;

    private treasure: Treasure;

    private spawnPoints = new Array<SpawnPoint>();

    onStart() {
        this.createEnvironment();

        this.tower = new StaticObject(this, 'tower', 'tower_1.babylon');
        this.spawnUnit(this.tower);
        this.tower.material.baseTexture = new BABYLON.Texture("./assets/tower_1_diffuse.png", this.core);
        this.tower.position = new BABYLON.Vector3(10, 0, -10);

        this.player = new Player(this, 'player', new Vector3(10, 7, -10));
        this.spawnUnit(this.player);

        this.terrain = new StaticObject(this, 'terrain', 'terrain.babylon');
        this.spawnUnit(this.terrain);
        this.terrain.material.baseTexture = new BABYLON.Texture("./assets/5.png", this.core);

        this.treasure = new Treasure(this, 'treasure');
        this.spawnUnit(this.treasure);

        for (let i = 0; i < 2; ++i) {
            this.spawnPoints[i] = new SpawnPoint(this, 'spawn_point', this.treasure);
            this.spawnUnit(this.spawnPoints[i]);
        }

        const vrHelper = this.core.createDefaultVRExperience({
            controllerMeshes: false
        });

        vrHelper.webVRCamera.onControllersAttachedObservable.add(
            evData => {
                const lCube = MeshBuilder.CreateBox('left hand', { size: 0.01 });
                const dCube = MeshBuilder.CreateBox('left hand debug', { size: 0.01 });
                dCube.parent = lCube;
                dCube.position.z -= 0.3;
                vrHelper.webVRCamera.rightController.attachToMesh(lCube);
                const weapon = new Weapon(this, 'leftBanana', lCube, dCube);
                this.spawnUnit(weapon);
                let val = 0;
                vrHelper.webVRCamera.rightController.onTriggerStateChangedObservable.add(evdata => {
                    val += evdata.value;
                    if (val > 0.8) {
                        weapon.shoot();
                        val = 0;
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
                this.spawnPoints[i].position = new BABYLON.Vector3(Math.random() * 50 - 25, 0, Math.random() * 50 - 25);
            }
        }

        this.timer += 0.1;
    }

    onDraw() {
        this.core.render();
    }

    onResize() {

    }


    // Stuff
    createEnvironment() {
        const light = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-1, -1, -1), this.core);
        const light2 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0), this.core);

        const skyMaterial = new BABYLON.SkyMaterial('skyMaterial', this.core);
        skyMaterial.backFaceCulling = false;
        skyMaterial.useSunPosition = true;
        skyMaterial.sunPosition = new BABYLON.Vector3(100, 100, 100);

        const skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, this.core);
        skybox.material = skyMaterial;

    }
}
