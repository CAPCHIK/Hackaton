import { GameUnit } from '../bases/GameUnit';
import { Mesh, Scene } from 'babylonjs';
import { GameScene } from '../bases/GameScene';
import { StaticObject } from './StaticObject';
import { Vector3, Tags, MeshBuilder, CustomMaterial, Color3, AbstractMesh } from 'babylonjs-materials';
import { Model } from '../stuff/ResourceManager';

export class Weapon extends GameUnit {
    static particleSystem: BABYLON.ParticleSystem;
    static phontain: BABYLON.AbstractMesh;

    private weapon: AbstractMesh;

    constructor(scene: GameScene, name: string, private baseMesh: Mesh) {
        super(scene, name);

        if (Weapon.phontain == null) {
            Weapon.phontain = BABYLON.MeshBuilder.CreateSphere('foutain', {
                diameter: 1
            }, this.scene.core);
            Weapon.phontain.isVisible = false;
        }
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

    createParticles(fountain: AbstractMesh) {
        const particleSystem = new BABYLON.ParticleSystem('particles', 100, this.scene.core);

        // Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture('./assets/flare.png', this.scene.core);

        // Where the particles come from
        particleSystem.emitter = fountain; // the starting object, the emitter
        particleSystem.createDirectedSphereEmitter(1.2, new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(2, 5, 2));

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.manualEmitCount = 100;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        particleSystem.disposeOnStop = true;

        particleSystem.targetStopDuration = 1;

        particleSystem.onAnimationEnd = () => {
            fountain.dispose();
        };

        // Start the particle system
        particleSystem.start();
    }

    shoot() {
        const direction = this.weapon.getDirection(Vector3.Up().add(Vector3.Right().negate().scale(1.7))).normalize();
        const right = BABYLON.Vector3.Cross(direction, BABYLON.Vector3.Up()).normalize();
        const up = BABYLON.Vector3.Cross(right, direction).normalize();

        const ray = new BABYLON.Ray(this.baseMesh.absolutePosition.add(up.scale(0.05)), direction);

        // const hit = this.scene.core.pickWithRay(ray, (M) => (M.name.indexOf('mob') !== -1) || (M.name.indexOf('node_id') !== -1));
        const hit = this.scene.core.pickWithRay(ray, (M) => Tags.MatchesQuery(M, 'enemy'));
        if (hit.hit) {
            const phontain = Weapon.phontain.clone('particles', null);
            phontain.position = hit.pickedPoint;
            phontain.isVisible = false;

            this.createParticles(phontain);

            const lines = BABYLON.MeshBuilder.CreateLines('lines', { points: [ray.origin, hit.pickedPoint], 
                updatable: true, instance: null }, this.scene.core);

            const f = () =>  {
                if (lines.material.alpha > 0.1) {
                    lines.material.alpha -= 0.1;
                    setTimeout(f, 10);
                } else {
                    lines.dispose();
                }
            };
            f();

            this.scene.deleteUnit(hit.pickedMesh.parent as GameUnit);
        } else {
            const lines = BABYLON.MeshBuilder.CreateLines('lines', {
                points: [ray.origin, ray.origin.add(ray.direction.scale(1000.0))],
                updatable: true, instance: null
            }, this.scene.core);

            const f = () => {
                if (lines.material.alpha > 0.1) {
                    lines.material.alpha -= 0.1;
                    setTimeout(f, 10);
                } else {
                    lines.dispose();
                }
            };
            f();
        }
    }

    getSyncData() {
        return {};
    }
}
