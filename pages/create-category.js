// pages/create-category.js
import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateCategoryForm from '../components/CreateCategoryForm';

function CreateCategoryPage() {


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Create Category - ViewNyumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-grow">
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto bg-white shadow-md rounded-lg max-w-4xl mt-8">
            <CreateCategoryForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateCategoryPage;
