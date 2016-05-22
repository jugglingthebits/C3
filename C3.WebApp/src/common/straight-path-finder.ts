import {Point, PathFinder} from './edge-base';

export class StraightPathFinder extends PathFinder {
    findPath(sourcePoint: Point, targetPoint: Point): Point[] {
        const path = [];
        path.push(sourcePoint);
        path.push(targetPoint);

        return path;
    }    
}
