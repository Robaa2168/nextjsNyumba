// pages/index.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Listing from '../components/Listing';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import CommentModal from '../components/CommentModal';


export default function Home({ listings }) {
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [activeComments, setActiveComments] = useState([]);
  const [activeListingTitle, setActiveListingTitle] = useState('');

 const showComments = (comments, title) => {
    setActiveComments(comments);
    setActiveListingTitle(title);
    setCommentModalOpen(true);
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      <Head>
        <title>Airbnb Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header Component */}
      <Header />
      {/* Hero Section Component */}
      <Hero />
      <Categories />
      {/* Main content with card style for listings */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center my-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Featured Listing</h2>
        </div>
        {/* Listings grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map(listing => (
            <motion.div
              key={listing._id}
              className="relative rounded-lg overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 3px 3px rgba(0,0,0,0.15)" }}  // Enhanced shadow effect on hover
              whileTap={{ scale: 0.95 }}  // Slight shrink effect while tapping/clicking
              transition={{ type: "spring", stiffness: 100 }}  // Smoother transition effect
            >
              <Listing {...listing} onShowComments={showComments}  />
            </motion.div>
          ))}
        </div>
        
      </main>
      <section className="py-6 bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Join Our Community</h2> {/* Lighter emerald green text */}
          <p className="text-gray-500 mb-4">Sign up for more</p> {/* Standard gray for less important text */}
          <button className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 focus:ring focus:ring-emerald-200 focus:outline-none focus:ring-opacity-50">Sign Up</button> {/* Vivid emerald green button with interactive states */}
        </div>
      </section>

      {isCommentModalOpen && (
  <CommentModal
    comments={activeComments}
    title={activeListingTitle}
    onClose={() => setCommentModalOpen(false)}
  />
)}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}


// Fetch data from the API route
export async function getServerSideProps() {
  try {
    // Construct the URL using the environment variable
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/listings`;
    const res = await fetch(apiUrl);
    // Check for any response errors
    if (!res.ok) {
      throw new Error(`Fetch failed with status: ${res.status}`);
    }
    const listings = await res.json();
    // Pass data to the page via props
    return { props: { listings } };
  } catch (error) {
    console.error("Error fetching listings:", error);
    // Return empty array as fallback or handle error as needed
    return { props: { listings: [] } };
  }
}

