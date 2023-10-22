//components/Listing.js

import React, { useState, useCallback } from 'react'; // Import useCallback
import { FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi';
import Image from 'next/image';


function Listing({ imageUrl, title, description, price, featured, _id,likes   }) {
    // It's better to start with likes, comments, and shares possibly coming from props,
    // allowing your component to be initialized with real data.
    const [likesCount, setLikesCount] = useState(likes);
    const [commentsList, setCommentsList] = useState([
        "Beautiful house!",
        "I've stayed here before, it's amazing.",
        "Worth every penny!"
    ]); // If these comments are static, consider moving them outside of the component to avoid redeclaration on each render.
    const [shares, setShares] = useState(0);

    // Use useCallback to avoid unnecessary re-creations of the callback.
    // This is particularly useful if this callback is passed as a prop to child components.
    const handleLike = useCallback(async () => {
        try {
            const res = await fetch('/api/listings/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: _id }),
            });

            if (!res.ok) {
                throw new Error(`An error occurred: ${res.status}`);
            }

            const updatedListing = await res.json();
            setLikesCount(updatedListing.likes);
        } catch (error) {
            console.error('Error liking listing:', error);
        }
    }, [_id]);


    return (
        <div className="flex flex-col border rounded-lg overflow-hidden shadow-md relative group">
            {featured && <span className="absolute top-1 right-1 bg-red-500 text-white py-1 px-3 text-xs sm:text-sm font-bold uppercase rounded-full">Featured</span>}

            {/* Adjust your image element like this */}
            <Image
    src={imageUrl}
    alt={title ? `Image of ${title}` : ""}
    width={500}  // specify dimensions
    height={500}  // specify dimensions
    objectFit="cover"
    quality={75}
    className="
transform 
transition-transform 
duration-300 
ease-in-out 
group-hover:scale-105
"
/>



            {/* It might be better to separate these buttons into a new component to keep your code DRY.
          This new component could accept props like the icon, action, count, etc. */}
            <div className="absolute top-1/4 right-4 space-y-2 flex flex-col items-center">
                <button
                    onClick={handleLike}
                    className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none active:bg-gray-900 focus:ring-2 focus:ring-gray-600 focus-visible:ring-2 focus-visible:ring-gray-600"
                >
                    <FiHeart className="text-white text-2xl" />
                </button>
                <span className="text-white">{likesCount}</span>

                <button
                    /*onClick={handleComment}*/
                    className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none active:bg-gray-900 focus:ring-2 focus:ring-gray-600 focus-visible:ring-2 focus-visible:ring-gray-600"
                >
                    <FiMessageCircle className="text-white text-2xl" />
                </button>
                <span className="text-white">{commentsList.length}</span>

                <button
                    /*onClick={handleShare}*/
                    className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none active:bg-gray-900 focus:ring-2 focus:ring-gray-600 focus-visible:ring-2 focus-visible:ring-gray-600"
                >
                    <FiShare className="text-white text-2xl" />
                </button>
                <span className="text-white">{shares}</span>
            </div>


            {/* You may want to truncate text or handle overflow for very long titles or descriptions. */}
            <div className="p-2 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
                <p className="text-gray-500 text-xs sm:text-sm sm:text-gray-600 line-clamp-3">
                    {description}
                </p>

                <p className="text-md sm:text-lg font-semibold">Ksh:{price}</p>

                <ul className="mt-2 space-y-1 sm:space-y-2">
                    {commentsList.slice(0, 3).map((comment, index) => (
                        <li key={index} className="text-xs sm:text-sm text-gray-500">- {comment}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Listing;
