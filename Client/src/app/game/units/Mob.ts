import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';
import { Vector3 } from 'babylonjs-materials';

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
                    mesh.position = this.position;
                    mesh.material = new BABYLON.PBRMetallicRoughnessMaterial('pbr', this.scene.core);
                });

                this.meshes[1].rotation.x = Math.PI / 2;
                this.meshes[2].rotation.x = Math.PI / 2;
            });

        this.rotation.x -= Math.PI / 2;
        this.scaling = this.scaling.scale(0.01);
    }

    onDestroy() {
        this.meshes.forEach(mesh => {
            mesh.dispose();
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

        this.position = this.position.add(direction.scale(0.01));
        this.position.y = 1.55;

        this.rotation = new BABYLON.Vector3(-Math.PI / 2, 
            Math.acos(BABYLON.Vector3.Dot(direction, this.getDirection(new Vector3(-1, 0, 0)))), 0);
    }

    setTarget(target: GameUnit) {
        this.target = target;
    }
}
