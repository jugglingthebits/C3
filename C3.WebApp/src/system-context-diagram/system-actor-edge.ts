import { autoinject, computedFrom, transient } from 'aurelia-framework';
import { EdgeBase } from '../common/edge-base';
import { StraightPathFinder, PerpendicularPathFinder } from '../common/path-finder';
import { AstarPathFinder } from '../common/astar-path-finder';
import { ActorNode } from './actor-node';
import { SystemNode } from './system-node';
import { SystemContextDiagram } from './system-context-diagram';
import { ActorSystemUsingModel } from '../common/model';

@autoinject @transient()
export class SystemActorEdge extends EdgeBase {
    id: string;
    name: string;
    description: string;
    parentDiagram: SystemContextDiagram;
    sourceNode: ActorNode | SystemNode;
    targetNode: ActorNode | SystemNode;

    constructor(pathFinder: AstarPathFinder) {
        super(pathFinder);
    }

    @computedFrom('path')
    get svgPoints(): string {
        const svgPath = this.path.map(p => `${p.x},${p.y}`).join(" ");
        return svgPath;
    }

    attached(): void {
        // this.updatePath();
    }

    updateFromModel(model: ActorSystemUsingModel): void {
        this.id = model.id;
        this.sourceNode = this.parentDiagram.actorNodes.find(a => a.id === model.sourceId)
            || this.parentDiagram.systemNodes.find(s => s.id === model.sourceId);

        this.targetNode = this.parentDiagram.systemNodes.find(s => s.id === model.targetId)
            || this.parentDiagram.actorNodes.find(s => s.id === model.targetId);
    }

    copyToModel(): ActorSystemUsingModel {
        let model = <ActorSystemUsingModel>{};
        model.id = this.id;
        model.sourceId = this.sourceNode.id;
        model.targetId = this.targetNode.id;
        return model;
    }
}
