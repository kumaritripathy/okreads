import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { BookConstant, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects  {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(BookConstant.API.READING_LIST_API).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post(BookConstant.API.READING_LIST_API, book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`${BookConstant.API.READING_LIST_API}/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
