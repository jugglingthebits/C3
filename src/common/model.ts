export interface EntityModel {
    id: string;
}

export interface EdgeModel {
    sourceId: string;
    targetId: string;
}

export interface SystemModel extends EntityModel {
    actors: ActorModel[];
    containers: ContainerModel[];
    usings: EdgeModel[];
    externalSystems: SystemModel[];
}

export interface ActorModel extends EntityModel {
}

export interface ContainerModel extends EntityModel {
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
