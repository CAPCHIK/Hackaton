import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subscriber } from 'rxjs/Subscriber';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Vector2 } from 'babylonjs-materials';
import { GameScene } from '../game/bases/GameScene';
import { setInterval } from 'timers';
import { Player } from '../game/units/Player';
import { Mob } from '../game/units/Mob';
import { Loot } from '../game/units/Loot';
import { Treasure } from '../game/units/Treasure';

@Injectable()
export class SocketIoService {
    private connection: SocketIOClient.Socket;
    private scene: GameScene;

    carryBuff: Observable<any>;
    treasureHP: Observable<any>;
    freezeMobs: Observable<Vector2>;
    buildTower: Observable<Vector2>;
    moveTreasure: Observable<Vector2>;

    constructor() {
        this.connection = io('https://aluminiumcomposite.ru/');

        this.connection.on('playerUpdate', d => {
            //console.log(d);
        });

        let observerCarry: Subscriber<any>;
        const observable = new Observable<any>(obs => {
            observerCarry = obs;
        });
        this.carryBuff = observable;
        this.connection.on('carry_buff', () => observerCarry.next());

        let observerTreasureHP: Subscriber<any>;
        const observableTreasureHP = new Observable<any>(obs => {
            observerTreasureHP = obs;
        });
        this.treasureHP = observableTreasureHP;
        this.connection.on('treasure_hp', () => observerTreasureHP.next());

        let observerFreeze: Subscriber<Vector2>;
        const observableFreeze = new Observable<Vector2>(obs => {
            observerFreeze = obs;
        });
        this.freezeMobs = observableFreeze;
        this.connection.on('freeze', data => observerFreeze.next(data));

        let observerBuildTower: Subscriber<Vector2>;
        const observableBuildTower = new Observable<Vector2>(obs => {
            observerBuildTower = obs;
        });
        this.buildTower = observableBuildTower;
        this.connection.on('build_tower', data => observerBuildTower.next(data));

        let observerMoveTreasure: Subscriber<Vector2>;
        const observableMoveTreasure = new Observable<Vector2>(obs => {
            observerMoveTreasure = obs;
        });
        this.moveTreasure = observableBuildTower;
        this.connection.on('move_treasure', data => observerMoveTreasure.next(data));
    }

    setScene(scene: GameScene) {
        this.scene = scene;
        setInterval(() => this.sending(), 100);
    }

    sending() {
        let player: any;
        let treasure: any;
        const mobs = [];
        const loot = [];
        this.scene.units.forEach(E => {
            const data = E.getSyncData();
            if (data.uid === undefined) {
                return;
            }
            switch (data.unitType) {
                case 'Player':
                    player = data;
                    break;
                case 'Treasure':
                    treasure = data;
                    break;
                case 'Mob':
                    mobs.push(data);
                    break;
                case 'Loot':
                    loot.push(data);
                    break;
            }
        });
        this.connection.emit('playerUpdate', player);
        this.connection.emit('treasureUpdate', treasure);
        this.connection.emit('mobsUpdate', mobs);
        this.connection.emit('lootUpdate', loot);
    }
}
