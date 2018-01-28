import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { Treasure } from './Treasure';
import { Mob, MobType } from './Mob';

export class SpawnPoint extends GameUnit {
    private timer = 0;
    private currentMob = 0;

    private mobs: Map<number, Mob>;

    constructor(scene: GameScene, name: string, private treasure: Treasure) {
        super(scene, name);

        this.mobs = new Map<number, Mob>();
    }

    onCreate() {
        this.position.x += Math.random() * 50 - 25;
        this.position.z += Math.random() * 50 - 25;
    }

    onUpdate() {
        this.timer += 0.001 * this.scene.core.getEngine().getDeltaTime();

        if (this.timer > 1.5) {
            const mob = new Mob(this.scene, 'mob_' + (this.currentMob++), (Math.random() < 0.5) ? MobType.Knuckles : MobType.Nyan);
            mob.position = this.position.add(new BABYLON.Vector3(Math.random() * 10 - 5, 0, Math.random() * 10 - 5));
            this.scene.spawnUnit(mob);

            this.mobs.set(this.currentMob, mob);
            mob.setTarget(this.treasure);

            this.timer = 0;
        }
    }

    getSyncData() {
        return {};
    }
}
