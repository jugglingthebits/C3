import { Point } from "./edge-base";
import { BoundingBox, DiagramBase } from "./diagram-base";

const gridSpacing = 10;

export function manhattanHeuristic(pos0: Point, pos1: Point): number {
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

export class GraphForDiagram {
    // TODO: It would probably be much more efficient to use a sparse matrix 
    private grid: Node[][];
    private diagramBoundingBox: BoundingBox;
    
    constructor(private diagram: DiagramBase) {
        this.diagramBoundingBox = this.diagram.getBoundingBox();
        this.buildGrid();
    }
    
    getNode(point: Point): Node {
        const x = point.x - this.diagramBoundingBox.x;
        const y = point.y - this.diagramBoundingBox.y;
        
        const gridY = this.toGrid(y);
        const gridX = this.toGrid(x);
        const node = this.grid[gridY][gridX];
        return node;
    }
    
    getCost(node: Node, previousNode: Node, penultimateNode: Node): number {
        // Does the node intersect with a different node?
        if (node.isOccupied) {
            return 1000;
        }
        
        // Is the node in line with the last ones?
        if (!previousNode || !penultimateNode
         || node.x === previousNode.x && previousNode.x === penultimateNode.x 
         || node.y === previousNode.y && previousNode.y === penultimateNode.y )
            return 1;
        
        // Take a turn.
        return 10;
    }
    
    getFullPath(endNode: Node): Point[] {
        let currentNode = endNode;
        const path: Point[] = [];
        while (currentNode.parent) {
            const point = <Point>{x: currentNode.x + this.diagramBoundingBox.x, 
                                  y: currentNode.y + this.diagramBoundingBox.y};
            
            path.unshift(point);
            currentNode = currentNode.parent;
        }
        const point = <Point>{x: currentNode.x + this.diagramBoundingBox.x, 
                              y: currentNode.y + this.diagramBoundingBox.y};

        path.unshift(point);
        return path;
    }
    
    getNeighbors(node: Node): Node[] {
        if (this.diagramBoundingBox.width === 0 || this.diagramBoundingBox.height === 0)
            return [];
        
        let neighbors: Node[] = [];
        const gridX = this.toGrid(node.x);
        const gridY = this.toGrid(node.y);
        
        if (node.x > 0) {
            const leftNeighbor = this.grid[gridY][gridX - 1];
            neighbors.push(leftNeighbor);
        }
        if (node.x < this.diagramBoundingBox.width - 1) {
            const rightNeighbor = this.grid[gridY][gridX + 1];
            neighbors.push(rightNeighbor);
        }
        if (node.y > 0) {
            const topNeighbor = this.grid[gridY - 1][gridX];
            neighbors.push(topNeighbor);
        }
        if (node.y < this.diagramBoundingBox.height - 1) {
            const bottomNeighbor = this.grid[gridY + 1][gridX];
            neighbors.push(bottomNeighbor);
        }
        return neighbors;
    }
    
    private toGrid(value: number): number {
        if (value % gridSpacing !== 0)
            //throw `{value} is not within the grid`;
            value = Math.round(value / gridSpacing) * gridSpacing;

        return value/gridSpacing;
    }
        
    private buildGrid() {
        this.grid = [];
        for (var i=0; i <= this.diagramBoundingBox.height; i=i+gridSpacing) {
            let row = [];
            for (var j=0; j <= this.diagramBoundingBox.width; j=j+gridSpacing) {
                const node = new Node({x: j, y: i});
                node.isOccupied = this.isDiagramNodeHit(node) || this.isDiagramEdgeHit(node);
                row.push(node);
            }
            this.grid.push(row);
        }
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