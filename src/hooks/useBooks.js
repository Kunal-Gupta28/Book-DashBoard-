import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '../services/api';
import toast from 'react-hot-toast';

export const useBooks = () => {
  const queryClient = useQueryClient();

  // Get all books
  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getAllBooks,
  });

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: bookApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add book. Please try again.');
      console.error('Error adding book:', error);
    },
  });

  // Update book mutation
  const updateBookMutation = useMutation({
    mutationFn: ({ id, bookData }) => bookApi.updateBook(id, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update book. Please try again.');
      console.error('Error updating book:', error);
    },
  });

  // Delete book mutation
  const deleteBookMutation = useMutation({
    mutationFn: bookApi.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete book. Please try again.');
      console.error('Error deleting book:', error);
    },
  });

  return {
    books,
    isLoading,
    error,
    createBook: createBookMutation.mutate,
    updateBook: updateBookMutation.mutate,
    deleteBook: deleteBookMutation.mutate,
    isCreating: createBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending,
  };
};

export default useBooks; 