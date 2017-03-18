import { SystemModel, ActorModel, ContainerModel, ComponentModel, EdgeModel } from "../common/model";
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject
export class SystemModelService {
    private system: SystemModel;

    constructor(private httpClient: HttpClient) {
        this.httpClient.configure(config => config.withBaseUrl('api'));
    }

    get(): Promise<SystemModel> {
        return this.httpClient.get('/system/current')
            .then(response => {
                let model = <SystemModel>response.content;
                return model;
            }, error => {
                return null;
            });
    }
}
