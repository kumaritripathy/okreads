import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

import { getAllBooks, searchBooks } from '@tmo/books/data-access';
import { Store } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState: { books: { entities: [] } } }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, [
      { ...createBook('A'), isAdded: false },
      { ...createBook('B'), isAdded: false },
    ]);
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });
  it('should dispatch searchBooks action when search button is clicked', () => {
    const term = component.searchForm.controls['term'];
    term.setValue('javascript');
    fixture.detectChanges();
    const searchBtn = fixture.nativeElement.querySelector(
      '[data-testing="search-button"]'
    );
    searchBtn.click();
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
  });

  it('should component defined', () => {
    expect(component).toBeDefined();
  });

  it('Should add books to the reading list', () => {
    const storeStub: Store = fixture.debugElement.injector.get(Store);
    const bookStub: Book = <any>{};
    spyOn(storeStub, 'dispatch').and.callThrough();
    component.addBookToReadingList(bookStub);
    expect(storeStub.dispatch).toHaveBeenCalled();
  });

  it('Should allow user to enter book name', () => {
    spyOn(component, 'searchBooks').and.callThrough();
    component.searchExample();
    expect(component.searchBooks).toHaveBeenCalled();
  });

  it('Should list book based on search user enter', () => {
    const storeStub: Store = fixture.debugElement.injector.get(Store);
    spyOn(component, 'searchBooks').and.callThrough();
    spyOn(storeStub, 'dispatch').and.callThrough();
    component.searchBooks();
    expect(component.searchBooks).toHaveBeenCalled();
    expect(storeStub.dispatch).toHaveBeenCalled();
  });
});
