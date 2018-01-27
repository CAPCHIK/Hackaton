import { GameUnit } from './GameUnit';
import { ShadowGenerator } from 'babylonjs';
import * as io from 'socket.io-client';
import { SocketIoService } from '../../services/socket-io.service';
import * as ts from 'typescript';

import { Loot } from '../units/Loot';
import { Mob } from '../units/Mob';
import { Player } from '../units/Player';
import { SpellObject } from '../units/SpellObject';
import { StaticObject } from '../units/StaticObject';
import { Tower } from '../units/Tower';
import { Treasure } from '../units/Treasure';
import { Weapon } from '../units/Weapon';

class SerializationHelper {
    static toInstance<T>(obj: T, json: string): T {
        const jsonObj = JSON.parse(json);

        if (typeof obj['fromJSON'] === 'function') {
            obj['fromJSON'](jsonObj);
        } else {
            for (const propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}

export abstract class GameScene {
    readonly core: BABYLON.Scene;
    public socketService: SocketIoService;
    protected units: Map<number, GameUnit>;

    public constructor(core: BABYLON.Scene, socket: SocketIoService) {
        this.core = core;
        this.socketService = socket;
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
        const unitObject = unit.getSyncData();
        unitObject._type = unit.constructor.name;

        this.socketService.connection.emit('create_object', unitObject);
    }

    onSpawnObject(unitObject: any) {
        const result = 'SerializationHelper.toInstance(new ' + unitObject._type + '(), json);';
        const objectCasting = ts.transpile(result);
        console.log(result);
        const unit = eval(result);

        console.log(unit);

        this.units.set(unit.uid, unit);
        unit.onCreate();
    }
}
