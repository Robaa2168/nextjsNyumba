//pages/listings/[id].js
import Image from 'next/image';
import { useState,useRef,useEffect } from 'react';
import Head from 'next/head';
import { Lightbox } from 'react-modal-image';
import Header from '../../components/Header';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { FaWifi, FaParking, FaDog, FaWheelchair, FaDoorOpen  } from 'react-icons/fa';
import { FaCamera, FaEye, FaChevronLeft, FaChevronRight, FaCheckCircle, FaSms, FaShoppingCart, FaComments, FaBan, FaFlag, FaTimes, FaPaperPlane, FaSpinner, FaGavel } from 'react-icons/fa';
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
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [mainImageUrl, setMainImageUrl] = useState(listing.imageUrl[0]);
    const [isOverflow, setIsOverflow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(true); // Simulate the chat being open
    const [isInputFocused, setInputFocused] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'guest', text: 'Hi, is this property available next month?', timestamp: new Date(new Date().setHours(new Date().getHours() - 23)) },
        { id: 2, sender: 'host', text: 'Yes, it is available! Would you like to proceed with the booking?', timestamp: new Date(new Date().setHours(new Date().getHours() - 22)) },
        { id: 3, sender: 'guest', text: 'Can you provide more details about the amenities?', timestamp: new Date(new Date().setHours(new Date().getHours() - 20)) },
        { id: 4, sender: 'host', text: 'Certainly! It has a fully equipped kitchen, high-speed Wi-Fi, and a beautiful balcony view.', timestamp: new Date(new Date().setHours(new Date().getHours() - 18)) },
        { id: 5, sender: 'guest', text: 'Great! Is there a parking space available?', timestamp: new Date(new Date().setHours(new Date().getHours() - 10)) },
        { id: 6, sender: 'host', text: 'Yes, there is free parking on the premises.', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)) },
        // You can add more messages as required
    ]);
    

    const openFeedback = async () => {
        setIsFeedbackOpen(true);
        setIsLoading(true);

        try {
            // Replace with your actual fetch call
            const response = await fetch(`/api/listings/comments?listing=${listing._id}`);
            const data = await response.json();
            setFeedbacks(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setIsLoading(false);
        }
    };

    const closeFeedback = () => {
        setIsFeedbackOpen(false);
    };

    const openChat = () => {
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const handleSendMessage = () => {
        // Add functionality to handle sending a message
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'user',
                text: newMessage,
                timestamp: new Date()
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nextjs-nyumba.vercel.app/';

    useEffect(() => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            setIsOverflow(scrollWidth > clientWidth);
        }
    }, [listing.imageUrl]);

    const handleThumbnailHover = (url) => {
        const index = listing.imageUrl.indexOf(url);
        if (index >= 0) {
            setCurrentIndex(index); // Update the current index
            setMainImageUrl(url);
        }
    };



    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            if (direction === 'left') {
                current.scrollLeft -= 50;
            } else {
                current.scrollLeft += 50;
            }
        }
    };

    return (
        <>
        <Head>
            <title>{listing.title} - viewNyumba</title>
            <meta name="description" content={listing.description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseUrl}/listings/${listing._id}`} />
            <meta property="og:title" content={listing.title} />
            <meta property="og:description" content={listing.description} />
            <meta property="og:image" content={listing.imageUrl[0]} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={`${baseUrl}/listings/${listing._id}`} />
            <meta property="twitter:title" content={listing.title} />
            <meta property="twitter:description" content={listing.description} />
            <meta property="twitter:image" content={listing.imageUrl[0]} />

            {/* Additional tags as needed */}
        </Head>
        <Header />
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg">
            {/* Image Gallery */}
            <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        {/* Main Image Container */}
                        <div className="relative mb-4 cursor-pointer" onClick={() => setOpenLightbox(true)}>
                            {/* Overlay for image count */}
                            <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaCamera className="text-lg" />
                                <span className="text-sm ml-1">{`${currentIndex + 1}/${listing.imageUrl.length}`}</span>
                            </div>
                            {/* Overlay for views count */}
                            <div className="absolute bottom-0 right-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaEye className="text-lg" />
                                <span className="text-sm ml-1">{listing.impressions}</span>
                            </div>
                            <div className="relative w-full" style={{ height: '300px' }}>
                                <Image
                                    src={mainImageUrl}
                                    alt="Main Image"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                        {openLightbox && (
                            <Lightbox large={mainImageUrl} onClose={() => setOpenLightbox(false)} />
                        )}

                        {/* Thumbnail Strip */}
                        <div className="relative flex items-center mb-4 lg:max-w-lg lg:w-full">
                            {isOverflow && (
                                <button onClick={() => handleScroll('left')} className="absolute left-0 z-10 bg-white bg-opacity-50 rounded-full p-1">
                                    <FaChevronLeft />
                                </button>
                            )}
                            <div className="flex overflow-x-auto" ref={scrollRef}>
                                {listing.imageUrl.map((url, index) => (
                                    <div key={index} className="flex-shrink-0 mr-2" style={{ width: '50px', height: '50px', position: 'relative' }}>
                                        <Image
                                            src={url}
                                            alt={`Thumbnail ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                            onMouseEnter={() => handleThumbnailHover(url)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isOverflow && (
                                <button
                                    onClick={() => handleScroll('right')}
                                    className="absolute right-0 z-10 bg-white bg-opacity-50 rounded-full p-1"
                                    aria-label="Scroll right"
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                    {/* Listing Details */}
                    <h1 className="text-2xl font-bold mb-2 text-emerald-700">{listing.title}</h1>
                    <p className="text-gray-600 mb-4">{listing.description}</p>

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Details</h2>
                        <ul className="list-disc pl-5">
                            <li className="mb-2">Price: KES {listing?.price}</li>
                            <li className="mb-2">Management Type: {listing?.managementType}</li>
                            <li className="mb-2">Rent Deadline: Date {listing?.rentDeadline} </li>
                            <li className="mb-2">Location: {listing.location?.houseLocation}</li>
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
                            {listing.accessibility?.elevator && <li><FaDoorOpen  className="inline mr-2 text-emerald-600" /> Elevator</li>}
                        </ul>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg mt-4">
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Policies</h2>
                        <p>Cancellation Policy: {listing.policies?.cancellation}</p>
                        <p>House Rules: {listing.policies?.houseRules}</p>
                    </div>
                    {/* Map Placeholder */}
                    <div className="rounded-lg bg-gray-200 h-64 mt-4 flex items-center justify-center">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => setIsMapLoaded(true)}
        onError={() => console.error('Error loading Google Maps')}
      >
        {listing.location.houseCoordinates && listing.location.houseCoordinates.coordinates && isMapLoaded &&
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{
              lat: parseFloat(listing.location.houseCoordinates.coordinates[1]), // Latitude
              lng: parseFloat(listing.location.houseCoordinates.coordinates[0]) // Longitude
            }}
            zoom={20}
            options={{
              streetViewControl: false,
              scaleControl: false,
              mapTypeControl: false,
              panControl: false,
              zoomControl: false,
              rotateControl: false,
              fullscreenControl: false
            }}
          >
            <Marker
              position={{
                lat: parseFloat(listing.location.houseCoordinates.coordinates[1]), // Latitude
                lng: parseFloat(listing.location.houseCoordinates.coordinates[0]) // Longitude
              }}
              icon={{
                url: 'https://res.cloudinary.com/dx6jw8k0m/image/upload/v1699821203/nyumba/195492_psmryj.png',
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          </GoogleMap>
        }
      </LoadScript>
    </div>


                </div>
                <div className="md:flex-1 px-4">
                <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
                            {/* Price and Market Price Section */}
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">KES {listing.price}</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Now available</p>
                                <button className="mt-3 mb-2 bg-green-500 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                    Request call back
                                </button>
                            </div>

                            {/* Listing Information Section */}
                            <div className="flex flex-row items-center bg-white p-4 rounded-lg shadow-sm mt-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-green-500 p-1 mr-4 overflow-hidden">
    <Image
        className="object-cover w-full h-full rounded-full"
        src="https://a0.muscache.com/im/pictures/385ae3a6-e245-4a84-90bd-14a78ced4c8e.jpg?im_w=720"
        alt={listing.title}
        layout="responsive"
        width={40}
        height={40}
    />
</div>


                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold truncate">Steve Oke</h2>
                                    <p className="mt-1">
                                        <span className="bg-green-100 text-green-600 text-xs inline-flex items-center py-1 px-3 rounded-full">
                                            <FaCheckCircle className="w-4 h-4 mr-1" />
                                            Verified ID
                                        </span>
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">Typically replies within a few hours</p>
                                    <p className="text-gray-500 text-xs truncate">4 y 4 m on viewNyumba</p>
                                </div>
                            </div>

                            {/* Contact and Chat Buttons */}
                            <div className="mt-3 flex flex-col space-y-2">
                                <button
                                    className="bg-green-500 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                    <FaShoppingCart className="mr-2" />
                                    Make Reservation
                                </button>

                                <button onClick={openChat} className="bg-white text-green-600 border border-green-500 text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center transition duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                    <FaComments className="mr-2" />
                                    Start chat
                                </button>
                                {isChatOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-xl font-semibold">Chat with Support</h2>
                                                    <div
                                                        className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                        onClick={closeChat}
                                                    >
                                                        <FaTimes className="text-red-500" />
                                                    </div>
                                                </div>

                                                {/* Pinned Advisory Message */}
                                                <div className="bg-emerald-100 border-l-4 border-emerald-500 p-3 rounded">
                                                    <p className="text-sm text-emerald-700">
                                                        Reminder: Stay safe! Chat within this platform to avoid potential fraud. We cannot assist with disputes arising from external communications.
                                                    </p>
                                                </div>

                                                {/* Chat Messages */}
                                                <div className="w-full max-w-lg h-64 overflow-auto bg-gray-100 p-3 rounded">
                                                    {messages.map((msg) => (
                                                        <div key={msg.id} className={`text-sm p-2 rounded my-1 ${msg.sender === 'host' ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                                                            <p>{msg.text}</p>
                                                            <span className="text-xs text-gray-500 block text-right">
                                                                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Message Input */}
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        className={`flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none ${isInputFocused ? 'ring-2 ring-emerald-200' : ''}`}
                                                        placeholder="Type your message..."
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        onFocus={() => setInputFocused(true)}
                                                        onBlur={() => setInputFocused(false)}
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        className={`bg-emerald-100 text-emerald-600 py-2 px-4 rounded-r-lg hover:bg-emerald-200 transition duration-300 flex items-center justify-center ${isInputFocused ? 'ring-2 ring-emerald-200' : ''}`}
                                                    >
                                                        <FaPaperPlane />
                                                    </button>
                                                </div>
                                                <div className=" md:text-right">
                                                    <button
                                                        className="border border-red-400 text-red-400 py-2 px-4 rounded hover:bg-red-50 transition duration-300 flex items-center justify-center w-full md:w-auto"
                                                        title="Start a dispute if you have significant issues with this transaction."
                                                    >
                                                        <FaGavel className="mr-2" /> Start a Dispute
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Feedback Section */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mt-4">
                                <div className="flex items-center">
                                    <div className="p-2 mr-2 bg-[#D9F9E5] rounded-full">
                                        <FaSms className="text-[#34D399]" />
                                    </div>
                                    <span className="text-gray-800 text-xs sm:text-sm font-medium">Feedbacks</span>
                                </div>
                                <button onClick={openFeedback} className="text-[#34D399] text-xs sm:text-sm font-medium hover:underline">
                                    view all
                                </button>
                            </div>

                            {isFeedbackOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold">Feedback</h2>
                                            <div
                                                className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                onClick={closeFeedback}
                                            >
                                                <FaTimes className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* Feedback Messages */}
                                        <div className="mt-3 bg-emerald-100 border-l-4 border-emerald-500 p-3 rounded">
                                            <p className="text-sm text-emerald-700">
                                                See what others are saying about this seller.
                                            </p>
                                        </div>
                                        <div className="h-64 overflow-auto bg-gray-100 p-3 rounded">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <FaSpinner className="animate-spin text-2xl text-emerald-500" />
                                                </div>
                                            ) : feedbacks.length > 0 ? (
                                                feedbacks.map(feedback => (
                                                    <div key={feedback.id} className="bg-gray-200 p-3 rounded my-2">
                                                        <p className="font-semibold">{feedback.username}</p>
                                                        <p>{feedback.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No feedbacks yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Safety Tips Section */}
                            <div className="mt-3 bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Safety tips</h3>
                                <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-600 mt-2">
                                    <li>Remember, don&apos;t send any pre-payments</li>
                                    <li>Travel to the actual apartment before making payments</li>
                                    {/* More safety tips here */}
                                </ul>
                            </div>


                            {/* Action Buttons */}
                            <div className="bg-white p-4 rounded-lg shadow-sm mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
                                <button className="flex items-center justify-center border border-gray-300 text-blue-600 py-2 px-4 rounded-md transition duration-300 hover:bg-blue-50 focus:outline-none w-full sm:w-auto">
                                    <FaBan className="mr-2" />
                                    Mark unavailable
                                </button>
                                <button className="flex items-center justify-center border border-gray-300 text-red-600 py-2 px-4 rounded-md transition duration-300 hover:bg-red-50 focus:outline-none w-full sm:w-auto">
                                    <FaFlag className="mr-2" />
                                    Report Abuse
                                </button>
                            </div>

                            {/* Post Ad Button */}
                            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
                                <div className="border border-green-600 rounded-md transition duration-300 hover:bg-green-50 w-full sm:w-auto">
                                    <button className="text-green-600 py-2 px-4 w-full rounded-md transition duration-300 hover:bg-green-50 focus:outline-none">
                                        Post Ad Like This
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>

            </div>
        </div>
        </>
    );
};

export default ListingPage;
