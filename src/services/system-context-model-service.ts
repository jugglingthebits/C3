// import {HttpClient} from 'aurelia-fetch-client';
import { SystemModel, ActorModel, ContainerModel, ComponentModel, EdgeModel }
    from "../common/model";

export class SystemContextModelService {
    private system: SystemModel;

    constructor() {
        const actor1 = <ActorModel>{
            id: "actor1"
        };

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

        const externalSystem1 = <SystemModel>{
            id: "externalSystem1",
        };

        const actor1Container1Using = <EdgeModel>{
            sourceId: "actor1",
            targetId: "container1"
        }

        const container1Container2Using = <EdgeModel>{
            sourceId: 'container1',
            targetId: 'container2'
        };

        const container2ExternalSystem1Using = <EdgeModel>{
            sourceId: 'container2',
            targetId: 'externalSystem1'
        };

        const system1 = <SystemModel>{
            id: "system1",
            actors: [actor1],
            containers: [container1, container2],
            externalSystems: [externalSystem1],
            usings: [actor1Container1Using, container1Container2Using, container2ExternalSystem1Using]
        };

        this.system = system1;
    }

    get(): Promise<SystemModel> {
        return new Promise(resolve => resolve(this.system));
    }

    // private loadFromId(id: number): Promise<SystemContextDiagramModel> {
    //     const httpClient = new HttpClient();
    //     httpClient.configure(config => config.withBaseUrl('api')
    //                                          .rejectErrorResponses());

    //     return httpClient.fetch(`/system/${id}`)
    //                      .then(response => <Promise<SystemContextDiagramModel>>response.json());
    // }
}
