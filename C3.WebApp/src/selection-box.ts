import {autoinject} from 'aurelia-framework';
import {bindable} from "aurelia-framework";

@autoinject
export class SelectionBox {
    x: number;
    y: number;
    width: number;
    height: number;
    svg3: SVGElement;

    constructor() {
        this.width = 0;
        this.height = 0;
    }
}