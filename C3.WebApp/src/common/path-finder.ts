import {Point} from './edge-base';

export interface PathFinder {
    findPath(sourceConnectionPoints: Point[], 
             targetConnectionPoints: Point[]): Point[];
}

function cartesianProduct<T>(array: Array<Array<T>>): Array<Array<T>>
{
    const reduce = array.reduce((previousValue, currentValue) => {
        const aMap = previousValue.map(value => {
            const bMap = currentValue.map(innerValue => {
                const concat = value.concat(innerValue);
                return concat;
            });
            return bMap;
        });
        
        const aMapReduce = aMap.reduce((innerPreviousValue, innerCurrentValue) => { 
            const concat = innerPreviousValue.concat(innerCurrentValue);
            return concat; 
        }, []);

        return aMapReduce;
    }, [[]]);
    return reduce;
}

function lengthOf(path: Point[]): number {
    const length: number = path.reduce((previousValue, currentValue, currentIndex, array) => {
        if (currentIndex === 0)
            return 0;
        
        var a = currentValue.x - array[currentIndex-1].x;
        var b = currentValue.y - array[currentIndex-1].y;

        var currentLength = Math.sqrt( a*a + b*b );
        return previousValue + currentLength;
    }, 0);
    
    return length;
}

export class StraightPathFinder implements PathFinder {
    findPath(sourceConnectionPoints: Point[], 
             targetConnectionPoints: Point[]): Point[] {
        
        const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
            const previousPath = this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1]);
            const currentPath = this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1]);
            
            const previousLength = lengthOf(previousPath);
            const currentLength = lengthOf(currentPath);
            
            const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
            return shorterPath;
        });
        
        const path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1]);
        return path;
    }
    
    private findAPath(sourcePoint: Point, targetPoint: Point): Point[] {
        const directPath = [sourcePoint, targetPoint];
        return directPath;
    }
}

export class PerpendicularPathFinder implements PathFinder {
    findPath(sourceConnectionPoints: Point[], 
             targetConnectionPoints: Point[]): Point[] {
        const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
            const previousPath = this.findShortestPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1]);
            const currentPath = this.findShortestPath(currentConnectionPoints[0], currentConnectionPoints[1]);
            
            const previousLength = lengthOf(previousPath);
            const currentLength = lengthOf(currentPath);
            
            const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
            return shorterPath;
        });
        
        const path = this.findShortestPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1]);
        return path;
    }
    
    private findShortestPath(sourcePoint: Point, targetPoint: Point): Point[] {
        const diffX = Math.abs(targetPoint.x - sourcePoint.x);
        const diffY = Math.abs(targetPoint.y - sourcePoint.y);

        const path1 = [sourcePoint, 
                       <Point>{x: sourcePoint.x + diffX/2, y: sourcePoint.y},
                       <Point>{x: sourcePoint.x + diffX/2, y: targetPoint.y}, 
                       targetPoint]

        const path2 = [sourcePoint, 
                       <Point>{x: sourcePoint.x, y: sourcePoint.y + diffY/2},
                       <Point>{x: targetPoint.x, y: targetPoint.y - diffY/2}, 
                       targetPoint]

        const path1Length = lengthOf(path1);
        const path2Length = lengthOf(path2);
        const shorterPath = path1Length < path2Length ? path1 : path2;                
        return shorterPath;
    }
}
