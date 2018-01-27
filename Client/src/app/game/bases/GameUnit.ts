import { TransformNode } from 'babylonjs';
import { GameScene } from './GameScene';

export abstract class GameUnit extends TransformNode {
    readonly name: string;
    readonly hp: number;
    readonly immportable: boolean;

    public constructor(protected scene: GameScene, name: string) {
        super(name);
        this.name = name;
    }

    onCreate() {}

    onDestroy() {}

    onUpdate() {}
}
