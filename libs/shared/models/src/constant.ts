export const UndoActionConstant = {
    BOOK_SEARCH: {
        PLACEHOLDER_TEXT: 'Search for books to add to your reading list',
        SEARCH: 'search',
        AUTHOR: 'Author',
        PUBLISHER: 'Publisher',
        PUBLISHED: 'Published',
        WANT_TO_READ: 'Want to Read',
        SEARCH_EXAMPLE_TEXT: 'Try searching for a topic, for example',
        JAVASCRIPT: 'JavaScript'
    },
    READING_LIST: {
        REMOVE_CIRCLE: 'remove_circle',
        EMPTY_LIST_TEXT: "You haven't added any books to your reading list yet."
    },
    TITLE: 'okreads',
    READING_LIST_TEXT: 'Reading List',
    MY_READING_LIST: 'My Reading List',
    CLOSE: 'close',
    SNACKBAR_CONSTANTS: {
        BOOK_ADDED_TEXT: 'is added to the reading list!',
        BOOK_REMOVED_TEXT: 'is removed from the reading list!',
        UNDO: 'Undo',
        DURATION: 4000,
        REMOVE: 'remove',
        ADD: 'add',
        BOOK_REMOVED_CLASS: 'bookRemoved',
        BOOK_ADDED_CLASS: 'bookAdded'
      }
}
 export const API = {
   BOOKS_SEARCH_API: '/api/books/search?q=',
   READING_LIST_API: '/api/reading-list'
 };
