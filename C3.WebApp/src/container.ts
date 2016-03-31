/// <reference path="../typings/browser.d.ts" />

import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";
import 'hammerjs/hammer.js';
import {EventAggregator} from 'aurelia-event-aggregator';

import {LogManager} from 'aurelia-framework';
let logger = LogManager.getLogger('container');

@autoinject
export class Container {
    constructor(private eventAggregator: EventAggregator) {
        this.eventAggregator.subscribe("panStart", () => {
            if (!this.IsSelected)
                return;
            this.startX = this.X;
            this.startY = this.Y;
        });
        
        this.eventAggregator.subscribe("pan", data => {
            if (!this.IsSelected)
                return;
            this.X = this.startX + data.deltaX;
            this.Y = this.startY + data.deltaY;
        });
        
        this.eventAggregator.subscribe("panEnd", () => {
            if (!this.IsSelected)
                return;
            this.startX = undefined;
            this.startY = undefined;
        });
    }
    
    X: number;
    Y: number;
    Name: string;
    Description: string;
    IsSelected: boolean;
    
    Svg: SVGElement;
    
    private startX: number; 
    private startY: number;
    
    attached(): void {
        var self: Container = this;
        var hammertime = new Hammer(this.Svg);
        hammertime.on('panstart', (event: HammerInput) => {
            logger.debug('pan event: ' + event.type);

            if (!self.IsSelected && !event.srcEvent.ctrlKey) {
                self.eventAggregator.publish("unselectAll");
            }
            self.IsSelected = true;
            self.eventAggregator.publish("panStart");
        });
        hammertime.on('pan', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            var data = {deltaX: event.deltaX, deltaY: event.deltaY};
            self.eventAggregator.publish("pan", data);
        });
        hammertime.on('panend', function(event: HammerInput) {
            logger.debug('pan event: ' + event.type);
            
            self.eventAggregator.publish("panEnd");
        });
        
        hammertime.on('tap', function(event: HammerInput) {
            logger.debug('event: ' + event.type);
            
            if (event.srcEvent.ctrlKey) {
                self.IsSelected = !self.IsSelected;
            }
            else {
                self.eventAggregator.publish("unselectAll");
                self.IsSelected = true;
            }
        });
    }
}
