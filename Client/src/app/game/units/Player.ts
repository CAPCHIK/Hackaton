import { GameUnit } from '../bases/GameUnit';

export class Player extends GameUnit {
    private camera: BABYLON.Camera;

    onCreate() {
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene.core);
        this.camera.attachControl(this.scene.core.getEngine().getRenderingCanvas(), true);
    }

    onUpdate() {

    }
}
