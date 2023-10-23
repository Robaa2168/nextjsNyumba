//components/Listing.js

import React, { useState, useCallback } from 'react'; // Import useCallback
import { FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi';
import Image from 'next/image';


function Listing({ imageUrl, title, description, price, featured, _id, likes }) {
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
        setLikesCount(prevLikesCount => prevLikesCount + 1);
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
            setLikesCount(prevLikesCount => prevLikesCount - 1);
            console.error('Error liking listing:', error);
        }
    }, [_id]);


    return (
        <div className="flex flex-col border rounded-lg overflow-hidden shadow-md relative group">

            {featured && <span className="absolute top-1 right-1 bg-red-500 text-white py-1 px-3 text-xs sm:text-sm font-bold uppercase rounded-full">Featured</span>}
            <Image
                src={imageUrl}
                alt={title ? `Image of ${title}` : ""}
                width={500}  // specify dimensions
                height={500}  // specify dimensions
                objectFit="cover"
                quality={75}
                className="transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
            />

            <div className="p-2 sm:p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{title}</h3>
                <p className="text-gray-600 mb-2 truncate border-b border-dotted">{description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
                    <span className="font-bold text-sm mb-2 sm:mb-0">KES{price}</span>
                    <div className="flex space-x-2">
                        <FiHeart
                            className="text-red-500 cursor-pointer"
                            onClick={handleLike}
                        />
                        <span>{likesCount}</span>
                        <FiMessageCircle className="text-gray-500" />
                        <span>{commentsList.length}</span>
                        <FiShare className="text-gray-500" />
                        <span>{shares}</span>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Listing
