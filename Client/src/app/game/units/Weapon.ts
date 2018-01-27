import { GameUnit } from '../bases/GameUnit';
import { Mesh, Scene } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { StaticObject } from './StaticObject';
import { Vector3 } from 'babylonjs-materials';

export class Weapon extends GameUnit {
    onUpdate() {

    }
    constructor(scene: GameScene, name: string, private baseMesh: Mesh) { super(scene, name); }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/weapon/', 'Banana.babylon', this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                newMeshes.forEach(M => {
                    M.parent = this.baseMesh;
                    const rad = (a) => a / 180 * Math.PI;
                    M.rotate(new Vector3(1, 0, 0), rad(90));
                    M.rotate(new Vector3(0, 0, 1), rad(90));
                    M.rotate(new Vector3(1, 0, 0), rad(180));
                    M.scaling = M.scaling.scale(4);
                    M.position.x += 2.5;
                    M.position.z += 1.5;
                    M.position.y += 0.3;
                    const myMaterial = new BABYLON.StandardMaterial('myMaterial', this.scene.core);
                    myMaterial.wireframe = true;
                    M.material = myMaterial;
                });
            });
    }

    public shoot(): void {
        console.log('SHOOT');
        const ray = new BABYLON.Ray(this.baseMesh.absolutePosition, this.baseMesh.absolutePosition.add(new Vector3(0, 0, -1)), 100);
        const hit = this.scene.core.pickWithRay(ray, (M) => M.name.indexOf('node_id') !== -1);
        if (hit.hit) {
            hit.pickedMesh.dispose();
        }
    }
}
