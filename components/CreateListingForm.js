// components/CreateListingForm.js
import React, { useState, useRef, useEffect, } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function CreateListingForm() {

  const router = useRouter();
  const { user } = useAuth();
  const imageInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    title: '',
    description: '',
    imageUrl: [],
    category: '',
    price: '',
    featured: false,
    contact: {
      phone: '',
      email: '',
    },
    managementType: '',
    rentDeadline: 1,
    location: {
      estate: '',
      landmark: '',
      subCounty: '',
      city: 'Nairobi',
      country: 'Kenya',
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    amenities: {
      wifi: false,
      parking: 'Limited',
      petsAllowed: false,
    },
    accessibility: {
      wheelchair: false,
      elevator: false,
    },
    policies: {
      cancellation: '',
      houseRules: '',
    },
    additionalPricing: {
      cleaningFee: 0,
      deposit: 0,
      extraPersonFee: 0,
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      baths: 1,
    },
    availability: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleLogout = useCallback(() => {
    signOut();
  }, []);
  

  useEffect(() => {
    if (!user && !authLoading) {
      handleLogout();
    }
  }, [user, handleLogout]);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = useRef();
  const houseAutocompleteRef = useRef();



  // Function to update state as user inputs data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const setValue = (name, value, prevFormData) => {
      const keys = name.split('.');
      let current = prevFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    };

    setFormData((prevFormData) => {
      const newData = { ...prevFormData };
      if (type === 'checkbox') {
        setValue(name, checked, newData);
      } else {
        setValue(name, value, newData);
      }
      return newData;
    });
  };



  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrl: [...prevFormData.imageUrl, ...newFiles]
    }));
  };

  const removeImage = (e, index) => {
    e.preventDefault(); // Prevents the default form submit action
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.imageUrl];
      updatedImages.splice(index, 1);
      return { ...prevFormData, imageUrl: updatedImages };
    });
  };

  const uploadImages = async () => {
    const urls = [];

    for (const file of formData.imageUrl) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dx6jw8k0m');

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dx6jw8k0m/image/upload', data);
        urls.push(response.data.secure_url);
      } catch (error) {
        // Handle errors, e.g., log to console or set an error message
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload images');
      }
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage('Creating...');

    try {
      const imageUrls = await uploadImages(); // Upload images first
      // Retrieve the JWT token from wherever it's stored (e.g., localStorage)
      const token = localStorage.getItem('token');

      // Include the image URLs in the form data to be sent to the server
      const fullFormData = {
        ...formData,
        imageUrl: imageUrls,
      };

      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fullFormData),
      });

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.status}`);
      }

      const data = await res.json();
      setSuccessMessage(data.message || 'Listing created successfully!');

      // Reset form fields here
      setFormData(initialFormData);

    } catch (error) {
      setErrorMessage('An error occurred while submitting the form. Please try again.');
      console.error('Error submitting form', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Declare the async function inside the useEffect
    const fetchCategories = async () => {
      try {
        // Await the axios call and get the response
        const response = await axios.get('/api/categories/get_categories');
        // Update state with the fetched categories
        setCategories(response.data.data); // Make sure this matches the shape of your response
      } catch (error) {
        // Log and set error if the fetch fails
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories.');
      }
    };

    // Call the async function
    fetchCategories();
  }, []); // The empty dependency array means this effect will only run once on component mount


  if (!isLoaded) return <div>Loading...</div>;

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry) {
      // Handle scenario when the place is not found
      return;
    }
  
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: {
        ...prevFormData.location,
        landmark: place.name, // Raw text description
        landmarkCoordinates: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    }));
  };
  

  const handleHousePlaceSelect = () => {
    const place = houseAutocompleteRef.current.getPlace();
    if (!place.geometry) {
      // Handle scenario when the place is not found
      return;
    }
  
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: {
        ...prevFormData.location,
        houseLocation: place.formatted_address, // Raw text description
        houseCoordinates: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    }));
  };
  

  return (
    <form className="w-full max-w-3xl bg-white p-8 border border-emerald-200 rounded-md shadow-md" onSubmit={handleSubmit} >
      {/* Conditionally render error or success messages */}
      {errorMessage && (
        <div className="mb-4 text-center p-2 bg-red-100 text-red-700 border border-red-200 rounded">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 text-center p-2 bg-green-100 text-green-700 border border-green-200 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="flex flex-col justify-center items-center mb-4 w-full">
        <label htmlFor="image" className="block text-emerald-700 text-sm font-bold mb-2 w-full">
          <label htmlFor="image-upload" className="block text-emerald-700 text-sm font-bold mb-2 w-full">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drag files to upload or click here
              </span>
              <input
                id="image-upload"
                type="file"
                name="image"
                onChange={handleFileChange}
                multiple
                className="hidden" // Hide the actual input
              />
            </div>
          </label>
        </label>


<div className="mt-4 flex flex-wrap justify-start items-center w-full">
  {formData.imageUrl.map((image, index) => (
    <div key={index} className="flex flex-col items-center mr-4 mb-4">
      <img src={URL.createObjectURL(image)} alt={`Uploaded #${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
      <button onClick={(e) => removeImage(e, index)} className="mt-2 text-red-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  ))}
