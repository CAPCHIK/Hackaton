import { TransformNode } from 'babylonjs';
import { GameScene } from './GameScene';

export abstract class GameUnit extends TransformNode {
    readonly uid: number = -1;
    readonly name: string;
    readonly hp: number;
    readonly immortable: boolean;

    public constructor(protected scene: GameScene, name: string) {
        super(name);

        this.name = name;
    }

    onCreate() {}

    onDestroy() {}

    onUpdate() {}

    getSyncData(): any {
        return {
            name: this.name,
            hp: this.hp,
            immortable: this.immortable
        };
    }
}
