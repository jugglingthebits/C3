import { autoinject, computedFrom, transient } from 'aurelia-framework';
import { EdgeBase } from '../common/edge-base';
import { StraightPathFinder, PerpendicularPathFinder } from '../common/path-finder';
import { AstarPathFinder } from '../common/astar-path-finder';
import { ActorNode } from './actor-node';
import { SystemNode } from './system-node';
import { SystemContextDiagram } from './system-context-diagram';
import { EdgeModel } from '../common/model';
import { NodeBase } from "../common/node-base";

@autoinject @transient()
export class UsingEdge extends EdgeBase {
    parentDiagram: SystemContextDiagram;
    sourceNode: NodeBase;
    targetNode: NodeBase;

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

    updateFromModel(model: EdgeModel): void {
        this.sourceNode = this.parentDiagram.getNodes().find(a => a.id === model.sourceId);
        this.targetNode = this.parentDiagram.getNodes().find(s => s.id === model.targetId);
    }

    copyToModel(): EdgeModel {
        let model = <EdgeModel>{};
        model.sourceId = this.sourceNode.id;
        model.targetId = this.targetNode.id;
        return model;
    }
}
