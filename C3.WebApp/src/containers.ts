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
        //TODO: Where to move this to?
        DIContainer.instance.registerTransient(Container);
        
        this.eventAggregator.subscribe("unselectAll", (container: Container) =>  {
            this.containers.forEach(c => {
                c.IsSelected = false;
            });
        });
        
        this.createContainers();
    };
    
    private createContainers(): void {
        var container1: Container = DIContainer.instance.get(Container);
        container1.X = 10;
        container1.Y = 10;
        container1.Name = "abc";
        container1.Description = "Lorem ipsum dolor sit amet";
        
        var container2 = DIContainer.instance.get(Container);
        container2.X = 200;
        container2.Y = 200;
        container2.Name = "def";
        container2.Description = "Lorem ipsum dolor sit amet";
        
        this.containers = [
            container1, 
            container2    
        ];
    }
    
    //TODO: Move to service.
    /*activate() {
        return this.http.fetch('api/containers')
                   .then(response => response.json())
                   .then(containers => this.containers = containers);
    }*/
}