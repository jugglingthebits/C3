import {Point} from './edge-base';

export class NodeBase {
    id: string;
    x: number = 0;
    y: number = 0;
    width: number;
    height: number;

    isHit(x: number, y: number): boolean {
        const border = 20;

        var hit = !(x < this.x - border || x >= this.x + this.width + border ||
                  y < this.y - border || y >= this.y + this.height + border);
        return hit;
    }
    
    getConnectionPoints(): Point[] {
        const topLeft: Point = {
            x: this.x + this.width / 4,
            y: this.y
        }
        const topCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y
        }
        const topRight: Point = {
            x: this.x + this.width * 3/4,
            y: this.y
        }
        const bottomLeft: Point = {
            x: this.x + this.width / 4,
            y: this.y + this.height - 1
        }
        const bottomCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y + this.height - 1
        }
        const bottomRight: Point = {
            x: this.x + this.width * 3/4,
            y: this.y + this.height - 1
        }
        const leftTop: Point = {
            x: this.x,
            y: this.y + this.height / 4
        }
        const leftCenter: Point = {
            x: this.x,
            y: this.y + this.height / 2
        }
        const leftBottom: Point = {
            x: this.x,
            y: this.y + this.height * 3/4
        }
        const rightTop: Point = {
            x: this.x + this.width - 1,
            y: this.y + this.height / 4
        }
        const rightCenter: Point = {
            x: this.x + this.width - 1,
            y: this.y + this.height / 2
        }
        const rightBottom: Point = {
            x: this.x + this.width - 1,
            y: this.y + this.height * 3/4
        }
        return [topLeft, topCenter, topRight, 
                bottomLeft, bottomCenter, bottomRight, 
                leftTop, leftCenter, leftBottom, 
                rightTop, rightCenter, rightBottom];
    }
}
