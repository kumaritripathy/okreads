## Component Issues

1. In the book-search.component.html file instead of using submit adding ngSubmit.
2. In the book-search.component.ts file removing getSearchTerm function and accessing using formControlName.
3. Removed formatDate function and added date pipe.
4. Removed ReadingListBook from import from book-search component file.
5. Updated fb to formBuilder.
6. Updated term value of searchBooks function.
7. Renamed "let b of books$" to "let bookItem of books$".
8. We can use async pipe to iterate booklist items in html.Async pipe can handle subscription and unsubscription both {{book?.name}}.
9. We can also define store globally,no need to add in ngOnInit.books\$ = this.store.select(getAllBooks)
10. Removed from p tag [innerHTML]="bookItem.description".

## Accessibility Issues (Lighthouse Issues)

1. Added "alt" attribute for img tags to provide alternate text if the image fails to load.It is added in book-search.component.html and reading-list.component.html files.
2. Increased text colour from gray40 to gray80 so that contrast ratio between foreground and background colours will be adjusted.
3. Button have clear labels and that all graphical control have accurate.
4. Added darker effects for "reading list" and "want to read "so that it will provide hover effect to the buttons.
5. Added aria-label to link in book.component.html file ( Try searching for a topic, for example Javascript").
## Data Access Layer (NgRx Issues)

1. ngrxOnInitEffects is lifecycle method that would be called after the ComponentStore is instantiated, or potentially after the ComponentStore has been initialized which could be done eagerly or lazily.Removed ngrxOnInitEffects() as we don't want to initialize Reading list component as soon as component loads.


## Testing 

1. In the book-search.component.spec.ts file
   1.1 addBookToReadingList - This test code dispatch reading list action from store.
   1.2 searchExample -  When the search list is empty,we show the text "javascript",we are setting the value using setValue method that will trigeer the searchBook event.
   1.3 searchBooks - This will trigger searchBooks event after getting the search term.
  