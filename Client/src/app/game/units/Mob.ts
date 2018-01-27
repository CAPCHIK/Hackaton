import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';
import { Vector3, Engine, AbstractMesh } from 'babylonjs-materials';

export class Mob extends GameUnit {
    static knucklesMeshes: BABYLON.AbstractMesh[] = null;

    private target: GameUnit;
    private meshes: BABYLON.AbstractMesh[];

    constructor(scene: GameScene, name: string) {
        super(scene, name);

        if (Mob.knucklesMeshes == null) {
            BABYLON.SceneLoader.ImportMesh('', './assets/', 'knuckles.babylon', this.scene.core,
                (newMeshes, particleSystems, skeletons) => {
                    Mob.knucklesMeshes = newMeshes;

                    Mob.knucklesMeshes.forEach(mesh => {
                        mesh.isVisible = false;
                        BABYLON.Tags.AddTagsTo(mesh, 'enemy');
                    });
                });
        }
    }

    onCreate() {
        if (Mob.knucklesMeshes == null) {
            return;
        }

        this.meshes = new Array < AbstractMesh>();

        Mob.knucklesMeshes.forEach(mesh => {
            const newMesh = mesh.clone('mob_model', this, false);
            newMesh.isVisible = true;
            this.meshes.push(newMesh);
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
