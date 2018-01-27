import { GameUnit } from '../bases/GameUnit';
import { Debug, float } from 'babylonjs';
import { GameScene } from '../bases/GameScene';

export class StaticObject extends GameUnit {
    private meshes: BABYLON.AbstractMesh[];

    constructor(scene: GameScene, name: string, private modelName: string) {
        super(scene, name);
    }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/', this.modelName, this.scene.core,
        (newMeshes, particleSystems, skeletons) => {
            this.meshes = newMeshes;

            this.meshes.forEach(mesh => {
                mesh.parent = this;
                mesh.material = new BABYLON.PBRMetallicRoughnessMaterial('pbr', this.scene.core);
            });
        });
    }

    onUpdate() {
    }
}
