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
        for (let i = 0, j = 0; i <= height; i += gridSpacing, j++) {
            this.entries[j] = [];
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
        this.sparseMatrix = new SparseMatrix<Node>(this.diagramBoundingBox.height);
    }

    reset() {
        const nodes = this.sparseMatrix.getAllEntries();
        for (let node of nodes) {
            node.reset();
        }
    }

    getNode(point: Point): Node {
        const diagramX = point.x - this.diagramBoundingBox.x;
        const diagramY = point.y - this.diagramBoundingBox.y;
        const gridY = this.toGridCoordinate(diagramY);
        const gridX = this.toGridCoordinate(diagramX);
        const node = this.getEntry(gridX, gridY);
        return node;
    }

    getNeighbors(node: Node): Node[] {
        if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
            return [];

        let neighbors: Node[] = [];
        const gridX = this.toGridCoordinate(node.x);
        const gridY = this.toGridCoordinate(node.y);

        if (node.x > 0) {
            const leftNeighbor = this.getEntry(gridX - 1, gridY);
            neighbors.push(leftNeighbor);
        }
        if (node.x < this.diagramBoundingBox.width - 1) {
            const rightNeighbor = this.getEntry(gridX + 1, gridY);
            neighbors.push(rightNeighbor);
        }
        if (node.y > 0) {
            const topNeighbor = this.getEntry(gridX, gridY - 1);
            neighbors.push(topNeighbor);
        }
        if (node.y < this.diagramBoundingBox.height - 1) {
            const bottomNeighbor = this.getEntry(gridX, gridY + 1);
            neighbors.push(bottomNeighbor);
        }
        return neighbors;
    }

    private getEntry(x: number, y: number): Node {
        let node = this.sparseMatrix.getEntry(x, y);
        if (!node) {
            node = new Node({ x: x * gridSpacing, y: y * gridSpacing });
            node.isOccupied = this.isDiagramNodeHit(node) || this.isDiagramEdgeHit(node);
            this.sparseMatrix.addEntry(x, y, node);
        }
        return node;
    }

    private toGridCoordinate(value: number): number {
        if (value % gridSpacing !== 0)
            //throw `{value} is not within the grid`;
            value = Math.round(value / gridSpacing) * gridSpacing;

        return value / gridSpacing;
    }

    private isDiagramNodeHit(node: Node) {
        const diagramX = node.x + this.diagramBoundingBox.x;
        const diagramY = node.y + this.diagramBoundingBox.y;

        const diagramNodes = this.diagram.getNodes();
        for (var diagramNode of diagramNodes) {
            if (diagramNode.isHit(diagramX, diagramY))
                return true;
        }
        return false;
    }

    private isDiagramEdgeHit(node: Node) {
        const diagramX = node.x + this.diagramBoundingBox.x;
        const diagramY = node.y + this.diagramBoundingBox.y;

        const diagramEdges = this.diagram.getEdges();
        for (var diagramEdge of diagramEdges) {
            if (diagramEdge.isHit(diagramX, diagramY))
                return true;
        }
        return false;
    }
}