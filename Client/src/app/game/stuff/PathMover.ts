import { Vector3 } from 'babylonjs';

export class PathMover {
    private startTime: Date;
    private pathLength = 0;
    private distances: number[] = [];

    constructor(
        private points: Vector3[],
        public speed: number
    ) {
        this.distances[0] = 0;
        for (let i = 1; i < points.length; i++) {
            this.pathLength += Vector3.Distance(points[i - 1], points[i]);
            this.distances[i] = this.pathLength;
        }
        this.pathLength += Vector3.Distance(points[points.length - 1], points[0]);
        this.distances.push(this.pathLength);
    }


    public move(): PositionAndDirection {
        const position = (this.moveTime() * this.speed) % this.pathLength;
        let index = Math.round(this.points.length / 2);
        let step = this.points.length / 2;
        let tryes = 0;
        let answer: number;
        while (true) {
            tryes++;
            if (tryes > 50) {
                return undefined;
            }
            step /= 2;
            if (this.distances[index] < position) {
                index = Math.round(index + step);
                continue;
            }
            if (this.distances[index - 1] <= position) {
                answer = index;
                break;
            }
            index = Math.round(index - step);
        }
        index = this.cycleIndex(index, this.points.length);
        const prev = this.cycleIndex(index - 1, this.points.length);
        let forward = this.points[index].subtract(this.points[prev]);
        forward = forward.scale((position - this.distances[prev]) / forward.length());
        forward = this.points[prev].add(forward);
        return new PositionAndDirection(forward, this.points[index]);
    }

    private cycleIndex(index: number, cycle: number): number {
        index = index % cycle;
        if (index < 0) {
            index = cycle + index;
        }
        return index;
    }

    private moveTime(): number {
        if (this.startTime) {
            return new Date().getTime() - this.startTime.getTime();
        } else {
            this.startTime = new Date();
            return 0;
        }
    }
}

export class PositionAndDirection {
    constructor(public position: Vector3, public direction: Vector3) { }
}
