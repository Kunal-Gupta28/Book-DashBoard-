import React, { useState } from "react";
import toast from "react-hot-toast";
import BookModal from "../components/BookModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { BookTableSkeleton } from "../components/BookTableSkeleton";
import CursorEffect from "../components/CursorEffect";
import { PlusIcon, MagnifyingGlassIcon, ViewColumnsIcon, TableCellsIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import useBooks from "../hooks/useBooks";

const getBookImageUrl = (book) => {
  // If the book has a valid imageUrl, use it
  if (book.imageUrl && book.imageUrl.startsWith('http')) {
    return book.imageUrl;
  }
  
  // Generate a placeholder image based on the book's title
  const title = encodeURIComponent(book.title || 'Book');
  return `https://placehold.co/400x600/e2e8f0/1e293b?text=${title}`;
};

export default function Dashboard() {
  const [userInput, setUserInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBookData, setEditBookData] = useState(null);
  const [deleteModalData, setDeleteModalData] = useState({ isOpen: false, book: null });

  const {
    books: allBooks,
    isLoading,
    createBook,
    updateBook,
    deleteBook,
  } = useBooks();

  // Filter books based on search and filters
  const filteredBooks = allBooks.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(userInput.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(userInput.toLowerCase());
    const genreMatch = filterGenre === "All" || book.genre === filterGenre;
    const statusMatch = filterStatus === "All" || book.status === filterStatus;

    return (titleMatch || authorMatch) && genreMatch && statusMatch;
  });

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const books = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handleAddBook = async (bookData) => {
    try {
      await createBook({
        ...bookData,
        imageUrl: bookData.imageUrl || "https://via.placeholder.com/128x180?text=No+Image",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleEditBook = async (updatedData) => {
    try {
      await updateBook({
        id: editBookData.id,
        bookData: {
          ...updatedData,
          imageUrl: updatedData.imageUrl || "https://via.placeholder.com/128x180?text=No+Image",
        },
      });
      setIsModalOpen(false);
      setEditBookData(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      toast.success('Book deleted successfully');
      setDeleteModalData({ isOpen: false, book: null });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error('Failed to delete book');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <CursorEffect />
      
      <div className="min-h-full">
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book Dashboard</h1>
              </div>
              <button
                onClick={() => {
                  setEditBookData(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                Add Book
              </button>
            </div>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search Input */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by title or author..."
                    className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="block w-full pl-2.5 sm:pl-3 pr-8 sm:pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option value="All">All Genres</option>
                  {[...new Set(allBooks.map(book => book.genre))].map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-2.5 sm:pl-3 pr-8 sm:pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option value="All">All Status</option>
                  {['Available', 'Issued'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle and Search Button */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-2.5 sm:px-3 py-2 border rounded-md text-sm font-medium ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ViewColumnsIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-2.5 sm:px-3 py-2 border rounded-md text-sm font-medium ${
                    viewMode === "table"
                      ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <TableCellsIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-sm">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6">
                {isLoading ? (
                  // Grid skeleton
                  [...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                      <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  books.map((book) => (
                    <div
                      key={book.id}
                      data-book-card
                      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-none"
                    >
                      <div className="relative pb-[133%] bg-gray-50">
                        <img
                          src={getBookImageUrl(book)}
                          alt={book.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/400x600/e2e8f0/1e293b?text=${encodeURIComponent(book.title || 'Book')}`;
                          }}
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                          <p>Author: {book.author || "Unknown"}</p>
                          <p>Genre: {book.genre || "N/A"}</p>
                          <p>Year: {book.year || "N/A"}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              book.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {book.status}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditBookData(book);
                                  setIsModalOpen(true);
                                }}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteModalData({ isOpen: true, book })}
                                className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Title', 'Author', 'Genre', 'Year', 'Status', 'Actions'].map((header) => (
                        <th key={header} className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <BookTableSkeleton />
                    ) : (
                      books.map((book) => (
                        <tr
                          key={book.id}
                          data-book-card
                          className="hover:bg-gray-50 transition-colors duration-200 cursor-none"
                        >
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{book.title}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{book.author || "Unknown"}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{book.genre || "N/A"}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{book.year || "N/A"}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              book.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {book.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            <div className="flex space-x-2 sm:space-x-3">
                              <button
                                onClick={() => {
                                  setEditBookData(book);
                                  setIsModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteModalData({ isOpen: true, book })}
                                className="text-red-600 hover:text-red-900 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && books.length > 0 && (
            <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs sm:text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-1.5 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 border text-xs sm:text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-1.5 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </main>

        {isModalOpen && (
          <BookModal
            onClose={() => {
              setIsModalOpen(false);
              setEditBookData(null);
            }}
            onSubmit={editBookData ? handleEditBook : handleAddBook}
            defaultValues={editBookData}
          />
        )}

        {/* Add DeleteConfirmationModal */}
        <DeleteConfirmationModal
          isOpen={deleteModalData.isOpen}
          onClose={() => setDeleteModalData({ isOpen: false, book: null })}
          onConfirm={() => handleDeleteBook(deleteModalData.book.id)}
          bookTitle={deleteModalData.book?.title}
        />
      </div>
    </div>
  );
}
