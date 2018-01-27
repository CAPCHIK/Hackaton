import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';

export class Mob extends GameUnit {
    private target: GameUnit;
    private meshes: BABYLON.AbstractMesh[];

    constructor(scene: GameScene, name: string) {
        super(scene, name);
    }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/', 'knuckles.babylon', this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                this.meshes = newMeshes;

                this.meshes.forEach(mesh => {
                    mesh.parent = this;
                    mesh.material = new BABYLON.PBRMetallicRoughnessMaterial('pbr', this.scene.core);
                });
            });
    }

    onUpdate() {
        if (this.target == null) {
            return;
        }

        const direction = this.target.position.subtract(this.position).normalize();
        this.position = this.position.add(direction.scale(0.01));
    }

    setTarget(target: GameUnit) {
        this.target = target;
    }
}
