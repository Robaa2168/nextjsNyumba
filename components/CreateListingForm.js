// components/CreateListingForm.js
import React, { useState } from 'react';
import { CameraIcon, StarIcon } from '@heroicons/react/24/outline';  // Import icons from Heroicons

function CreateListingForm() {
  // Set initial state for form inputs
  const [successMessage, setSuccessMessage] = useState(null);  // Success feedback
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    featured: false,
  });

  // Function to update state as user inputs data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear out any previous messages
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.status}`);
      }

      const data = await res.json();

      // Show success message from response or a default success message
      setSuccessMessage(data.message || 'Listing created successfully!');

      // Clear the form after successful submission
      setFormData({ title: '', description: '', imageUrl: '', price: '', featured: false });

      // ... additional actions like redirection could follow here
    } catch (error) {
      // Display a user-friendly error message
      setErrorMessage('An error occurred while submitting the form. Please try again.');
      console.error('Error submitting form', error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success and Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Title Input */}
      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      {/* Description Input */}
      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        ></textarea>
      </div>

      {/* Image URL Input */}
      <div>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      {/* Price Input */}
      <div>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Featured
        </label>
        <StarIcon className="h-5 w-5 text-emerald-500 ml-2" />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Create Listing
        </button>
      </div>
    </form>
  );
}

export default CreateListingForm;