import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { AbstractMesh } from 'babylonjs';
import { Model } from '../stuff/ResourceManager';

export class Treasure extends GameUnit {
    private hpIndicator: AbstractMesh;

    constructor(scene: GameScene, name: string) {
        super(scene, name);
    }

    onCreate() {
        this.scene.resourceManager.load('bitcoin', (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }

            model.meshes.forEach(mesh => {
                const newMesh = mesh.clone(this.name + '_mesh', this, false);
                newMesh.isVisible = true;
            });
        });

        this.hpIndicator = BABYLON.MeshBuilder.CreateDisc('bitcoin htp indicator',
            {radius: 4, arc: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
        this.hpIndicator.parent = this;
    }

    onUpdate() {
        this.position.y = 0.7 * Math.sin(0.001 * new Date().getTime());
        this.rotate(BABYLON.Vector3.Up(), 0.000000000000007 * new Date().getTime() );
    }
}
