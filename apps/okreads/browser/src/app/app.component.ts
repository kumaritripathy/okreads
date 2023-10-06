import { Component } from '@angular/core';
import { getReadingList } from '@tmo/books/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store) {}

  readingList$ = this.store.select(getReadingList);

}
