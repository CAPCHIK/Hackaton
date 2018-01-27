import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { Treasure } from './Treasure';
import { Mob } from './Mob';

export class SpawnPoint extends GameUnit {
    private timer = 0;
    private currentMob = 0;

    private mobs: Map<number, Mob>;

    constructor(scene: GameScene, name: string, private treasure: Treasure) {
        super(scene, name);

        this.mobs = new Map<number, Mob>();
    }

    onUpdate() {
        this.timer += 0.01;

        if (this.timer > 1) {
            const mob = new Mob(this.scene, 'mob_' + this.currentMob);
            this.scene.spawnUnit(mob);

            this.mobs.set(this.currentMob, mob);
            mob.setTarget(this.treasure);

            this.timer = 0;
        }
    }
}
