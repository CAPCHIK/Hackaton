import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { AbstractMesh } from 'babylonjs';
import { Model } from '../stuff/ResourceManager';
import { CustomMaterial, Color3, MeshBuilder, Vector3 } from 'babylonjs-materials';

export class Treasure extends GameUnit {
    private hpIndicator: AbstractMesh;
    private hpMaterial: CustomMaterial;
    constructor(scene: GameScene, name: string) {
        super(scene, name, 100);
    }

    onCreate() {
        this.scene.resourceManager.load('bitcoin', (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }

            model.meshes.forEach(mesh => {
                const newMesh = mesh.clone(this.name + '_mesh', this);
                newMesh.isVisible = true;
                this.scene.shadowGenerator.getShadowMap().renderList.push(newMesh);
            });

            const customMaterial = new CustomMaterial('bitcointhp', this.scene.core);
            customMaterial.diffuseColor = Color3.Green();
            this.hpMaterial = customMaterial;
            this.RenderHp();
            this.translate(Vector3.Up(), 4);
        });
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

    getSyncData() {
        return {
            unitType: 'Treasure',
            uid: this.uid,
            position: this.absolutePosition,
            hp: this.hp,
            maxHp: this.maxHp
        };
    }
}
