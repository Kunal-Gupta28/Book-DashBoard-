import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function BookModal({ onClose, onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const submitHandler = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {defaultValues ? "Edit Book" : "Add Book"}
        </h2>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Author</label>
            <input
              {...register("author", { required: "Author is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Genre</label>
            <input {...register("genre")} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Year</label>
            <input
              type="number"
              {...register("year", { valueAsNumber: true })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <select {...register("status")} className="w-full border p-2 rounded">
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
