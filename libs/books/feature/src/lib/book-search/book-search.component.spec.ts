import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
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
        provideMockStore({ initialState: { books: { entities: [] } } })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('Should add books to the reading list', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      const bookStub: Book = <any>{};
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.addBookToReadingList(bookStub);
      expect(storeStub.dispatch).toHaveBeenCalled();
    });


    it('Should list book based on search user enter', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      spyOn(component, 'searchBooks').and.callThrough();
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.searchBooks();
      expect(component.searchBooks).toHaveBeenCalled();
      expect(storeStub.dispatch).toHaveBeenCalled();
    });  

    it('should enable the search button when search term is provided', () => {
      const term = component.searchForm.controls['term'];
      term.setValue('javascript');
      fixture.detectChanges();
      const searchBtn = fixture.nativeElement.querySelector(
        '[data-testing="search-button"]'
      );
      expect(searchBtn.disabled).toBeFalsy();
    });
});


