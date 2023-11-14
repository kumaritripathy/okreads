import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, updateReadingList } from '@tmo/books/data-access';
import { BookConstant } from '@tmo/shared/models';


@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  constructor(private readonly store: Store) {}
  readingList$ = this.store.select(getReadingList);
  bookConstant = BookConstant;

  removeFromReadingList(readingItem) {
    const item = {
      ...readingItem,
      finished: false,
      finishedDate: '',
    };
    this.store.dispatch(removeFromReadingList({ item }));
    this.store.dispatch(updateReadingList({ item }));
  }

  updateReadingList(readingItem) {
    const item = {
      ...readingItem,
      finished: true,
      finishedDate: new Date().toISOString(),
    };
    this.store.dispatch(updateReadingList({ item }));
  }
}
