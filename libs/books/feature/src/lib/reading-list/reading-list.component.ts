import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { removeFromReadingList, updateReadingList } from '@tmo/books/data-access';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  @Input() readingList = [];
  constructor(private readonly store: Store) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
      item.finished = false,
      item.finishedDate = "",
      this.store.dispatch(updateReadingList({ item }));
  }

  updateReadingList(item) {
      this.store.dispatch(updateReadingList({ item }));
  }
}
