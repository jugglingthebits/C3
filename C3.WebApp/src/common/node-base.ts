import {Point} from './edge-base';

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
    
    getConnectionPoints(): Point[] {
        const center = this.getCenter();
        
        const topCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y
        }

        const bottomCenter: Point = {
            x: this.x + this.width / 2,
            y: this.y + this.height
        }

        const leftCenter: Point = {
            x: this.x,
            y: this.y + this.height / 2
        }

        const rightCenter: Point = {
            x: this.x + this.width,
            y: this.y + this.height / 2
        }
        
        return [topCenter, bottomCenter, 
                leftCenter, rightCenter];
    }
    
    private getCenter(): Point {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return {x: centerX, y: centerY}
    }
}
