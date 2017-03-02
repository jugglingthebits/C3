export interface DiagramModel {
}

export interface EntityModel {
    id: string;
    description: string | null;
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
    description: string | null;
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
    description: string | null;
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
