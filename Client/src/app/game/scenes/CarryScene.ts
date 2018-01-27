import { GameScene } from '../bases/GameScene';
import { Scene } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';
import 'babylonjs-materials';

export class CarryScene extends GameScene {
    private player: Player;
    private tower: StaticObject;
    private terrain: StaticObject;

    onStart() {
        this.createEnvironment();

        this.tower = new StaticObject(this, 'tower', 'tower_1.babylon');
        this.spawnUnit(this.tower);

        this.player = new Player(this, 'player');
        this.spawnUnit(this.player);

        this.terrain = new StaticObject(this, 'terrain', 'terrain.babylon');
        this.spawnUnit(this.terrain);
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
