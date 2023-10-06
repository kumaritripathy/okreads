import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
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
        this.http.post('/api/reading-list', book).pipe(
          map(() => {
            this.showSnackbar(
              `The Book ${book.title} is added to reading List`,
              4000,
              'Undo',
              book.title,
              ReadingListActions.removeFromReadingList({
                item: { bookId: book.id, ...book },
              })
            );
            return ReadingListActions.confirmedAddToReadingList({ book });
          }),
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
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() => {
            this.showSnackbar(
              `The Book ${item.title} is removed from the reading List`,
              4000,
              '',
              item.title
            );
            return ReadingListActions.confirmedRemoveFromReadingList({ item });
          }),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  showSnackbar(
    message: string,
    duration = 4000,
    actionName = '',
    bookName?: string,
    action?: TypedAction<string>
  ): void {
    const snackbar = this.snackBar.open(message, actionName, {
      duration: duration,
    });
    snackbar.onAction().subscribe(() => {
      this.store.dispatch(action);
      this.showSnackbar(`Book ${bookName} removed successfully`);
    });
  }
  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient,private snackBar: MatSnackBar,
    private store: Store) {}
}
