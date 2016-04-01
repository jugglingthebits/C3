/// <reference path="../typings/browser.d.ts" />

import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";
import 'hammerjs/hammer.js';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LogManager} from 'aurelia-framework';

let logger = LogManager.getLogger('Container');

@autoinject
export class Container {
    constructor(private eventAggregator: EventAggregator) {
        this.Width = 200;
        this.Height = 200;
    }
    
    X: number;
    Y: number;
    Width: number;
    Height: number;
    
    Name: string;
    Description: string;
    IsSelected: boolean;
    
    Svg: SVGElement;
    
    private startX: number; 
    private startY: number;
    
    IsHit(x: number, y: number): boolean {
        var hit = x >= this.X && x < this.X + this.Width &&
                  y >= this.Y && y < this.Y + this.Height;
        return hit;
    }
    
    StartPan(): void {
        this.startX = this.X;
        this.startY = this.Y;
    }
    
    Pan(deltaX: number, deltaY: number): void {
        this.X = this.startX + deltaX;
        if (this.X < 0)
            this.X = 0;
        this.Y = this.startY + deltaY;
        if (this.Y < 0)
            this.Y = 0;
    }
    
    EndPan() {
        this.startX = undefined;
        this.startY = undefined;
    }
}
