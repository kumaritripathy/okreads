import { TestBed } from '@angular/core/testing';
import { Observable,of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem,BookConstant} from '@tmo/shared/models';
import { Action } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';


describe('ToReadEffects', () => {
  let actions: Observable<Action>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  const error:any = new ErrorEvent('error' );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList', () => {
    it('should initialize the reading list items', done => {
      actions = of(ReadingListActions.init());
      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });
      httpMock.expectOne(BookConstant.API.READING_LIST_API).flush([]);
    });
  })
  describe('addBook', () => {
    it('should dispatch confirmedAddToReadingList when book is added to the reading list', (done) => {
      const book: Book = { ...createBook('A'), isAdded: true };
      actions = of(
        ReadingListActions.addToReadingList({ book, showSnackBar: true })
      );

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({
            book,
            showSnackBar: true
          })
        );
        done();
      });

      httpMock
        .expectOne(`${BookConstant.API.READING_LIST_API}`)
        .flush([book]);
    });

    it('should dispatch failedAddToReadingList when api throws an error', (done) => {
      const book: Book = { ...createBook('A'), isAdded: false };
      actions = of(
        ReadingListActions.addToReadingList({ book: book, showSnackBar: false })
      );
      const result = ReadingListActions.failedAddToReadingList(
        new ErrorEvent('error')
      );

      effects.addBook$.subscribe((action) => {
        expect(action.type).toEqual(result.type);
        done();
      });

      httpMock
        .expectOne(`${BookConstant.API.READING_LIST_API}`)
        .error(new ErrorEvent('error'));
    });
  });

  describe('removeBook', () => {
    it('should dispatch confirmedRemoveFromReadingList  from the reading list', (done) => {
      const item = createReadingListItem('A');
      actions = of(
        ReadingListActions.removeFromReadingList({
          item: item,
          showSnackBar: true
        })
      );

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item: item,
            showSnackBar: true
          })
        );
        done();
      });

      httpMock
        .expectOne(`${BookConstant.API.READING_LIST_API}/${item.bookId}`)
        .flush([item]);
    });

    it('should dispatch failedRemoveFromReadingList when api throws an error', (done) => {
      const item: ReadingListItem = createReadingListItem('A');
      actions = of(
        ReadingListActions.removeFromReadingList({ item, showSnackBar: true })
      );
      const outcome = ReadingListActions.failedRemoveFromReadingList(
        new ErrorEvent('error')
      );

      effects.removeBook$.subscribe((action) => {
        expect(action.type).toEqual(outcome.type);
        done();
      });

      httpMock
        .expectOne(`${BookConstant.API.READING_LIST_API}/${item.bookId}`)
        .error(new ErrorEvent('error'));
    });
  });

  describe('undoAddBook', () => {
    it('should undo addition of book when showSnackbar action is dispatched', (done) => {
      const book: Book = { ...createBook('A'), isAdded: true };
      actions = of(
        ReadingListActions.confirmedAddToReadingList({
          book: book,
          showSnackBar: true
        })
      );

      effects.undoAddBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.showSnackBar({
            actionType: BookConstant.SNACKBAR_CONSTANTS.ADD,
            item: { bookId: book.id, ...book }
          })
        );
        done();
      });
    });
  });

  describe('undoRemoveBook', () => {
    it('should undo removal of book when showSnackbar action is dispatched', (done) => {
      const item: ReadingListItem = createReadingListItem('A');
      actions = of(
        ReadingListActions.confirmedRemoveFromReadingList({
          item: item,
          showSnackBar: true
        })
      );

      effects.undoRemoveBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.showSnackBar({
            actionType: BookConstant.SNACKBAR_CONSTANTS.REMOVE,
            item: action.item
          })
        );
        done();
      });
    });
  });
});
   