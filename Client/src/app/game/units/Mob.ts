import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';
import { Vector3, Engine, AbstractMesh } from 'babylonjs-materials';
import { ResourceManager, Model } from '../stuff/ResourceManager';

export class Mob extends GameUnit {
    private target: GameUnit;

    constructor(scene: GameScene, name: string) {
        super(scene, name);
    }

    onCreate() {
        this.scene.resourceManager.load('knuckles', (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }

            model.meshes.forEach(mesh => {
                const newMesh = mesh.clone(this.name + '_mesh', this);
                newMesh.isVisible = true;
            });
        });
    }

    onUpdate() {
        if (this.target == null) {
            return;
        }

        let direction = new BABYLON.Vector3(this.target.position.x, 0, this.target.position.z).subtract(this.position);

        if (direction.length() < 2) {
            this.scene.deleteUnit(this);
            return;
        }

        direction = direction.normalize();

        this.position = this.position.add(direction.scale(0.1));
        this.position.y = 0.8;

        const targetPosition = this.target.position;
        targetPosition.y = this.position.y;
        this.lookAt(targetPosition);
    }

    setTarget(target: GameUnit) {
        this.target = target;
    }
}
