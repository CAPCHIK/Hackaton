import { GameUnit } from '../bases/GameUnit';
import { GameScene } from '../bases/GameScene';
import { Mesh } from 'babylonjs';

export enum LootType {
    Meal,
    Mana
}

export class Loot extends GameUnit {
    type: LootType;
    amount: number;

    constructor(scene: GameScene, name: string) {
        super(scene, name);

        this.type = (Math.random() < 0.3) ? LootType.Meal : LootType.Mana;
        this.amount = 1 + Math.random() * 10;
    }

    onUpdate() {
    }

    getSyncData() {
        return {
            unitType: 'Loot',
            uid: this.uid,
            position: this.absolutePosition,
            type: this.type,
            amount: this.amount
        };
    }
}
