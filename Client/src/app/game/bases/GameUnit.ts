import { TransformNode } from 'babylonjs';
import { GameScene } from './GameScene';

export abstract class GameUnit extends TransformNode {

    readonly uid: number = -1;
    readonly name: string;
    readonly immortable: boolean;
    public get hp(): number { return this._hp; }
    public readonly maxHp: number;

    public constructor(protected scene: GameScene, name: string, private _hp?: number) {
        super(name);
        this.maxHp = _hp;
        this.name = name;
    }

    onCreate() { }

    onDestroy() { }

    onDamageApplied() {}

    onUpdate() { }


    applyDamage(damage: number) {
        this._hp -= damage;
        if (this._hp <= 0) {
            this.scene.deleteUnit(this);
            return;
        }
        this.onDamageApplied();
    }

    abstract getSyncData();
}
