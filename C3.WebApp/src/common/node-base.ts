import {Point} from './edge-base';

export class NodeBase {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;

    isHit(x: number, y: number): boolean {
        var hit = !(x < this.x || x >= this.x + this.width ||
                  y < this.y || y >= this.y + this.height);
        // var hit = x >= this.x && x < this.x + this.width &&
        //           y >= this.y && y < this.y + this.height;
        return hit;
    }
    
    getConnectionPoints(): Point[] {
        const center = this.getCenter();
        
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
        
        // Only use center for now.
        return [center];
    }
    
    private getCenter(): Point {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return {x: centerX, y: centerY}
    }
}
