import Image from 'next/image';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`);
    if (!res.ok) {
        return { notFound: true };
    }

    const listing = await res.json();

    return { props: { listing } };
}

const ListingPage = ({ listing }) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 flex flex-wrap">
          {/* Left Column for Images and Contact */}
          <div className="w-full lg:w-1/2 px-4 mb-6">
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            {/* Image gallery */}
            <div className="flex space-x-4 mb-6">
              {Array.isArray(listing.imageUrl) ? (
                listing.imageUrl.map((url, index) => (
                  <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
                    <Image src={url} layout="responsive" width={150} height={150} objectFit="cover" alt={`Image ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="w-full">
                  <Image src={listing.imageUrl} layout="responsive" width={150} height={150} objectFit="cover" alt="Image 1" />
                </div>
              )}
            </div>
            {/* Contact details */}
            <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="mb-4">{listing.description}</p>
              <h2 className="text-2xl font-semibold mb-2">Contact</h2>
              <p>Phone: {listing.contact?.phone}</p>
              <p>Email: {listing.contact?.email}</p>
            </div>
          </div>
      
          {/* Right Column for Details */}
          <div className="w-full lg:w-1/2 px-4 mb-6">
            {/* Detailed Information */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Details</h2>
              <p>Price: {listing.price}</p>
              <p>Category: {listing.category}</p>
              {/* Capacity */}
              <p>Capacity: Guests {listing.capacity?.guests}, Bedrooms {listing.capacity?.bedrooms}, Beds {listing.capacity?.beds}, Baths {listing.capacity?.baths}</p>
              <p>Management Type: {listing.managementType}</p>
            </div>
      
            {/* Location Information */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Location</h2>
              <p>{listing.location?.estate}, {listing.location?.landmark}, {listing.location?.subCounty}, {listing.location?.city}, {listing.location?.country}</p>
              {/* Map Placeholder */}
              <div className="h-64 w-full bg-gray-200 mb-4">
                <p className="flex justify-center items-center h-full">Map Placeholder</p>
              </div>
            </div>
      
            {/* Amenities */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
              <p>Wifi: {listing.amenities?.wifi ? 'Yes' : 'No'}</p>
              <p>Parking: {listing.amenities?.parking}</p>
              <p>Pets Allowed: {listing.amenities?.petsAllowed ? 'Yes' : 'No'}</p>
            </div>
      
            {/* Accessibility Features */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
              <p>Wheelchair Accessible: {listing.accessibility?.wheelchair ? 'Yes' : 'No'}</p>
              <p>Elevator: {listing.accessibility?.elevator ? 'Yes' : 'No'}</p>
            </div>
      
            {/* Policies */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Policies</h2>
              <p>Cancellation Policy: {listing.policies?.cancellation}</p>
              <p>House Rules: {listing.policies?.houseRules}</p>
            </div>
      
            {/* Additional Pricing */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Additional Pricing</h2>
              <p>Cleaning Fee: {listing.additionalPricing?.cleaningFee}</p>
              <p>Deposit: {listing.additionalPricing?.deposit}</p>
              <p>Extra Person Fee: {listing.additionalPricing?.extraPersonFee}</p>
            </div>
          </div>
        </div>
      );
              }      
export default ListingPage;
