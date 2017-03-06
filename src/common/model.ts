export interface EntityModel {
    id: string;
}

export interface EdgeModel {
    sourceId: string;
    targetId: string;
}

export interface SystemContextModel {
    actors: ActorModel[];
    system: SystemModel;
    externalSystems: SystemModel[];
    usings: EdgeModel[];
}

export interface SystemModel extends EntityModel {
    containers: ContainerModel[];
}

export interface ActorModel extends EntityModel {
}

export interface ContainerModel extends EntityModel {
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
