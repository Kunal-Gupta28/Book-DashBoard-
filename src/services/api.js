import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to generate a placeholder image URL
const getPlaceholderImageUrl = (book) => {
  const title = encodeURIComponent(book.title || 'Book');
  const genre = encodeURIComponent(book.genre || 'Book');
  return `https://placehold.co/400x600/e2e8f0/1e293b?text=${genre}+Book`;
};

// Transform book data to ensure consistent image URLs
const transformBookData = (book) => ({
  ...book,
  imageUrl: book.imageUrl && book.imageUrl.startsWith('http') 
    ? book.imageUrl 
    : getPlaceholderImageUrl(book)
});

export const bookApi = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return response.data.map(transformBookData);
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Get a single book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return transformBookData(response.data);
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },

  // Create a new book
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', {
        ...bookData,
        imageUrl: bookData.imageUrl || getPlaceholderImageUrl(bookData)
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  // Update a book
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, {
        ...bookData,
        imageUrl: bookData.imageUrl || getPlaceholderImageUrl(bookData)
      });
      return transformBookData(response.data);
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  // Delete a book
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },
};

export default bookApi; 