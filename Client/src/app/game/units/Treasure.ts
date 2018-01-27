import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { AbstractMesh } from 'babylonjs';
import { CustomMaterial, Color3, MeshBuilder, Vector3 } from 'babylonjs-materials';

export class Treasure extends GameUnit {
    private meshes: BABYLON.AbstractMesh[];
    private hpIndicator: AbstractMesh;
    private hpMaterial: CustomMaterial;
    constructor(scene: GameScene, name: string) {
        super(scene, name, 100);
    }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/', 'bitcoin.babylon', this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                this.meshes = newMeshes;
                this.meshes.forEach(mesh => {
                    mesh.parent = this;
                    mesh.name = 'bitcoin';
                });
            });
        const customMaterial = new CustomMaterial('bitcointhp', this.scene.core);
        customMaterial.diffuseColor = Color3.Green();
        this.hpMaterial = customMaterial;
        this.RenderHp();
        this.translate(Vector3.Up(), 4);
    }
    onUpdate() {
        this.rotate(BABYLON.Vector3.Up(), 0.000000000000007 * new Date().getTime());
    }
    onDamageApplied(): void {
        this.RenderHp();
    }

    private RenderHp() {
        if (this.hpIndicator) {
            this.hpIndicator.dispose();
        }
        const part = this.hp / this.maxHp;
        this.hpIndicator = BABYLON.MeshBuilder.CreateDisc('bitcoinhp',
            { radius: 2.9, arc: part, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
            this.hpIndicator.rotate(Vector3.Forward(), Math.PI / 2);
        this.hpMaterial.diffuseColor = new Color3(1 - part, part, 0);
        this.hpIndicator.parent = this;
        this.hpIndicator.material = this.hpMaterial;
    }
}
