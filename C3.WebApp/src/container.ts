/// <reference path="../typings/browser.d.ts" />

import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";
import 'hammerjs/hammer.js';
import {EventAggregator} from 'aurelia-event-aggregator';

import {LogManager} from 'aurelia-framework';
let logger = LogManager.getLogger('container');

enum DragMode {
    None,
    Pan
}

@autoinject
export class Container {
    constructor(private eventAggregator: EventAggregator) {
    }
    
    X: number;
    Y: number;
    Name: string;
    Description: string;
    IsSelected: boolean;
    
    Svg: SVGElement;
    
    private dragMode: DragMode = DragMode.None;
    private startX: number; 
    private startY: number;
    
    attached(): void {
        var self: Container = this;
        var hammertime = new Hammer(this.Svg);
        hammertime.on('panstart', (event: HammerInput) => {
            logger.debug('pan event: ' + event.type);
            self.dragMode = DragMode.Pan;
            self.startX = self.X;
            self.startY = self.Y;
            self.eventAggregator.publish("containerPan", self);
        });
        hammertime.on('pan', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            if (self.dragMode === DragMode.None)
                return;
            self.X = self.startX + event.deltaX;
            self.Y = self.startY + event.deltaY;
        });
        hammertime.on('panend', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            self.dragMode = DragMode.None;
            self.startX = undefined;
            self.startY = undefined;
        });
        
        hammertime.on('tap', function(event: HammerInput) {
            logger.debug('event: ' + event.type);
            self.eventAggregator.publish("containerTap", self);
        });
    }
}
