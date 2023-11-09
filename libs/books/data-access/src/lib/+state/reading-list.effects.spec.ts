import { TestBed } from '@angular/core/testing';
import { Observable,of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem} from '@tmo/shared/models';
import { Action } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import * as BookConstant from '@tmo/shared/models';

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

  describe('loadReadingList$', () => {
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

    it('should dispatch confirmedAddToReadingList from the reading list', (done) => {
      const book: Book = { ...createBook('A') };
      actions = of(ReadingListActions.addToReadingList({ book }));
      effects = TestBed.inject(ReadingListEffects);
      console.log(effects);
      effects.addBook$.subscribe((action) => {
        expect(action.type).toEqual(
          "[Reading List API] Confirmed add to list"
        );
        done();
      });
      httpMock
        .expectOne(BookConstant.API.READING_LIST_API)
        .flush([book]);
    });


    it('should dispatch failedAddToReadingList when api throws an error', (done) => {
      const book: Book = { ...createBook('A')};
      actions = of(
        ReadingListActions.addToReadingList({ book: book})
      );
      const result = ReadingListActions.failedAddToReadingList(error);
      effects.addBook$.subscribe((action) => {
        expect(action.type).toEqual(result.type);
        done();
      });
      httpMock
        .expectOne(BookConstant.API.READING_LIST_API)
        .error(new ErrorEvent('error'));
    });

    it('should dispatch confirmedRemoveFromReadingList when book is removed', (done) => {
      const item = createReadingListItem('A');
      actions = of(
        ReadingListActions.removeFromReadingList({
          item: item
        })
      );
      effects.removeBook$.subscribe((action) => {
        expect(action.type).toEqual(
          "[Reading List API] Confirmed remove from list"
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
        ReadingListActions.removeFromReadingList({ item})
      );
      const outcome = ReadingListActions.failedRemoveFromReadingList(error);
      effects.removeBook$.subscribe((action) => {
        console.log(action);
        expect(action.type).toEqual(outcome.type);
        done();
      });

      httpMock
        .expectOne(`${BookConstant.API.READING_LIST_API}/${item.bookId}`)
        .error(new ErrorEvent('error'));
    });
  });
});
