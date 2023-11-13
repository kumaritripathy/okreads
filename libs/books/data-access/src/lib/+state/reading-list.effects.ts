import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { UndoActionConstant} from '@tmo/shared/models';
import * as BookConstant from '@tmo/shared/models';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>(BookConstant.API.READING_LIST_API)
          .pipe(
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
      concatMap(({ book, showSnackBar }) => {
        const addedBook = {
          ...book,
          isAdded: true,
        };
        return this.http.post(BookConstant.API.READING_LIST_API, book).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList({
              book: addedBook,
              showSnackBar,
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        );
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) =>
        this.http
          .delete(`${BookConstant.API.READING_LIST_API}/${item.bookId}`)
          .pipe(
            map(() =>
              ReadingListActions.confirmedRemoveFromReadingList({
                item,
                showSnackBar,
              })
            ),
            catchError((error) =>
              of(ReadingListActions.failedRemoveFromReadingList({ error }))
            )
          )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType: UndoActionConstant.SNACKBAR_CONSTANTS.ADD,
          item: { bookId: action.book.id, ...action.book },
        })
      )
    )
  );
  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType: UndoActionConstant.SNACKBAR_CONSTANTS.REMOVE,
          item: action.item,
        })
      )
    )
  );

  openSnackBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.showSnackBar),
      switchMap((action) => {
        const title = action.item.title;
        const { actionType, item } = action;
        return this.snackBar
          .open(
            actionType === UndoActionConstant.SNACKBAR_CONSTANTS.ADD
              ? `${title} - ${UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_ADDED_TEXT}`
              : `${title} - ${UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_TEXT}`,
            UndoActionConstant.SNACKBAR_CONSTANTS.UNDO,
            {
              duration: UndoActionConstant.SNACKBAR_CONSTANTS.DURATION,
              panelClass:
                actionType === UndoActionConstant.SNACKBAR_CONSTANTS.ADD
                  ? UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_ADDED_CLASS
                  : UndoActionConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_CLASS,
            }
          )
          .onAction()
          .pipe(
            map(() =>
              actionType === UndoActionConstant.SNACKBAR_CONSTANTS.ADD
                ? ReadingListActions.removeFromReadingList({
                    item,
                    showSnackBar: false,
                  })
                : ReadingListActions.addToReadingList({
                    book: { id: item.bookId, ...item },
                    showSnackBar: false,
                  })
            )
          );
      })
    )
  );
 
  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}
}
