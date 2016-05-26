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
        let newX = this.startX + deltaX;
        if (newX < 0)
            newX = 0;
        this.x = Math.round(newX/10)*10; // Lock nodes to a 10px grid 
        
        let newY = this.startY + deltaY;
        if (newY < 0)
            newY = 0;
        
        this.y = Math.round(newY/10)*10; // Lock nodes to a 10px grid
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
        
        return [topCenter, bottomCenter, 
                leftCenter, rightCenter];
    }
    
    private getCenter(): Point {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        return {x: centerX, y: centerY}
    }
}
