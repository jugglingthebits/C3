import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";

@autoinject
export class SelectionBox {
    constructor() {
        this.Width = 0;
        this.Height = 0;
    }

    X: number;
    Y: number;
    Width: number;
    Height: number;
    Svg3: SVGElement;
        
    attached(): void {
        
    }
}