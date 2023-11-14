import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should component defined', () => {
    expect(component).toBeDefined();
  });

  it('Should check for the valid input', () => {
    const el = fixture.nativeElement.querySelector('input');
    dispatchEvent(new Event(el));
    fixture.detectChanges();
    expect(el.value).toBeDefined();
  });

  it('Should check for null values', () => {
    const formElement: HTMLFormElement = fixture.debugElement.nativeElement
      .querySelector('#searchForm')
      .querySelectorAll('input')[0];
    formElement.value = 'javascript';
    formElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      const bookName = component.searchForm.get('term');
      expect(formElement.value).toEqual(bookName.value);
      expect(bookName.errors).toBeNull();
    });
  });

  it('Should check for text entered and no result for the searched', () => {
    fixture.whenStable().then(() => {
      spyOn(component, 'onSearchBookChange');
      const searchEle = fixture.debugElement.nativeElement.querySelector(
        '#searchTerm'
      );
      searchEle.value = 'JavaScript';
      searchEle.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.onSearchBookChange).toHaveBeenCalledWith('JavaScript');
      expect(searchEle.value).toEqual([])
    });
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
