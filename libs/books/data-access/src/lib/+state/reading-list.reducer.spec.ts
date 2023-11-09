import { BookConstant } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A','B']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
    });
  
it('should confirmedUpdateToReadingList should mark book as finished in the state', () => {
      const bookFinished = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: new Date().toISOString()
      };
      const action = ReadingListActions.updateReadingList({
        item: bookFinished
      });
 
      const result: State = reducer(state, action);
      expect(result.entities['A']?.finished).toBeTruthy();
    });
 
    it('should failedUpdateToReadingList should not mark book as finished in the state', () => {
      const action = ReadingListActions.failedUpdateToReadingList({
        err: BookConstant.ERROR
      });
 
      const result: State = reducer(state, action);
      expect(result.error).toEqual(BookConstant.ERROR);
    });
  });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

