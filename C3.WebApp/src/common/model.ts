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
    connectors: ConnectorModel[];
}

export interface SystemNodeModel extends NodeModel {
    description: string;
    isExternalSystem: boolean;
    containerDiagramId: string;
}

export interface ActorNodeModel extends NodeModel {
}

export interface ContainerDiagramModel extends DiagramModel {
    containerNodes: ContainerNodeModel[];
}

export interface ContainerNodeModel extends NodeModel {
    description: string;
    componentDiagramId: string;
}

export interface ComponentDiagramModel extends DiagramModel {
    componentNodes: ComponentNodeModel[];
}

export interface ComponentNodeModel extends NodeModel {
}

export interface ConnectorModel {
    id: string;
    name: string;
    description: string;
    sourceNodeId: string;
    targetNodeId: string;
}
