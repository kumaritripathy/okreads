import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading list reducer', () => {
  describe('Validate Reading list actions', () => {
    let state: State;
    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('Should display the added reading list when added', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });
      const result: State = reducer(initialState, action);
      expect(result.loaded).toBe(true);
      expect(result.ids).toEqual(['A','B','C']);
    });

    it('confirmedRemoveFromReadingList should remove books from the reading list', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B'),
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
    });

    it('should failedRemoveFromReadingList and update state with error message from the reading list', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });
      const result: State = reducer(state, action);
      expect(result.ids).toEqual(['A', 'B']);
    });
  });

  describe('unknown action', () => {    
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
