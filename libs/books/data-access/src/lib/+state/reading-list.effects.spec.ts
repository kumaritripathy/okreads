import { TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  SharedTestingModule,
  createReadingListItem,
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Action } from '@ngrx/store';
import { BookConstant, ReadingListItem } from '@tmo/shared/models';

describe('ReadingListEffects', () => {
  let actions: Observable<Action>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should load effects', () => {
      expect(effects).toBeTruthy();
    });

    it('should initialize the reading list items', (done) => {
      actions = of(ReadingListActions.init());
      effects.loadReadingList$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });
      httpMock.expectOne(BookConstant.API.READING_LIST_API).flush([]);
    });

    it('should mark book as finished when update book action is dispatched', (done) => {
      const updatedBook = {
        ...createReadingListItem('test'),
        finished: true,
        finishedDate: '2021-10-12T09:18:15.626Z',
      };

      actions = of(
        ReadingListActions.updateReadingList({
          item: updatedBook,
        })
      );

      effects.updateBook$.subscribe((action) => {
        action['item'].finishedDate = '2021-08-12T09:18:15.626Z';
        expect(action).toEqual(
          ReadingListActions.confirmedUpdateToReadingList({
            item: updatedBook,
          })
        );
        done();
      });
      httpMock
        .expectOne(
          `${BookConstant.API.READING_LIST_API}/test/${BookConstant.API.FINISHED}`
        )
        .flush({ ...updatedBook });
    });

    it('should not mark book as finished when api throws an error', (done) => {
      const err = BookConstant.ERROR;
      actions = of(
        ReadingListActions.updateReadingList({
          item: createReadingListItem('test'),
        })
      );

      effects.updateBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedUpdateToReadingList({ err })
        );
        done();
      });

      httpMock
        .expectOne(
          `${BookConstant.API.READING_LIST_API}/test/${BookConstant.API.FINISHED}`
        )
        .error(new ErrorEvent('HttpErrorResponse'), {
          status: 500,
          statusText: err,
        });
    });
  });
});
