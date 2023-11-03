import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

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

  it('should create', () => {
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
});
