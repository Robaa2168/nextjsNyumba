// components/CommentModal.js
import { useState, React } from 'react';
import { FaThumbsUp, FaThumbsDown,FaSpinner } from 'react-icons/fa';



const CommentModal = ({ listingId, comments, title, onClose, isLoading }) => { 
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            // Prevent empty comments
            return;
        }
        setIsSubmitting(true); // Start submission (this disables the submit button)
        // Define a dummy username
        const dummyUsername = 'guest_user';  // You can choose any placeholder name for your scenario

        try {
            const commentPayload = {
                listing: listingId, // Change from "listingId" to "listing" to match server's expected key
                text: newComment.trim(),
                username: dummyUsername, // Using the dummy username
            };
            // Send the comment to your server
            const response = await fetch('/api/listings/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentPayload),
            });

            if (!response.ok) {
                throw new Error('Could not post comment');
            }

            const returnedComment = await response.json(); // Or handle the response as needed in your case

            // Optionally, add the new comment to the existing comments in the UI
            comments.push(returnedComment); // This depends on your server's response
            setNewComment(""); // Clear the input field

        } catch (error) {
            console.error('Failed to post comment:', error);
            // Handle the error (e.g., show a notification or message)
        } finally {
            setIsSubmitting(false); // End submission (this re-enables the submit button)
        }
    };


    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Modal Header */}
                    <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">{`Comments for ${title}`}</span>
                        <button onClick={onClose} className="text-gray-700 hover:text-emerald-600 transition duration-150 focus:outline-none">
                            &times;
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="px-4 py-3 overflow-auto" style={{ maxHeight: '500px' }}>
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                            <FaSpinner className="animate-spin" size={20} />
                        </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="mb-3 border-b border-gray-200 pb-2">
                                    {/* Comment Content */}
                                    <div className="flex space-x-3 md:space-x-4">
                                        <div className="flex-shrink-0">
                                            {comment.avatar ? (
                                                <img src={comment.avatar} alt="User Avatar" className="h-8 w-8 rounded-full md:h-10 md:w-10" />
                                            ) : (
                                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 md:h-10 md:w-10">
                                                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                        {/* SVG Placeholder */}
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-700 md:text-sm mb-0.5">{comment.text}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="font-medium">{comment.username}</span>
                                                <span className="mx-1.5 md:mx-2">&middot;</span>
                                                <span>{new Date(comment.date).toLocaleDateString("en-US", {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                            
                                    {/* Reactions */}
                                    <div className="flex space-x-2 md:space-x-4 mt-2">
                                        <button 
                                            className="text-gray-500 hover:text-emerald-600 focus:outline-none flex items-center space-x-1 py-1 px-1.5 rounded-md transition hover:bg-emerald-50 active:bg-emerald-100 md:px-2">
                                            <FaThumbsUp />
                                            <span>{comment.likes || 0}</span>
                                        </button>
                                        <button 
                                            className="text-gray-500 hover:text-red-500 focus:outline-none flex items-center space-x-1 py-1 px-1.5 rounded-md transition hover:bg-red-50 active:bg-red-100 md:px-2">
                                            <FaThumbsDown />
                                            <span>{comment.dislikes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                            
                            
                        ) : (
                            <p className="text-center text-gray-500">No comments yet.</p>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-emerald-200 focus:border-emerald-500"
                            rows="3"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                            disabled={isLoading}  // Disable input when loading
                        ></textarea>
                        <button
                            className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50"
                            onClick={handleCommentSubmit}
                            disabled={isSubmitting || isLoading}  // Disable button when submitting or loading
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;

