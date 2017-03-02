// import 'fetch';
// import {HttpClient} from 'aurelia-fetch-client';
import { SystemContextModel, ActorSystemUsingModel, SystemModel, ActorModel, ContainerModel, ComponentModel }
    from "../common/model";

export class SystemContextModelService {
    private systemContext: SystemContextModel;

    constructor() {
        const component1 = <ComponentModel>{
            id: "component1"
        };

        const container1 = <ContainerModel>{
            id: "container1",
            components: [component1]
        };

        const container2 = <ContainerModel>{
            id: "container2",
            components: []
        };

        const system1 = <SystemModel>{
            id: "system1",
            isExternal: false,
            containers: [container1, container2]
        };

        const actor1 = <ActorModel>{
            id: "actor1"
        };

        const externalSystem1 = <SystemModel>{
            id: "externalSystem1",
            isExternal: true
        };

        const actorSystemUsing1 = <ActorSystemUsingModel>{
            id: 'systemActorUsing1',
            sourceId: 'system1',
            targetId: 'actor1'
        };

        this.systemContext = <SystemContextModel>{
            id: "systemContext1",
            systems: [system1, externalSystem1],
            actors: [actor1],
            actorSystemUsings: []
        };
    }

    get(): Promise<SystemContextModel> {
        return new Promise(resolve => resolve(this.systemContext));
    }

    // private loadFromId(id: number): Promise<SystemContextDiagramModel> {
    //     const httpClient = new HttpClient();
    //     httpClient.configure(config => config.withBaseUrl('api')
    //                                          .rejectErrorResponses());

    //     return httpClient.fetch(`/system/${id}`)
    //                      .then(response => <Promise<SystemContextDiagramModel>>response.json());
    // }
}
