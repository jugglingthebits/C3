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
    actorSystemUsings: ActorSystemUsing[];
    systemSystemUsings: SystemSystemUsing[];
}

export interface SystemModel extends EntityModel {
    description: string;
    isExternal: boolean;
    containers: ContainerModel[];
}

export interface ActorModel extends EntityModel {
}

export interface ActorSystemUsing extends EdgeModel {
}

export interface ContainerModel extends EntityModel {
    description: string;
    components: ComponentModel[];
}

export interface ComponentModel extends EntityModel {
}
