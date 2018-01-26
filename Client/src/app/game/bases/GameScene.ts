import { GameUnit } from './GameUnit';

export abstract class GameScene {
    readonly core: BABYLON.Scene;
    protected units: Map<string, GameUnit>;

    public constructor(core: BABYLON.Scene) {
        this.core = core;
        this.units = new Map<string, GameUnit>();
    }

    abstract onStart(): void;

    abstract onClose(): void;

    abstract onGui(): void;

    abstract onUpdate(): void;

    abstract onDraw(): void;

    // stuff
    abstract onResize(): void;

    preUpdate() {
        this.units.forEach(unit => {
            unit.onUpdate();
        });
    }

    spawnUnit(unit: GameUnit) {
        this.units.set(unit.name, unit);
        unit.onCreate();

        console.log(this.units);
    }

    deleteUnit(unit: GameUnit) {
        unit.onDestroy();
        this.units.delete(unit.name);
    }
}
