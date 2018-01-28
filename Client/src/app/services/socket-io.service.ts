import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subscriber } from 'rxjs/Subscriber';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Vector2 } from 'babylonjs-materials';

@Injectable()
export class SocketIoService {
    connection: SocketIOClient.Socket;


    carryBuff: Observable<any>;
    treasureHP: Observable<any>;
    freezeMobs: Observable<Vector2>;
    buildTower: Observable<Vector2>;
    moveTreasure: Observable<Vector2>;

    constructor() {
        this.connection = io('http://62.109.18.175:4000/');
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
}
