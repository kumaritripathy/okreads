import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  createReadingListItem,
  SharedTestingModule,
} from '@tmo/shared/testing';
 
import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { UndoActionConstant } from '@tmo/shared/models';
 
 
describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            readingList: { entities: [] }
          }
        })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));
 
  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getReadingList, [
      {
        ...createReadingListItem('testing'),
        isAdded: true
      }
    ]);
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });
 
  it('should show the reading list when books are added', () => {
    const bookCover = fixture.nativeElement.querySelector(
      '[data-testing="book-cover"]'
    );
    const bookTitle = fixture.nativeElement.querySelector(
      '[data-testing="book-title"]'
    );
    const bookAuthorName = fixture.nativeElement.querySelector(
      '[data-testing="book-author-name"]'
    );
 
    expect(bookCover).toBeTruthy();
    expect(bookTitle.innerHTML.trim()).toBe('Book testing');
    expect(bookAuthorName.innerHTML.trim()).toBe('Author testing');
  });
 
  it('should dispatch removeFromReadingList action when remove button is clicked', () => {
    const bookItem = { ...createReadingListItem('testing'), isAdded: true };
    const removeButton = fixture.nativeElement.querySelector(
      '[data-testing="remove-book"]'
    ) as HTMLButtonElement;
 
    removeButton.click();
 
    expect(store.dispatch).toHaveBeenCalledWith(
      removeFromReadingList({
        item: bookItem, showSnackBar: true
      })
    );
  });
 
  it('should show the empty text when no books are added', () => {
    store.overrideSelector(getReadingList, []);
 
    store.refreshState();
    fixture.detectChanges();
    const emptyText = fixture.nativeElement.querySelector(
      '[data-testing="empty-text"]'
    );
 
    expect(emptyText.innerHTML.trim()).toBe(
      UndoActionConstant.READING_LIST.EMPTY_LIST_TEXT
    );
  });
});