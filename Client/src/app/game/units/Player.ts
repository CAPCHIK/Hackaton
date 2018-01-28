import { GameUnit } from '../bases/GameUnit';
import { Vector3 } from 'babylonjs';
import { GameScene } from '../bases/GameScene';

export class Player extends GameUnit {
    constructor(scene: GameScene, name: string) {
        super(scene, name);
    }

    onCreate() {
    }

    onUpdate() {

    }

    getSyncData() {
        return {
            unitType: 'Player',
            uid: this.uid,
            position: (this.parent as BABYLON.Camera).globalPosition,
            rotationY: 0
        };
    }
}
