import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";

@autoinject
export class SelectionBox {
    x: number;
    y: number;
    width: number;
    height: number;
    private startX: number;
    private startY: number;
    
    constructor() {
        this.width = 0;
        this.height = 0;
    }
    
    startPan(): void {
        this.startX = this.x;
        this.startY = this.y;
    }
    
    pan(deltaX: number, deltaY: number): void {
        if (deltaX >= 0) {
            this.width = deltaX;
        }
        else {
            this.x = this.startX + deltaX;
            this.width = Math.abs(deltaX);
        }
        
        if (deltaY >= 0) {
            this.height = deltaY;
        }
        else {
            this.y = this.startY + deltaY;
            this.height = Math.abs(deltaY);
        }
    }
    
    containsRect(x: number, y: number, width: number, height: number): boolean {
        let contains = x >= this.x && x+width < this.x+this.width &&
                       y >= this.y && y+height < this.y+this.height;
        return contains;
    }
}