</div>
</div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-emerald-700 text-sm font-bold mb-2">Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-emerald-700 text-sm font-bold mb-2">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-grey-darker"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-emerald-700 text-sm font-bold mb-2">Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>


        {/* Contact Phone */}
        <div className="mb-4">
          <label htmlFor="contact.phone" className="block text-emerald-700 text-sm font-bold mb-2">Phone:</label>
          <input type="tel" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Contact Email */}
        <div className="mb-4">
          <label htmlFor="contact.email" className="block text-emerald-700 text-sm font-bold mb-2">Email:</label>
          <input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Management Type */}
        <div className="mb-4">
          <label htmlFor="managementType" className="block text-emerald-700 text-sm font-bold mb-2">Management Type:</label>
          <select name="managementType" value={formData.managementType} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker">
            <option value="">Select Type</option>
            <option value="Landlord">Landlord</option>
            <option value="Agency">Agency</option>
          </select>
        </div>

        {/* Rent Deadline */}
        <div className="mb-4">
          <label htmlFor="rentDeadline" className="block text-emerald-700 text-sm font-bold mb-2">Rent Deadline (days):</label>
          <input type="number" min="1" name="rentDeadline" value={formData.rentDeadline} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Estate */}
        <div className="mb-4">
          <label htmlFor="location.estate" className="block text-emerald-700 text-sm font-bold mb-2">Estate:</label>
          <input type="text" name="location.estate" value={formData.location.estate} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Landmark */}
        <div className="mb-4">
          <label htmlFor="location.landmark" className="block text-emerald-700 text-sm font-bold mb-2">Landmark:</label>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              name="location.landmark"
              value={formData.location.landmark}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-grey-darker"
            />
          </Autocomplete>
        </div>
        {/* House Location */}
        <div className="mb-4">
          <label htmlFor="houseLocation" className="block text-emerald-700 text-sm font-bold mb-2">House Location:</label>
          <Autocomplete
            onLoad={(autocomplete) => (houseAutocompleteRef.current = autocomplete)}
            onPlaceChanged={handleHousePlaceSelect}
          >
            <input
              type="text"
              name="houseLocation"
              className="shadow border rounded w-full py-2 px-3 text-grey-darker"
            />
          </Autocomplete>
        </div>


        {/* SubCounty */}
        <div className="mb-4">
          <label htmlFor="location.subCounty" className="block text-emerald-700 text-sm font-bold mb-2">SubCounty:</label>
          <input type="text" name="location.subCounty" value={formData.location.subCounty} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>




        {/* Amenities Parking */}
        <div className="mb-4">
          <label htmlFor="amenities.parking" className="block text-emerald-700 text-sm font-bold mb-2">Parking:</label>
          <select name="amenities.parking" value={formData.amenities.parking} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker">
            <option value="Limited">Limited</option>
            <option value="Medium">Medium</option>
            <option value="Enough">Enough</option>
          </select>
        </div>

        {/* Policies Cancellation */}
        <div className="mb-4">
          <label htmlFor="policies.cancellation" className="block text-emerald-700 text-sm font-bold mb-2">Cancellation Policy:</label>
          <textarea
            id="policies.cancellation"
            name="policies.cancellation"
            value={formData.policies.cancellation}
            onChange={handleChange}
            rows="5"
            placeholder="Enter each policy point on a new line."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight"
          ></textarea>
          <p className="text-sm text-gray-600 mt-2">Please enter each point on a new line.</p>
        </div>


        {/* Policies House Rules */}
        <div className="mb-4">
          <label htmlFor="policies.houseRules" className="block text-emerald-700 text-sm font-bold mb-2">House Rules:</label>
          <textarea name="policies.houseRules" value={formData.policies.houseRules} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Additional Pricing Cleaning Fee */}
        <div className="mb-4">
          <label htmlFor="additionalPricing.cleaningFee" className="block text-emerald-700 text-sm font-bold mb-2">Cleaning Fee:</label>
          <input type="number" name="additionalPricing.cleaningFee" value={formData.additionalPricing.cleaningFee} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Additional Pricing Deposit */}
        <div className="mb-4">
          <label htmlFor="additionalPricing.deposit" className="block text-emerald-700 text-sm font-bold mb-2">Deposit:</label>
          <input type="number" name="additionalPricing.deposit" value={formData.additionalPricing.deposit} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Additional Pricing Extra Person Fee */}
        <div className="mb-4">
          <label htmlFor="additionalPricing.extraPersonFee" className="block text-emerald-700 text-sm font-bold mb-2">Extra Person Fee:</label>
          <input type="number" name="additionalPricing.extraPersonFee" value={formData.additionalPricing.extraPersonFee} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Capacity Guests */}
        <div className="mb-4">
          <label htmlFor="capacity.guests" className="block text-emerald-700 text-sm font-bold mb-2">Guests:</label>
          <input type="number" name="capacity.guests" value={formData.capacity.guests} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Capacity Bedrooms */}
        <div className="mb-4">
          <label htmlFor="capacity.bedrooms" className="block text-emerald-700 text-sm font-bold mb-2">Bedrooms:</label>
          <input type="number" name="capacity.bedrooms" value={formData.capacity.bedrooms} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Capacity Beds */}
        <div className="mb-4">
          <label htmlFor="capacity.beds" className="block text-emerald-700 text-sm font-bold mb-2">Beds:</label>
          <input type="number" name="capacity.beds" value={formData.capacity.beds} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Capacity Baths */}
        <div className="mb-4">
          <label htmlFor="capacity.baths" className="block text-emerald-700 text-sm font-bold mb-2">Baths:</label>
          <input type="number" name="capacity.baths" value={formData.capacity.baths} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>


      </div>
      {/* Accessibility and Amenities section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Accessibility Wheelchair */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="accessibility.wheelchair" checked={formData.accessibility.wheelchair} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Wheelchair Accessible</span>
          </label>
        </div>

        {/* Accessibility Elevator */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="accessibility.elevator" checked={formData.accessibility.elevator} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Elevator</span>
          </label>
        </div>

        {/* Amenities Wifi */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="amenities.wifi" checked={formData.amenities.wifi} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Wifi</span>
          </label>
        </div>

        {/* Amenities Pets Allowed */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="amenities.petsAllowed" checked={formData.amenities.petsAllowed} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Pets Allowed</span>
          </label>
        </div>

        {/* Availability */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Available for Rent</span>
          </label>
        </div>

        {/* Featured */}
        <div>
          <label className="inline-flex items-center mt-3">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="form-checkbox h-5 w-5 text-emerald-600" /><span className="ml-2 text-emerald-700">Featured</span>
          </label>
        </div>
      </div>
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-emerald-700 text-sm font-bold mb-2">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading} // Disable the button when loading
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            {/* Display spinner during loading */}
            {isLoading && <FaSpinner className="h-5 w-5 text-white animate-spin" />}
          </span>
          {isLoading ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}

export default CreateListingForm;