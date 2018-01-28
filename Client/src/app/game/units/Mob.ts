import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';
import { Vector3, Engine, AbstractMesh } from 'babylonjs-materials';
import { ResourceManager, Model } from '../stuff/ResourceManager';
import { Tags } from 'babylonjs';

export class Mob extends GameUnit {
    private target: GameUnit;

    private sounds: BABYLON.Sound[];
    private meshes: BABYLON.AbstractMesh[];
    private skeletons: BABYLON.Skeleton[];

    constructor(scene: GameScene, name: string) {
        super(scene, name);

        this.sounds = new Array<BABYLON.Sound>();
        this.skeletons = new Array<BABYLON.Skeleton>();
        this.meshes = new Array<BABYLON.AbstractMesh>();

        this.sounds.push(new BABYLON.Sound('deway', './assets/knuckles_dewey.mp3', this.scene.core));
        this.sounds.push(new BABYLON.Sound('qluck', './assets/knuckles_qlack.mp3', this.scene.core));
    }

    onCreate() {
        Tags.AddTagsTo(this, 'enemy');

        this.scene.resourceManager.load('knuckles', (model: Model) => {
            if (model == null || model.meshes == null) {
                return;
            }

            this.meshes = model.meshes;

            model.meshes.forEach(mesh => {
                const newMesh = mesh.clone(this.name + '_mesh', this);

                if (mesh.skeleton != null) {
                    newMesh.skeleton = mesh.skeleton.clone(this.name + '_skeleton', '');
                    this.scene.core.beginAnimation(newMesh.skeleton, 0, 63, true, 1);
                }

                Tags.AddTagsTo(newMesh, 'enemy');
                newMesh.isVisible = true;
            });
        });
    }

    onUpdate() {
        if (this.target == null) {
            return;
        }

        if (Math.random() < 0.001) {
            this.sounds[0].play();
            this.sounds[0].setPosition(this.position);
        } else if (Math.random() < 0.01) {
            this.sounds[1].play();
            this.sounds[1].setPosition(this.position);
        }

        let direction = new BABYLON.Vector3(this.target.position.x, 0, this.target.position.z).subtract(this.position);

        if (direction.length() < 2) {
            this.target.applyDamage(0.3);
            this.scene.deleteUnit(this);
            return;
        }

        direction = direction.normalize();

        this.position = this.position.add(direction.scale(0.01 * this.scene.core.getEngine().getDeltaTime()));
        this.position.y = 0.8; // + Math.sin(new Date().getTime() * 0.000001);

        const targetPosition = this.target.position.clone();
        targetPosition.y = this.position.y;
        this.lookAt(targetPosition);
    }

    setTarget(target: GameUnit) {
        this.target = target;
    }
}
