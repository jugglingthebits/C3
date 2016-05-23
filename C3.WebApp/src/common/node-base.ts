import {Point, Direction} from './edge-base';

export class ConnectionPoint {
    constructor(point: Point, direction: Direction) {
        this.point = point;
        this.direction = direction;
    }
    
    point: Point;
    direction: Direction;
}

export class NodeBase {
    x: number;
    y: number;
    width: number;
    height: number;

    isSelected: boolean;
    
    private startX: number; 
    private startY: number;

    isHit(x: number, y: number): boolean {
        var hit = x >= this.x && x < this.x + this.width &&
                  y >= this.y && y < this.y + this.height;
        return hit;
    }
    
    startPan(): void {
        this.startX = this.x;
        this.startY = this.y;
    }
    
    pan(deltaX: number, deltaY: number): void {
        this.x = this.startX + deltaX;
        if (this.x < 0)
            this.x = 0;
        this.y = this.startY + deltaY;
        if (this.y < 0)
            this.y = 0;
    }
    
    endPan() {
        this.startX = undefined;
        this.startY = undefined;
    }
    
    getConnectionPoints(): ConnectionPoint[] {
        const center = this.getCenter();
        
        const topCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y
        }
        const topConnectionPoint = new ConnectionPoint(topCenter, Direction.North);

        const bottomCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y + this.height
        }
        const bottomConnectionPoint = new ConnectionPoint(bottomCenter, Direction.South);

        const leftCenter: Point = {
            x: this.x,
            y: this.y + this.height / 2
        }
        const leftConnectionPoint = new ConnectionPoint(leftCenter, Direction.West);

        const rightCenter: Point = {
            x: this.x + this.width,
            y: this.y + this.height / 2
        }
        const rightConnectionPoint = new ConnectionPoint(rightCenter, Direction.East);
        
        return [topConnectionPoint, bottomConnectionPoint, 
                leftConnectionPoint, rightConnectionPoint];
    }
    
    private getCenter(): Point {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return {x: centerX, y: centerY}
    }
}
