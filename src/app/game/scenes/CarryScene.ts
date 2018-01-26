import { GameScene } from '../bases/GameScene';
import { Scene } from 'babylonjs';
import { StaticObject } from '../units/StaticObject';
import { Player } from '../units/Player';

export class CarryScene extends GameScene {
    private player: Player;
    private cube: StaticObject;

    onStart() {
        this.cube = new StaticObject(this, 'cube');
        this.spawnUnit(this.cube);

        this.player = new Player(this, 'player');
        this.spawnUnit(this.player);
    }

    onClose() {

    }

    onGui() {

    }

    onUpdate() {
        
    }

    onDraw() {
        this.core.render();
    }

    onResize() {

    }
}
