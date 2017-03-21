import { Point } from "./edge-base";
import { BoundingBox, DiagramBase } from "./diagram-base";

const gridSpacing = 10;

function manhattanHeuristic(pos0: Point, pos1: Point): number {
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
}

export class Node implements Point {
    x: number;
    y: number;
    visited = false;
    closed: boolean = false;
    parent: Node;
    gScore = 0;
    isOccupied = false

    constructor(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }

    reset() {
        this.visited = false;
        this.closed = false;
        this.parent = undefined;
        this.gScore = 0;
    }

    fScore(endNode: Node): number {
        const fScore = this.gScore + this.hScore(endNode);
        return fScore;
    };

    private _hScore;
    private hScore(endNode: Node): number {
        if (!this._hScore)
            this._hScore = manhattanHeuristic(this, endNode);
        return this._hScore;
    }
}

class SparseMatrix<T> {
    private entries = [];

    constructor(height: number) {
        for (let i = 0; i <= height; i++) {
            this.entries[i] = [];
        }
    }

    getEntry(x: number, y: number): T {
        let node = this.entries[y][x];
        return node;
    }

    addEntry(x: number, y: number, entry: T) {
        this.entries[y][x] = entry;
    }

    getAllEntries(): T[] {
        const entries = [];
        for (let yEntry of this.entries) {
            for (let xEntry of yEntry) {
                if (xEntry)
                    entries.push(xEntry);
            }
        }
        return entries;
    }
}

export class GraphForDiagram {
    private sparseMatrix: SparseMatrix<Node>;
    private diagramBoundingBox: BoundingBox;

    constructor(private diagram: DiagramBase) {
        this.diagramBoundingBox = this.diagram.getBoundingBox();
        this.sparseMatrix = new SparseMatrix<Node>(this.diagramBoundingBox.height / gridSpacing);
    }

    reset() {
        const nodes = this.sparseMatrix.getAllEntries();
        for (let node of nodes) {
            node.reset();
        }
    }

    getNode(point: Point): Node {
        const nodePosition = this.toMatrixCoordinate(point);
        const node = this.getOrBuildNode(nodePosition.x, nodePosition.y);
        return node;
    }

    getNeighbors(node: Node): Node[] {
        if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
            return [];

        let neighbors: Node[] = [];
        if (node.x * gridSpacing > 0) {
            const leftNeighbor = this.getOrBuildNode(node.x - 1, node.y);
            neighbors.push(leftNeighbor);
        }
        if (node.x * gridSpacing < this.diagramBoundingBox.width - 1) {
            const rightNeighbor = this.getOrBuildNode(node.x + 1, node.y);
            neighbors.push(rightNeighbor);
        }
        if (node.y * gridSpacing > 0) {
            const topNeighbor = this.getOrBuildNode(node.x, node.y - 1);
            neighbors.push(topNeighbor);
        }
        if (node.y * gridSpacing < this.diagramBoundingBox.height - 1) {
            const bottomNeighbor = this.getOrBuildNode(node.x, node.y + 1);
            neighbors.push(bottomNeighbor);
        }
        return neighbors;
    }

    private getOrBuildNode(x: number, y: number): Node {
        let node = this.sparseMatrix.getEntry(x, y);
        if (!node) {
            node = new Node({ x: x, y: y });
            node.isOccupied = this.isDiagramNodeHit(node) || this.isDiagramEdgeHit(node);
            this.sparseMatrix.addEntry(x, y, node);
        }
        return node;
    }

    toMatrixCoordinate(point: Point): Point {
        let matrixX = point.x - this.diagramBoundingBox.x;
        let matrixY = point.y - this.diagramBoundingBox.y;

        if (matrixX % gridSpacing !== 0)
            matrixX = Math.round(matrixX / gridSpacing) * gridSpacing;
        if (matrixY % gridSpacing !== 0)
            matrixY = Math.round(matrixY / gridSpacing) * gridSpacing;

        matrixX = matrixX / gridSpacing;
        matrixY = matrixY / gridSpacing;

        return { x: matrixX, y: matrixY };
    }

    toDiagramCoordinate(point: Point): Point {
        const diagramX = point.x * gridSpacing + this.diagramBoundingBox.x;
        const diagramY = point.y * gridSpacing + this.diagramBoundingBox.y;
        return { x: diagramX, y: diagramY };
    }

    private isDiagramNodeHit(point: Point) {
        const diagramPoint = this.toDiagramCoordinate(point);
        const diagramNodes = this.diagram.getNodes();
        for (var diagramNode of diagramNodes) {
            if (diagramNode.isHit(diagramPoint.x, diagramPoint.y))
                return true;
        }
        return false;
    }

    private isDiagramEdgeHit(point: Point) {
        const diagramPoint = this.toDiagramCoordinate(point);
        const diagramEdges = this.diagram.getEdges();
        for (var diagramEdge of diagramEdges) {
            if (diagramEdge.isHit(diagramPoint.x, diagramPoint.y))
                return true;
        }
        return false;
    }
}