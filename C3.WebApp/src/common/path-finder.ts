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

export class StraightPathFinder implements PathFinder {
    findPath(sourceConnectionPoints: ConnectionPoint[], 
             targetConnectionPoints: ConnectionPoint[]): Point[] {
        
        const allPaths = cartesianProduct([sourceConnectionPoints, targetConnectionPoints]);

        // const pathWithLengths = allPaths.map(p => {
        //     const path = this.findAPath(p[0], p[1]);
        //     const length = this.lengthOf(path);
        //     return [path, length];
        // });
        
        const shortestPath = allPaths.reduce((previousValue, currentValue) => {
            const previousPath = this.findAPath(previousValue[0], previousValue[1]);
            const currentPath = this.findAPath(currentValue[0], currentValue[1]);
            
            const previousLength = this.lengthOf(previousPath);
            const currentLength = this.lengthOf(currentPath);
            
            return (currentLength < previousLength) ? currentValue : previousValue;
        });
        
        const path = this.findAPath(shortestPath[0], shortestPath[1]);
        return path;
    }
    
    private findAPath(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint): Point[] {
        return [sourcePoint.point, targetPoint.point];
    }
    
    private lengthOf(path: Point[]): number {

        const length: number = path.reduce((previousValue, currentValue, currentIndex, array) => {
            if (currentIndex === 0)
                return 0;
            
            var a = currentValue.x - array[currentIndex-1].x;
            var b = currentValue.y - array[currentIndex-1].y;;

            var currentLength = Math.sqrt( a*a + b*b );
            return currentLength;
        }, 0);
        
        return length;
    }
}

// export class PerpendicularPathFinder implements PathFinder {
//     findPath(sourceConnectionPoints: ConnectionPoint[], 
//              targetConnectionPoints: ConnectionPoint[]): Point[] {
//         const path = [];
//         path.push(sourcePoint);
        
//         const diffX = targetPoint.x - sourcePoint.x;
//         const diffY = targetPoint.y - sourcePoint.y;
        
//         if (Math.abs(diffX) !== 0 && Math.abs(diffY) !== 0) {
//             if (outgoingDirection === Direction.West || outgoingDirection === Direction.East) {
//                 const point1X = sourcePoint.x + diffX/2;
//                 const point1Y = sourcePoint.y;
//                 path.push({x: point1X, y: point1Y});
                
//                 const point2X = sourcePoint.x + diffX/2;
//                 const point2Y = targetPoint.y;
//                 path.push({x: point2X, y: point2Y});
//             } else {
//                 const point1X = sourcePoint.x;
//                 const point1Y = sourcePoint.y + diffY/2;
//                 path.push({x: point1X, y: point1Y});
                
//                 const point2X = targetPoint.x;
//                 const point2Y = targetPoint.y - diffY/2;
//                 path.push({x: point2X, y: point2Y});
//             }
//         }
        
//         path.push(targetPoint);
//         return path;
//     }
// }
