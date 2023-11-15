import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, BookConstant } from '@tmo/shared/models';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { Subscription } from 'rxjs';



@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$ = this.store.select(getAllBooks);
  bookConstant = BookConstant;
  instantSearchSubscription: Subscription;
  searchForm = this.formBuilder.group({
    term: '',
  });

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder
  ) {}

 
  ngOnInit(): void {
    this.onSearchBookChange();
  }

  onSearchBookChange() {
    if(this.searchForm.value.term){
      this.instantSearchSubscription = this.searchForm.controls.term.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((change) => {
        return this.store.dispatch(searchBooks({ term: this.searchForm.value.term}));
      });
    } 
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchForm.value.term }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy(): void {
    this.instantSearchSubscription.unsubscribe();
  }
}
