import { GameScene } from '../bases/GameScene';
import { Scene, MeshBuilder } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';
import 'babylonjs-materials';
import { Treasure } from '../units/Treasure';
import { SpawnPoint } from '../units/SpawnPoint';
import { Weapon } from '../units/Weapon';

export class CarryScene extends GameScene {
    private player: Player;
    private tower: StaticObject;
    private terrain: StaticObject;

    private treasure: Treasure;
    private spawnPont: SpawnPoint;

    onStart() {
        this.createEnvironment();

        this.tower = new StaticObject(this, 'tower', 'tower_1.babylon');
        this.spawnUnit(this.tower);
        this.tower.position = new BABYLON.Vector3(10, 0, -10);

        this.player = new Player(this, 'player');
        this.spawnUnit(this.player);

        this.terrain = new StaticObject(this, 'terrain', 'terrain.babylon');
        this.spawnUnit(this.terrain);

        this.treasure = new Treasure(this, 'treasure');
        this.spawnUnit(this.treasure);

        this.spawnPont = new SpawnPoint(this, 'spawn_point', this.treasure);
        this.spawnUnit(this.spawnPont);
        this.spawnPont.position.x = Math.random() * 20 - 10;
        this.spawnPont.position.z = Math.random() * 20 - 10;





        const vrHelper = this.core.createDefaultVRExperience({
            controllerMeshes: false
        });

        vrHelper.webVRCamera.onControllersAttachedObservable.add(
            evData => {
                const lCube = MeshBuilder.CreateBox('left hand', { size: 0.01 });
                vrHelper.webVRCamera.leftController.attachToMesh(lCube);
                const weapon = new Weapon(this, 'leftBanana', lCube);
                this.spawnUnit(weapon);
            });
    }

    onClose() {

    }

    onGui() {

    }

    onUpdate() {

    }

    onDraw() {
        this.core.render();
    }

    onResize() {

    }


    // Stuff
    createEnvironment() {
        const light = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(-1, -1, -1), this.core);

        const skyMaterial = new BABYLON.SkyMaterial('skyMaterial', this.core);
        skyMaterial.backFaceCulling = false;
        skyMaterial.useSunPosition = true;
        skyMaterial.sunPosition = new BABYLON.Vector3(100, 100, 100);

        const skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, this.core);
        skybox.material = skyMaterial;
    }
}
