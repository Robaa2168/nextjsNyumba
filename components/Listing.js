//components/Listing.js

import React, { useState, useCallback } from 'react'; // Import useCallback
import { FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi';
import Image from 'next/image';
import CommentModal from './CommentModal';


function Listing({ imageUrl, title, description, price, featured, _id, likes, onShowComments }) {
    const [likesCount, setLikesCount] = useState(likes);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);
    const [commentsList, setCommentsList] = useState([
        "Beautiful house!",
        "I've stayed here before, it's amazing.",
        "Worth every penny!"
    ]); // If these comments are static, consider moving them outside of the component to avoid redeclaration on each render.
    const [shares, setShares] = useState(0);
    const [isCommentsVisible, setCommentsVisible] = useState(false);

    const showComments = () => {
        // Invoke the passed-in prop with the current listing's comments and title.
        onShowComments(commentsList, title); // we're now also passing the title
    };

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
        <div className="flex flex-col border-2 border-emerald-200 rounded-lg overflow-hidden shadow-md relative group">
            {featured && <span className="absolute top-1 right-1 bg-emerald-500 text-white py-1 px-3 text-xs sm:text-sm font-bold uppercase rounded-full">Featured</span>}
            <Image
                src={imageUrl}
                alt={title ? `Image of ${title}` : ""}
                width={500}
                height={500}
                objectFit="cover"
                quality={75}
                className="transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
            />
            <div className="p-2 sm:p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-4 truncate">{title}</h3>
                <p className="text-gray-600 mb-4 truncate border-b border-dotted border-emerald-200 pb-2">{description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                    <span className="font-bold text-xs sm:text-sm flex-shrink-0 text-emerald-500">KES{price}</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button
                            className="flex items-center space-x-1"
                            onClick={handleLike}
                            aria-label="Like"
                            style={{ outline: 'none' }}
                        >
                            <FiHeart className="text-red-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{likesCount}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Comments"
                            style={{ outline: 'none' }}
                            onClick={showComments} 
                        >
                            <FiMessageCircle className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{commentsList.length}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Share"
                            style={{ outline: 'none' }}
                        >
                            <FiShare className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{shares}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listing;