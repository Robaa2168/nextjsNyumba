// pages/index.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Listing from '../components/Listing';



export default function Home({ listings }) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <Head>
        <title>Airbnb Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Component */}
      <Header />

      {/* Main content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      
        {/* Listings grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {listings.map(listing => (
            <div key={listing.id} className="relative">
              <Listing {...listing} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}


// Fetch data from the API route
export async function getStaticProps() {
  try {
    const res = await fetch('/api/listings/listings');
    
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
