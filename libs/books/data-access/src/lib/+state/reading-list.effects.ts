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
import { UndoActionConstant} from '@tmo/shared/models';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(UndoActionConstant.API.READING_LIST_API).pipe(
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
        this.http.post(UndoActionConstant.API.READING_LIST_API, book).pipe(
          map(() => {
            this.showSnackbar(
              `${book.title} ${UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_ADDED_TEXT}`,
              UndoActionConstant.SNACKBAR_CONSTANTS.DURATION,
              UndoActionConstant.SNACKBAR_CONSTANTS.UNDO,
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
        this.http.delete(`${UndoActionConstant.API.READING_LIST_API}/${item.bookId}`).pipe(
          map(() => {
            this.showSnackbar(
              `${item.title}${UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_TEXT}`,
              UndoActionConstant.SNACKBAR_CONSTANTS.DURATION,
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
      this.showSnackbar(`${bookName} ${UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_TEXT}`);
    });
  }
  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient,private snackBar: MatSnackBar,
    private store: Store) {}
}
