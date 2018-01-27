import { GameUnit } from '../bases/GameUnit';
import { Mesh, Scene } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { StaticObject } from './StaticObject';
import { Vector3, Tags, MeshBuilder, CustomMaterial, Color3, AbstractMesh } from 'babylonjs-materials';
import { text } from '@angular/core/src/render3/instructions';
import { Model } from '../stuff/ResourceManager';

export class Weapon extends GameUnit {
    private weapon: AbstractMesh;

    constructor(scene: GameScene, name: string, private baseMesh: Mesh) {
        super(scene, name);
    }

    onCreate() {
        this.scene.resourceManager.load('banana', (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }
            
            model.meshes.forEach(mesh => {
                mesh.parent = this.baseMesh;
                mesh.position = this.position;
                mesh.rotate(Vector3.Up(), Math.PI / 2);
                mesh.rotate(Vector3.Right(), Math.PI);
                mesh.rotate(Vector3.Forward(), -Math.PI / 2);
                mesh.scaling = mesh.scaling.scale(0.1);
                mesh.isVisible = true;
                Tags.AddTagsTo(mesh, 'banana');
            });

            this.weapon = model.meshes[0];
        });
    }

    onUpdate() {
    }

    shoot() {
        const direction = this.weapon.getDirection(Vector3.Up().add(Vector3.Right().negate().scale(1.7))).normalize();
        const right = BABYLON.Vector3.Cross(direction, BABYLON.Vector3.Up()).normalize();
        const up = BABYLON.Vector3.Cross(right, direction).normalize();

        const ray = new BABYLON.Ray(this.baseMesh.absolutePosition.add(up.scale(0.05)), direction);
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(this.scene.core, new BABYLON.Color3(1, 1, 0.1));

        // const hit = this.scene.core.pickWithRay(ray, (M) => (M.name.indexOf('mob') !== -1) || (M.name.indexOf('node_id') !== -1));
        const hit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, 'enemy'));
        if (hit.hit) {
            console.log(hit.pickedMesh.name);
            this.scene.deleteUnit(hit.pickedMesh.parent as GameUnit);
        }/* else {
            const nextHit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, '!banana'));
            if (nextHit.hit) {
                // const sp = MeshBuilder.CreateSphere('hit_sphere', {segments: 15, diameter: 0.1}, this.scene.core);
                // sp.position = nextHit.pickedPoint;
                // cnst mat = new CustomMaterial('customMaterial', this.scene.core);
                // mat.diffuseColor = Color3.Red();
                // sp.material = mat;
            }
        }*/
    }
}
