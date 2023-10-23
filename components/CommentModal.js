// components/CommentModal.js
import { useState, React } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';


const CommentModal = ({ comments, title, onClose }) => {
    const [newComment, setNewComment] = useState("");

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        // Here you would handle the new comment submission, e.g., sending it to the server
        // Then you might want to clear the input field and update the comment list
        setNewComment("");
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* Overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* This part is to trick the browser into centering the modal contents. */}
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
                        {comments.map((comment, index) => (
                            <div key={index} className="mb-3 border-b border-gray-100 pb-2">
                                {/* Comment Content */}
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                            <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                {/* SVG Placeholder */}
                                            </svg>
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800">{comment.text}</p>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <span>{comment.username}</span>
                                            <span className="mx-1">&middot;</span>
                                            <span>{comment.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reactions */}
                                <div className="flex space-x-3 mt-2">
                                    <button className="text-gray-400 hover:text-emerald-600 focus:outline-none flex items-center">
                                        <FaThumbsUp className="mr-1" /> {comment.likes || 0}
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600 focus:outline-none flex items-center">
                                        <FaThumbsDown className="mr-1" /> {comment.dislikes || 0}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                   {/* Comment Input */}
                   <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-emerald-200 focus:border-emerald-500"
                            rows="3"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Add a comment..."
                        ></textarea>
                        <button
                            className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50"
                            onClick={handleCommentSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;



