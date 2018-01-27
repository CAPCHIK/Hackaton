import { GameUnit } from '../bases/GameUnit';
import { Debug, float } from 'babylonjs';
import { GameScene } from '../bases/GameScene';

export class StaticObject extends GameUnit {
    public meshes: BABYLON.AbstractMesh[];
    public material: BABYLON.PBRMetallicRoughnessMaterial;

    constructor(scene: GameScene, name: string, private modelName: string) {
        super(scene, name);
    }

    onCreate() {
        this.material = new BABYLON.PBRMetallicRoughnessMaterial('pbr', this.scene.core);

        BABYLON.SceneLoader.ImportMesh('', './assets/', this.modelName, this.scene.core,
        (newMeshes, particleSystems, skeletons) => {
            this.meshes = newMeshes;

            this.meshes.forEach(mesh => {
                mesh.parent = this;
                mesh.material = this.material;
            });
        });
    }

    onUpdate() {
    }
}
