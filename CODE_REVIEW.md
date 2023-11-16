## Component Issues

1. In the book-search.component.html file instead of using submit adding ngSubmit.
   1.1 ngSubmit Use Case -- calls local angular component to do something useful like form validation before postback to browser url/server. It can be used to hijack form submission or control submit process.
   1.2 submit -- It is html default form submit event, it will call underlying method when form gets submitted.
2. In the book-search.component.ts file removing getSearchTerm function and accessing using    formControlName.
   Here, we are using Reactive forms which provide synchronous access to the data model, immutability with observable operators, and change tracking through observable streams.
   2.1 getSearchTerm function return the search term value, that we can also access using formControlName.

3. Removed formatDate function and added date pipe.
   3.1 formatDate function return the formatted date value, so instead of creating a separate function we can use in-built Angular pipes.
   Pipes are simple functions to use in template expressions to accept an input value and return a transformed value. Pipes are useful because we can use them throughout our application, while only declaring each pipe once.

4. Removed ReadingListBook from import from book-search component file.
5. Renamed fb to formBuilder.
6. Renamed term value of searchBooks function.
7. Renamed "let b of books$" to "let bookItem of books$".
   7.1 Variable names should be short yet meaningful.Prefixes of variable and instance names are written in lower case. The first character after the prefix is capitalized.
   In our code,books denote the Array of book items list and the variable bookItem denote single book.
8. We can use async pipe to iterate booklist items in html.Async pipe can handle subscription and unsubscription both {{book?.name}}.
9. We can also define store globally,no need to add in ngOnInit.books\$ = this.store.select(getAllBooks)
10. Removed from p tag [innerHTML]="bookItem.description".
11. Increased text colour from gray40 to gray80 so that contrast ratio between foreground and background colours will be adjusted.
12. Added darker effects for "reading list" and "want to read "so that it will provide hover effect to the buttons.

## Accessibility Issues (Lighthouse Issues)

1. Added "alt" attribute for img tags to provide alternate text if the image fails to load.It is added in book-search.component.html and reading-list.component.html files.

2. Button should have inner text describing action and role defined

3. Added aria-label to link in book.component.html file ( Try searching for a topic, for example Javascript").
 3.1 ARIA helps you provide a good experience for users who use screen readers (software that outputs text as audio or braille) and other types of assistive technology (AT).

## Data Access Layer (NgRx Issues)

1. ngrxOnInitEffects is lifecycle method that would be called after the ComponentStore is instantiated, or potentially after the ComponentStore has been initialized which could be done eagerly or lazily.Removed ngrxOnInitEffects() as we don't want to initialize Reading list component as soon as component loads.

## Unit Testing

1. In the book-search.component.spec.ts file
   1.1 addBookToReadingList - This test code dispatch reading list action from store.
   1.2 searchExample - When the search list is empty,we show the text "javascript",we are setting the value using setValue method that will trigeer the searchBook event.
   1.3 searchBooks - This will trigger searchBooks event after getting the search term.

## Renamed test case name

1. ('Should undo the book removal when book removal failed', () => {})
2. describe('Reading list reducer', () => {})
3. describe('Valid reading list actions', () => {})
4. it('Should load reading list when new reading list was created', () => {})

## Correct the component name In libs/books/feature/src/lib/book-search/book-search.component.spec.ts:
1. describe('BookSearchComponent', () => {})
2. it('should component defined', () => {})

## In package.json:
"scripts": {"start": "set NODE_OPTIONS=--openssl-legacy-provider && nx serve okreads",}

Angular version - 10.0.10
Node version - less than 14

In my system angular version in 13 and node version is 18, To install the dependencies
I have to run the command npm i --legacy-peer-deps and to run this project I have added 
the above command in package.json file.

