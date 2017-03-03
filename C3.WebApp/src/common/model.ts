export interface DiagramModel {
}

export interface EntityModel {
    id: string;
}

export interface EdgeModel {
    sourceId: string;
    targetId: string;
}

export interface SystemContextModel extends DiagramModel, EntityModel {
    systems: SystemModel[];
    actors: ActorModel[];
    usings: EdgeModel[];
}

export interface SystemModel extends EntityModel {
    isExternal: boolean;
    containers: ContainerModel[];
}

export interface ActorModel extends EntityModel {
}

export interface ContainerModel extends EntityModel {
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
