import { GameUnit } from '../bases/GameUnit';
import { Mesh, MeshBuilder, Vector3, Tags } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { CylinderGeometry, CustomMaterial, Color3 } from 'babylonjs-materials';

export class Teleport extends GameUnit {

    private floor: Mesh;
    private cylynder: Mesh;
    constructor(protected scene: GameScene, name: string, position: Vector3) {
        super(scene, name);
        this.position.copyFrom(position);
    }

    onCreate() {
        this.floor = MeshBuilder.CreateDisc('Teleport_floor_' + this.uid, { radius: 3, sideOrientation: Mesh.DOUBLESIDE });
        Tags.AddTagsTo(this.floor, 'teleport');
        this.floor.parent = this;
        this.floor.rotate(new Vector3(1, 0, 0), Math.PI / 2);
        this.position.y += 0.3;
        this.cylynder = MeshBuilder.CreateCylinder('Teleport_cylinder_' + this.uid, {height: 8, diameter: 6}, this.scene.core);
        this.cylynder.position.y += 4;
        this.cylynder.parent = this;
        const material = new CustomMaterial('Teleport_material', this.scene.core);
        material.diffuseColor = Color3.Blue();
        this.cylynder.material = material;
        material.alpha = 0.2;
    }

    onUpdate() {

    }

    getSyncData() {
        return {};
    }
}
