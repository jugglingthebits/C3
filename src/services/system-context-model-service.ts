import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { SystemContextModel, SystemModel, ActorModel, ContainerModel, ComponentModel, EdgeModel }
    from "../common/model";

@autoinject
export class SystemContextModelService {
    private systemContext: SystemContextModel;

    constructor(private httpClient: HttpClient) {
        this.httpClient.configure(config => config.withBaseUrl('api'));

    //     const component1 = <ComponentModel>{
    //         id: "component1"
    //     };

    //     const container1 = <ContainerModel>{
    //         id: "container1",
    //         components: [component1]
    //     };

    //     const container2 = <ContainerModel>{
    //         id: "container2",
    //         components: []
    //     };

    //     const system1 = <SystemModel>{
    //         id: "system1",
    //         containers: [container1, container2]
    //     };

    //     const actor1 = <ActorModel>{
    //         id: "actor1"
    //     };

    //     const externalSystem1 = <SystemModel>{
    //         id: "externalSystem1",
    //     };

    //     const actorSystemUsing1 = <EdgeModel>{
    //         sourceId: 'actor1',
    //         targetId: 'system1'
    //     };

    //     const systemSystemUsing1 = <EdgeModel>{
    //         sourceId: 'system1',
    //         targetId: 'externalSystem1'
    //     };

    //     this.systemContext = <SystemContextModel>{
    //         actors: [actor1],
    //         system: system1,
    //         externalSystems: [externalSystem1],
    //         usings: [actorSystemUsing1, systemSystemUsing1],
    //     };
    }

    // get(): Promise<SystemContextModel> {
    //     return new Promise(resolve => resolve(this.systemContext));
    // }

    get(): Promise<SystemContextModel | null> {
        return this.httpClient.get('/system-context/current')
            .then(response => {
                let model = <SystemContextModel>response.content;
                return model;
            }, error => {
                return null;
            });
    }
}
