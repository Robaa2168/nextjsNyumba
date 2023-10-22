// models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        trim: true, },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  // additional fields as necessary
});

// Check if the model is already compiled, in which case use that, else compile it
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
export default Listing;