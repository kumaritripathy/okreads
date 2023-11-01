import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('addBookToReadingList', () => {
    it('makes expected calls', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      const bookStub: Book = <any>{};
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.addBookToReadingList(bookStub);
      expect(storeStub.dispatch).toHaveBeenCalled();
    });
  });

  describe('searchExample', () => {
    it('makes expected calls', () => {
      spyOn(component, 'searchBooks').and.callThrough();
      component.searchExample();
      expect(component.searchBooks).toHaveBeenCalled();
    });
  });

  describe('searchBooks', () => {
    it('makes expected calls', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      spyOn(component, 'searchBooks').and.callThrough();
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.searchBooks();
      expect(component.searchBooks).toHaveBeenCalled();
      expect(storeStub.dispatch).toHaveBeenCalled();
    });
  });
});
