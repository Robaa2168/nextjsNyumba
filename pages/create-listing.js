// pages/create-listing.js
import React from 'react';
import CreateListingForm from '../components/CreateListingForm';

function CreateListingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-500">Create New Listing</h1>
      <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mt-6">
        <CreateListingForm />
      </div>
    </div>
  );
  }  

export default CreateListingPage;