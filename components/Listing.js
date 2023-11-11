//components/Listing.js

import React, { useState, useCallback } from 'react';
import { FiHeart, FiBarChart, FiMessageCircle, FiShare } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import CommentModal from './CommentModal';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';


function Listing({ imageUrl, title, description, price, featured, _id, likes, comments, impressions, onShowComments }) {
    const [likesCount, setLikesCount] = useState(likes);
    const [shares, setShares] = useState(0);
    const [impressionCount, setImpressionCount] = useState(impressions);
    const { user } = useAuth();
    const router = useRouter();

    const showComments = () => {
        onShowComments(_id, title);
    };

    const handleLike = useCallback(async () => {
        if (!user) {
            router.push('/users/login');
            return;
        }
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

    const recordImpression = useCallback(async () => {
        // Update the local state to provide instant feedback to the user
        setImpressionCount(prevImpressionCount => prevImpressionCount + 1);

        try {
            const res = await fetch('/api/listings/record-impression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: _id }),
            });

            if (!res.ok) {
                throw new Error(`An error occurred: ${res.status}`);
            }

            const data = await res.json();
            setImpressionCount(data.impressions);
        } catch (error) {
            setImpressionCount(prevImpressionCount => prevImpressionCount - 1);
            console.error('Error recording impression:', error);
        }
    }, [_id]);

    return (
        <div className="flex flex-col border-2 border-emerald-200 rounded-lg overflow-hidden shadow-md relative group h-full">
            {featured && <span className="absolute top-1 right-1 bg-emerald-500 text-white py-1 px-3 text-xs sm:text-sm font-bold uppercase rounded-full">Featured</span>}
            <Image
                src={imageUrl[0]}
                alt={title ? `Image of ${title}` : ""}
                width={500}
                height={500}
                objectFit="cover"
                quality={75}
                className="transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
            />
            <div className="p-2 sm:p-4 flex flex-col justify-between h-full">
                <Link href={`/listings/${_id}`} onClick={recordImpression} className="hover:underline cursor-pointer">
                    <h3 className="font-semibold text-base sm:text-lg mb-4 truncate">{title}</h3>
                </Link>
                <p className="text-gray-600 mb-4 truncate border-b border-dotted border-emerald-200 pb-2">{description}</p>
                <div className="flex flex-row items-center justify-between w-full">
                    <span className="font-bold text-xs sm:text-sm flex-shrink-0 text-emerald-500">KES{price}</span>
                    <div className="flex space-x-2  sm:mt-0">
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
                            <span className="text-xs sm:text-sm">{comments}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Share"
                            style={{ outline: 'none' }}
                        >
                            <FiShare className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{shares}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Impressions"
                            style={{ outline: 'none' }}
                        >
                            <FiBarChart className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{impressionCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listing;