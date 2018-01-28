import { GameUnit } from './GameUnit';
import { ShadowGenerator } from 'babylonjs';
import * as io from 'socket.io-client';
import { SocketIoService } from '../../services/socket-io.service';
import * as ts from 'typescript';

import { Loot } from '../units/Loot';
import { Mob } from '../units/Mob';
import { Player } from '../units/Player';
import { StaticObject } from '../units/StaticObject';
import { Tower } from '../units/Tower';
import { Treasure } from '../units/Treasure';
import { Weapon } from '../units/Weapon';
import { ResourceManager } from '../stuff/ResourceManager';

export abstract class GameScene {
    readonly core: BABYLON.Scene;
    protected units: Map<number, GameUnit>;
    public resourceManager: ResourceManager;
    public shadowGenerator: BABYLON.ShadowGenerator;

    public constructor(core: BABYLON.Scene, public socket: SocketIoService) {
        this.core = core;
        this.units = new Map<number, GameUnit>();
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
        this.units.set(unit.uid, unit);
        unit.onCreate();
    }

    deleteUnit(unit: GameUnit) {
        unit.onDestroy();
        unit.dispose();
        this.units.delete(unit.uid);
    }
}
