import {Point, Direction} from './edge-base';
import {ConnectionPoint} from './node-base';

export interface PathFinder {
    findPath(sourceConnectionPoints: ConnectionPoint[], 
             targetConnectionPoints: ConnectionPoint[]): Point[];
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
        return currentLength;
    }, 0);
    
    return length;
}

export class StraightPathFinder implements PathFinder {
    findPath(sourceConnectionPoints: ConnectionPoint[], 
             targetConnectionPoints: ConnectionPoint[]): Point[] {
        
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
    
    private findAPath(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint): Point[] {
        const directPath = [sourcePoint.point, targetPoint.point];
        return directPath;
    }
}

// export class PerpendicularPathFinder implements PathFinder {
//     findPath(sourceConnectionPoints: ConnectionPoint[], 
//              targetConnectionPoints: ConnectionPoint[]): Point[] {
//         const connectionPointCombinations = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

//         const shortestConnectionPointCombination = connectionPointCombinations.reduce((previousShortestConnectionPoints, currentConnectionPoints) => {
//             const previousPath = this.findAPath(previousShortestConnectionPoints[0], previousShortestConnectionPoints[1]);
//             const currentPath = this.findAPath(currentConnectionPoints[0], currentConnectionPoints[1]);
            
//             const previousLength = lengthOf(previousPath);
//             const currentLength = lengthOf(currentPath);
            
//             const shorterPath = (currentLength < previousLength) ? currentConnectionPoints : previousShortestConnectionPoints;
//             return shorterPath;
//         });
        
//         const path = this.findAPath(shortestConnectionPointCombination[0], shortestConnectionPointCombination[1]);
//         return path;
//     }
    
//     private findAPath(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint): Point[] {
//         const diffX = targetPoint.x - sourcePoint.x;
//         const diffY = targetPoint.y - sourcePoint.y;
        
//         if (Math.abs(diffX) === 0 || Math.abs(diffY) === 0) {
//             const directPath = [sourcePoint.point, targetPoint.point];
//             return directPath;
//         }
        
//         const path = [];
//         if (outgoingDirection === Direction.West || outgoingDirection === Direction.East) {
//             const point1X = sourcePoint.x + diffX/2;
//             const point1Y = sourcePoint.y;
//             path.push({x: point1X, y: point1Y});
            
//             const point2X = sourcePoint.x + diffX/2;
//             const point2Y = targetPoint.y;
//             path.push({x: point2X, y: point2Y});
//         } else {
//             const point1X = sourcePoint.x;
//             const point1Y = sourcePoint.y + diffY/2;
//             path.push({x: point1X, y: point1Y});
            
//             const point2X = targetPoint.x;
//             const point2Y = targetPoint.y - diffY/2;
//             path.push({x: point2X, y: point2Y});
//         }
        
//         return path;
//     }
// }
