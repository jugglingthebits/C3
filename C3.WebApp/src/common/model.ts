export interface DiagramModel {
    id: string;
    name: string;
}

export interface NodeModel {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SystemContextDiagramModel extends DiagramModel {
    systemNodes: SystemNodeModel[];
    actorNodes: ActorNodeModel[];
}

export interface SystemNodeModel extends NodeModel {
    description: string;
    isExternalSystem: boolean;
}

export interface ActorNodeModel extends NodeModel {
}

export interface ContainerDiagramModel extends DiagramModel {
    containerNodes: ContainerNodeModel[];
}

export interface ContainerNodeModel {
}

export class SystemContextDiagramModelChanged {}
