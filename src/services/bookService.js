// Helper to get books from localStorage
const getBooksFromStorage = () => {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
};

// Helper to save books to localStorage
const saveBooksToStorage = (books) => {
  localStorage.setItem('books', JSON.stringify(books));
};

// Initialize books from Google Books API if storage is empty
export const initializeBooks = async () => {
  const existingBooks = getBooksFromStorage();
  if (existingBooks.length === 0) {
    try {
      const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter');
      const data = await response.json();
      
      const transformedBooks = data.items.map(book => ({
        id: book.id,
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
        genre: book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Uncategorized',
        publishedYear: book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : 'Unknown',
        status: Math.random() > 0.5 ? 'Available' : 'Issued',
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || null
      }));
      
      saveBooksToStorage(transformedBooks);
      return transformedBooks;
    } catch (error) {
      console.error('Error initializing books:', error);
      return [];
    }
  }
  return existingBooks;
};

// Get all books
export const getBooks = () => {
  return getBooksFromStorage();
};

// Add a new book
export const addBook = (book) => {
  const books = getBooksFromStorage();
  const newBook = {
    ...book,
    id: Date.now().toString(), // Generate a unique ID
  };
  books.push(newBook);
  saveBooksToStorage(books);
  return newBook;
};

// Update a book
export const updateBook = (id, updatedBook) => {
  const books = getBooksFromStorage();
  const index = books.findIndex(book => book.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    saveBooksToStorage(books);
    return books[index];
  }
  return null;
};

// Delete a book
export const deleteBook = (id) => {
  const books = getBooksFromStorage();
  const filteredBooks = books.filter(book => book.id !== id);
  saveBooksToStorage(filteredBooks);
  return id;
}; 