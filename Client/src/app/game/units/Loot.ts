import { GameUnit } from '../bases/GameUnit';

export enum LootType {
    Meal,
    Mana
}

export interface LootConfig {
    type: LootType;
    amount: number;
}

export class Loot extends GameUnit {
    onUpdate() {
    }
}
