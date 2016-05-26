import {BinaryHeap} from 'src/common/binary-heap';

describe('the binary heap', () => {
    let heap: BinaryHeap<string>;
    
    beforeEach(() => {
         heap = new BinaryHeap<string>(n => 3);
    });
    
    describe('pull', () => {
        it('should return the previously pushed object', () => {
            heap.push("123");
            expect(heap.pop()).toBe("123");    
        });
        
        it('should return undefined when empty', () => {
            expect(heap.pop()).toBeUndefined();
        });
        
        it('should return objects in the right order', () => {
            for (let i=0; i<100; i++) {
                heap.push(`${i}`);
            }
            
            for (let i=99; i>=0; i++) {
                expect(heap.pop()).toBe(`${i}`);
            }
        });
    });
    
    describe('size', () => {
        it('should return 0 when empty', () => {
            expect(heap.size).toBe(0);    
        });
        
        it('should return 100 when there are 100 elements', () => {
            for (let i=0; i<100; i++) {
                heap.push(`${i}`);
            }
            expect(heap.size).toBe(100);
        });
        
        it('should return 1 less after pop', () => {
            for (let i=0; i<100; i++) {
                heap.push(`${i}`);
            }
            heap.pop();
            expect(heap.size).toBe(100);
        });
    });
});