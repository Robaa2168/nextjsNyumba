//pages/listings/[id].js
import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from 'react-modal-image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/router';
import { FaMapMarkerAlt, FaWifi, FaParking, FaWheelchair, FaDog, FaElevator } from 'react-icons/fa';
import SwiperCore, { Pagination, Navigation } from 'swiper';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


SwiperCore.use([Pagination, Navigation]);

export async function getServerSideProps({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/${params.id}`);
    if (!res.ok) {
        return { notFound: true };
    }

    const listing = await res.json();

    return { props: { listing } };
}

const ListingPage = ({ listing }) => {
    const [mainImage, setMainImage] = useState(listing.imageUrl[0]);
    const [openLightbox, setOpenLightbox] = useState(false);
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col md:flex-row -mx-4">
                <div className="md:flex-1 px-4 mb-4 md:mb-0">
                    <div className="mb-4 cursor-pointer" onClick={() => setOpenLightbox(true)}>
                        <Image
                            src={mainImage}
                            alt="Main Image"
                            width={500}
                            height={300}
                            objectFit="cover"
                            className="rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                    </div>
                    {openLightbox && (
                        <Lightbox large={mainImage} onClose={() => setOpenLightbox(false)} />
                    )}
                    <div className="flex overflow-x-auto">
                        <button className="self-center mr-2"><FaArrowLeft /></button>
                        {listing.imageUrl.map((url, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 mr-2 cursor-pointer"
                                onClick={() => setMainImage(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`Thumbnail ${index + 1}`}
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        ))}
                        <button className="self-center"><FaArrowRight /></button>
                    </div>

                    {/* Listing Details */}
                    <h1 className="text-2xl font-bold mb-2 text-emerald-700">{listing.title}</h1>
                    <p className="text-gray-600 mb-4">{listing.description}</p>
                </div>
                <div className="md:flex-1 px-4">

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Details</h2>
                        <ul className="list-disc pl-5">
                            <li className="mb-2">Price: KES {listing?.price}</li>
                            <li className="mb-2">Management Type: {listing?.managementType}</li>
                            <li className="mb-2">Rent Deadline: {listing?.rentDeadline} days</li>
                            <li className="mb-2">Location: {listing.location?.city}, {listing.location.country}</li>
                            <li className="mb-2">Guests: {listing.capacity?.guests}</li>
                            <li className="mb-2">Bedrooms: {listing.capacity?.bedrooms}</li>
                            <li className="mb-2">Beds: {listing.capacity?.beds}</li>
                            <li>Baths: {listing.capacity?.baths}</li>
                        </ul>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg mt-4">
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Amenities & Accessibility</h2>
                        <ul className="list-disc pl-5">
                            {listing.amenities?.wifi && <li className="mb-2"><FaWifi className="inline mr-2 text-emerald-600" /> WiFi</li>}
                            {listing.amenities?.parking !== 'None' && <li className="mb-2"><FaParking className="inline mr-2 text-emerald-600" /> Parking: {listing.amenities.parking}</li>}
                            {listing.amenities?.petsAllowed && <li className="mb-2"><FaDog className="inline mr-2 text-emerald-600" /> Pets Allowed</li>}
                            {listing.accessibility?.wheelchair && <li className="mb-2"><FaWheelchair className="inline mr-2 text-emerald-600" /> Wheelchair Accessible</li>}
                            {listing.accessibility?.elevator && <li><FaElevator className="inline mr-2 text-emerald-600" /> Elevator</li>}
                        </ul>
                    </div>
                    {/* Map Placeholder */}
                    <div className="rounded-lg bg-gray-200 h-64 mt-4 flex items-center justify-center">
                        <LoadScript googleMapsApiKey="AIzaSyDOzxbdHOwd3q8Rl4YCB1XDSEshDwcnOxE">
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={{ lat: parseFloat(listing.location.coordinates.lat), lng: parseFloat(listing.location.coordinates.lng) }}
                                zoom={15}
                            >
                                <Marker
                                    position={{ lat: parseFloat(listing.location.coordinates.lat), lng: parseFloat(listing.location.coordinates.lng) }}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    

                    <div className="bg-emerald-50 p-4 rounded-lg mt-4">
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Policies</h2>
                        <p>Cancellation Policy: {listing.policies?.cancellation}</p>
                        <p>House Rules: {listing.policies?.houseRules}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ListingPage;
