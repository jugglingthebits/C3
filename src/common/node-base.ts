import {Point} from './edge-base';

export class NodeBase {
    id: string;
    x: number = 0;
    y: number = 0;
    width: number;
    height: number;

    isHit(x: number, y: number): boolean {
        var hit = !(x < this.x || x >= this.x + this.width ||
                  y < this.y || y >= this.y + this.height);
        return hit;
    }
    
    getConnectionPoints(): Point[] {
        const topCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y
        }
        const bottomCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y + this.height - 1
        }
        const leftCenter: Point = {
            x: this.x,
            y: this.y + this.height / 2
        }
        const rightCenter: Point = {
            x: this.x + this.width - 1,
            y: this.y + this.height / 2
        }
        return [topCenter, bottomCenter, leftCenter, rightCenter];
    }
}
