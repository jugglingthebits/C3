import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Container} from './container';
import {bindable} from "aurelia-framework";

@autoinject
export class Containers {
    @bindable
    containers: Container[] = [];
    
    constructor(private http: HttpClient) {
        this.containers = [
            new Container(10, 10, "abc", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."), 
            new Container(200, 200, "def", "t vero eos et accusam et justo duo dolores et ea rebum.")    
        ];
    };
    
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}