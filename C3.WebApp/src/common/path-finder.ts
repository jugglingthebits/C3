import {Point, Direction} from './edge-base';

export interface PathFinder {
    findPath(sourcePoint: Point, outgoingDirection: Direction, 
             targetPoint: Point, incomingDirection: Direction): Point[];
}

export class StraightPathFinder implements PathFinder {
    findPath(sourcePoint: Point, outgoingDirection: Direction, 
             targetPoint: Point, incomingDirection: Direction): Point[] {
        const path = [];
        path.push(sourcePoint);
        path.push(targetPoint);

        return path;
    }    
}

export class PerpendicularPathFinder implements PathFinder {
    findPath(sourcePoint: Point, outgoingDirection: Direction, 
             targetPoint: Point, incomingDirection: Direction): Point[] {
        const path = [];
        path.push(sourcePoint);
        
        const diffX = targetPoint.x - sourcePoint.x;
        const diffY = targetPoint.y - sourcePoint.y;
        
        if (Math.abs(diffX) !== 0 && Math.abs(diffY) !== 0) {
            if (outgoingDirection === Direction.West || outgoingDirection === Direction.East) {
                const point1X = sourcePoint.x + diffX/2;
                const point1Y = sourcePoint.y;
                path.push({x: point1X, y: point1Y});
                
                const point2X = sourcePoint.x + diffX/2;
                const point2Y = targetPoint.y;
                path.push({x: point2X, y: point2Y});
            } else {
                const point1X = sourcePoint.x;
                const point1Y = sourcePoint.y + diffY/2;
                path.push({x: point1X, y: point1Y});
                
                const point2X = targetPoint.x;
                const point2Y = targetPoint.y - diffY/2;
                path.push({x: point2X, y: point2Y});
            }
        }
        
        path.push(targetPoint);
        return path;
    }
}
