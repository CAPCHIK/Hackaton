import { GameUnit } from '../bases/GameUnit';
import { Vector3 } from 'babylonjs';
import { GameScene } from '../bases/GameScene';

export class Player extends GameUnit {
    private camera: BABYLON.Camera;

    constructor(scene: GameScene, name: string, private startPosition: Vector3) {
        super(scene, name);
    }

    onCreate() {
        this.camera = new BABYLON.FreeCamera('camera', this.startPosition, this.scene.core);
        this.camera.parent = this;
        this.camera.attachControl(this.scene.core.getEngine().getRenderingCanvas(), true);
    }

    onUpdate() {

    }
}
