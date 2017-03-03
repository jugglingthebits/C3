export interface DiagramModel {
}

export interface EntityModel {
    id: string;
}

export interface EdgeModel extends EntityModel {
    sourceId: string;
    targetId: string;
}

export interface SystemContextModel extends DiagramModel, EntityModel {
    systems: SystemModel[];
    actors: ActorModel[];
    actorSystemUsings: ActorSystemUsingModel[];
    systemSystemUsings: SystemSystemUsingModel[];
}

export interface SystemModel extends EntityModel {
    isExternal: boolean;
    containers: ContainerModel[];
}

export interface ActorModel extends EntityModel {
}

export interface ActorSystemUsingModel extends EdgeModel {
}

export interface SystemSystemUsingModel extends EdgeModel {
}

export interface ContainerModel extends EntityModel {
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
