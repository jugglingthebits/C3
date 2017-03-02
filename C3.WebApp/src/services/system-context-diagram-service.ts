// import 'fetch';
// import {HttpClient} from 'aurelia-fetch-client';
import { SystemContextModel, ActorSystemUsingModel, SystemModel, ActorModel } 
    from "../common/model";

export class SystemContextModelService {
    private systemContexts: SystemContextModel[];
    
    constructor() {
        const systemModel1 = <SystemModel>{
            id: "systemNode1"
        };
        
        const actor1 = <ActorModel>{
            id: "actorNode1"
        };
        
        const externalSystem1 = <SystemModel>{
            id: "externalSystem1",
            isExternal: true
        };
        
        const actorSystemUsing1 = <ActorSystemUsingModel>{
            id: 'systemActorEdge1',
            sourceId: 'systemNode1',
            targetId: 'actor1'
        };

        const systemContext1 = <SystemContextModel>{
            id: "systemContext1",
            systems: [systemModel1, externalSystem1],
            actors: [actor1],
            actorSystemUsings: [actorSystemUsing1]
        };
        
        this.systemContexts = [systemContext1];
    }
    
    getAll(): Promise<SystemContextModel[]> {
        return new Promise(resolve => resolve(this.systemContexts));
    }
    
    // private loadFromId(id: number): Promise<SystemContextDiagramModel> {
    //     const httpClient = new HttpClient();
    //     httpClient.configure(config => config.withBaseUrl('api')
    //                                          .rejectErrorResponses());

    //     return httpClient.fetch(`/system/${id}`)
    //                      .then(response => <Promise<SystemContextDiagramModel>>response.json());
    // }
}
