import { GameUnit } from '../bases/GameUnit';
import { Debug, float } from 'babylonjs';

export class StaticObject extends GameUnit {
    private model: BABYLON.Mesh;

    private timer: float = 0;

    onCreate() {
        this.model = BABYLON.MeshBuilder.CreateBox(this.name, {width: 1}, this.scene.core);
        this.model.parent = this;
    }

    onUpdate() {
        this.position.x = 10 * Math.sin(this.timer);
        this.timer += 0.01;

    }
}
