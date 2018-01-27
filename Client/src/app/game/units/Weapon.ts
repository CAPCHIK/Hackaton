import { GameUnit } from '../bases/GameUnit';
import { Mesh, Scene } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { StaticObject } from './StaticObject';
import { Vector3, Tags, MeshBuilder, CustomMaterial, Color3 } from 'babylonjs-materials';
import { text } from '@angular/core/src/render3/instructions';

export class Weapon extends GameUnit {
    onUpdate() {

    }
    constructor(scene: GameScene, name: string, private baseMesh: Mesh, private secondMesh: Mesh) { super(scene, name); }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/weapon/', 'Banana.babylon', this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                newMeshes.forEach(M => {
                    M.parent = this.baseMesh;
                    Tags.AddTagsTo(M, 'banana');
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
        const ray = new BABYLON.Ray(
            this.baseMesh.absolutePosition,
            this.secondMesh.absolutePosition.subtract(this.baseMesh.absolutePosition),
            100);
        // const hit = this.scene.core.pickWithRay(ray, (M) => (M.name.indexOf('mob') !== -1) || (M.name.indexOf('node_id') !== -1));
        const hit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, 'enemy'));
        if (hit.hit) {
            console.log(hit.pickedMesh.name);
            hit.pickedMesh.dispose();
        } else {
            const nextHit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, '!banana'));
            if (nextHit.hit) {
                // const sp = MeshBuilder.CreateSphere('hit_sphere', {segments: 15, diameter: 0.1}, this.scene.core);
                // sp.position = nextHit.pickedPoint;
                // cnst mat = new CustomMaterial('customMaterial', this.scene.core);
                // mat.diffuseColor = Color3.Red();
                // sp.material = mat;
            }
        }
    }
}
