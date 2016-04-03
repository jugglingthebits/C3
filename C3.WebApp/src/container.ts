/// <reference path="../typings/browser.d.ts" />

import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";
import 'hammerjs/hammer.js';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LogManager} from 'aurelia-framework';

let logger = LogManager.getLogger('Container');

@autoinject
export class Container {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    description: string;
    isSelected: boolean;
    
    private containerNodeElement: SVGElement;
    private startX: number; 
    private startY: number;

    constructor(private eventAggregator: EventAggregator) {
        this.width = 200;
        this.height = 200;
    }
    
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
}
