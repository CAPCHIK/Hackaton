import { GameUnit } from '../bases/GameUnit';
import { Treasure } from './Treasure';
import { GameScene } from '../bases/GameScene';
import { Vector3, Engine, AbstractMesh } from 'babylonjs-materials';
import { ResourceManager, Model } from '../stuff/ResourceManager';
import { Tags } from 'babylonjs';

export enum MobType {
    Knuckles = 0,
    Nyan = 1,
    Pepe = 2,
}

export class Mob extends GameUnit {
    static sounds: BABYLON.Sound[];

    private target: GameUnit;

    constructor(scene: GameScene, name: string, private mobType: MobType) {
        super(scene, name);

        if (Mob.sounds == null) {
            Mob.sounds = new Array<BABYLON.Sound>();
            Mob.sounds.push(new BABYLON.Sound('deway', './assets/knuckles_dewey.mp3', this.scene.core));
            Mob.sounds.push(new BABYLON.Sound('qluck', './assets/knuckles_qlack.mp3', this.scene.core));
        }
    }

    onCreate() {
        Tags.AddTagsTo(this, 'enemy');

        switch (this.mobType) {
            case MobType.Knuckles:
                this.scene.resourceManager.load('knuckles', (model: Model) => {
                    if (model == null || model.meshes == null) {
                        return;
                    }

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
                break;

            case MobType.Nyan:
                this.scene.resourceManager.load('nyan', (model: Model) => {
                    if (model == null || model.meshes == null) {
                        return;
                    }

                    model.meshes.forEach(mesh => {
                        const newMesh = mesh.clone(this.name + '_mesh', this);

                        Tags.AddTagsTo(newMesh, 'enemy');
                        newMesh.isVisible = true;

                        this.scene.shadowGenerator.getShadowMap().renderList.push(newMesh);
                    });
                });
                break;

            case MobType.Pepe:
                this.scene.resourceManager.load('pepe', (model: Model) => {
                    if (model == null || model.meshes == null) {
                        return;
                    }

                    model.meshes.forEach(mesh => {
                        const newMesh = mesh.clone(this.name + '_mesh', this);

                        Tags.AddTagsTo(newMesh, 'enemy');
                        newMesh.isVisible = true;

                        if (mesh.skeleton != null) {
                            newMesh.skeleton = mesh.skeleton.clone(this.name + '_skeleton', '');
                            this.scene.core.beginAnimation(newMesh.skeleton, 0, 100, true, 1);
                        }

                        this.scene.shadowGenerator.getShadowMap().renderList.push(newMesh);
                    });
                });
                break;
        }
    }

    onUpdate() {
        if (this.target == null) {
            return;
        }

        if (this.mobType === MobType.Knuckles) {
            if (Mob.sounds.length > 0 && Math.random() < 0.001) {
                Mob.sounds[0].play();
                Mob.sounds[0].setPosition(this.position);
            } else if (Mob.sounds.length > 1 && Math.random() < 0.01) {
                Mob.sounds[1].play();
                Mob.sounds[1].setPosition(this.position);
            }
        }

        let direction = new BABYLON.Vector3(this.target.position.x, 0, this.target.position.z).subtract(this.position);

        if (direction.length() <= 2) {
            this.target.applyDamage(0.3);
            this.scene.deleteUnit(this);
            return;
        }

        direction = direction.normalize();

        this.position = this.position.add(direction.scale(0.01 * this.scene.core.getEngine().getDeltaTime()));

        if (this.mobType !== MobType.Pepe) {
            this.position.y = 0.9 + 0.4 * Math.sin(new Date().getTime() * 0.01 + this.uid);
        } else {
            this.position.y = 0.9 + 0.4 * Math.sin(new Date().getTime() * 0.01 + this.uid);
        }

        const targetPosition = this.target.position.clone();
        targetPosition.y = this.position.y;
        this.lookAt(targetPosition);
    }

    setTarget(target: GameUnit) {
        this.target = target;
    }

    getSyncData() {
        return {
            unitType: 'Mob',
            uid: this.uid,
            mobType: this.mobType,
            position: this.position,
            rotationY: this.rotation.y,
            hp: this.hp,
            maxHp: this.maxHp
        };
    }
}
