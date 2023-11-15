import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('validate Books actions', () => {
    it('should loadBooksSuccess and return set the list of Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });
      const result: State = reducer(initialState, action);
      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
  }); 
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = reducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });
});
