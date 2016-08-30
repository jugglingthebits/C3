import {SelectionBox} from '../../src/common/selection-box';

describe('the selection-box module', () => {
    var selectionBox: SelectionBox;
    
    beforeEach(() => {
        selectionBox = new SelectionBox();
    });
    
    describe('containsRect', () => {
        it ('should return true if a rect is contained', () => {
            selectionBox.x = 0;
            selectionBox.y = 0;
            selectionBox.width = 200;
            selectionBox.height = 200;
            
            expect(selectionBox.containsRect(10, 10, 100, 100)).toBe(true);
        });
        
        it ('should return false when a rect is not contained', () => {
            selectionBox.x = 50;
            selectionBox.y = 50;
            selectionBox.width = 200;
            selectionBox.height = 200;
            
            expect(selectionBox.containsRect(10, 10, 100, 100)).toBe(false);
        });
    });

});