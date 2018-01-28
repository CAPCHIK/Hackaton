import { GameUnit } from '../bases/GameUnit';
import { Debug, float } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { Model } from '../stuff/ResourceManager';

export class StaticObject extends GameUnit {
    constructor(scene: GameScene, name: string, private modelName: string) {
        super(scene, name);
    }

    onCreate() {
        this.scene.resourceManager.load(this.modelName, (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }

            model.meshes.forEach(mesh => {
                const newMesh = mesh.clone(this.name + '_mesh', this, false);
                newMesh.isVisible = true;

                newMesh.receiveShadows = true;
            });
        });
    }

    onUpdate() {
    }

    getSyncData() {
        return {};
    }
}
