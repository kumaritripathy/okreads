## we can use async pipe in this case to iterate data in html.

## we can define store globally,no need to add in ngOninit. books$ = this.store.select(getAllBooks)

## This pipe can handle subscription and unsubscription both.

   {{book?.name}}