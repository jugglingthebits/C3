import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {Container} from './container';
import {bindable} from "aurelia-framework";
import {Container as DIContainer} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

@autoinject
export class Containers {
    @bindable
    containers: Container[] = [];
    
    constructor(private http: HttpClient, private eventAggregator: EventAggregator) {
        var diContainer = DIContainer.instance;
        
        diContainer.registerTransient(Container);
        
        var container1: Container = diContainer.get(Container);
        container1.X = 10;
        container1.Y = 10;
        container1.Name = "abc";
        container1.Description = "Lorem ipsum dolor sit amet";
        
        var container2 = diContainer.get(Container);
        container2.X = 200;
        container2.Y = 200;
        container2.Name = "def";
        container2.Description = "Lorem ipsum dolor sit amet";
        
        this.containers = [
            container1, 
            container2    
        ];

        this.eventAggregator.subscribe("containerPan", (container: Container) =>  {
            this.containers.forEach(c => {
                c.IsSelected = false;
            });
            container.IsSelected = true;
        });
        
        this.eventAggregator.subscribe("containerTap", (container: Container) =>  {
            this.containers.forEach(c => {
                c.IsSelected = false;
            });
            container.IsSelected = true;
        });
    };
    
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}