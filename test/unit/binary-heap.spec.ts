import {BinaryHeap} from 'src/common/binary-heap';

class MockElement {
    score: number;    
}

describe('the binary heap', () => {
    let heap: BinaryHeap<MockElement>;
    
    beforeEach(() => {
         heap = new BinaryHeap<MockElement>(e => e.score);
    });
    
    describe('pull', () => {
        it('should return the previously pushed object', () => {
            const value = {score: 1};
            heap.push(value);
            expect(heap.pop()).toBe(value);    
        });
        
        it('should return undefined when empty', () => {
            expect(heap.pop()).toBeUndefined();
        });
        
        it('should return objects in the right order', () => {
            const values = [];
            for (let i=0; i<100; i++) {
                values.push({score: i});
                heap.push(values[i]);
            }
            
            for (let i=0; i<=99; i++) {
                expect(heap.pop()).toBe(values[i]);
            }
        });
    });
    
    describe('size', () => {
        it('should return 0 when empty', () => {
            expect(heap.size).toBe(0);    
        });
        
        it('should return 100 when there are 100 elements', () => {
            for (let i=0; i<100; i++) {
                heap.push({score: i});
            }
            expect(heap.size).toBe(100);
        });
        
        it('should return 1 less after pop', () => {
            for (let i=0; i<100; i++) {
                heap.push({score: i});
            }
            heap.pop();
            expect(heap.size).toBe(99);
        });
    });
});
