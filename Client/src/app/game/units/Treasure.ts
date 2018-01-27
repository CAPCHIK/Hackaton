import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { setTimeout } from 'timers';
import { AbstractMesh } from 'babylonjs';

export class Treasure extends GameUnit {
    private meshes: BABYLON.AbstractMesh[];
    private hpIndicator: AbstractMesh;
    constructor(scene: GameScene, name: string) {
        super(scene, name);
    }

    onCreate() {
        BABYLON.SceneLoader.ImportMesh('', './assets/', 'bitcoin.babylon', this.scene.core,
            (newMeshes, particleSystems, skeletons) => {
                this.meshes = newMeshes;

                this.meshes.forEach(mesh => {
                    mesh.parent = this;
                    mesh.name = 'bitcoin';
                    //  mesh.material = new BABYLON.PBRMetallicRoughnessMaterial('pbr', this.scene.core);
                });
            });
            this.hpIndicator = BABYLON.MeshBuilder.CreateDisc('bitcoin htp indicator',
                {radius: 4, arc: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
                this.hpIndicator.position.z -= 0.5;
            this.hpIndicator.parent = this;
    }

    onUpdate() {
        this.position.y = 0.7 * Math.sin(0.001 * new Date().getTime());
        this.rotate(BABYLON.Vector3.Up(), 0.000000000000007 * new Date().getTime() );
    }
}
