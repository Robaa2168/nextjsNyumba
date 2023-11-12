// models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
contact: {
  phone: { type: String },
  email: { type: String },
},
  title: {
    type: String,
    required: true, 
    trim: true,
},
description: {
    type: String,
    required: true,
},
imageUrl: {
  type: [String],
  required: [true, 'At least one image URL is required'], 
  validate: {
    validator: function(array) {
      return Array.isArray(array) && array.length > 0;
    },
    message: 'You should provide at least one image.'
  }
},
price: {
    type: String,
    required: true,
},
featured: {
    type: Boolean,
    default: false,
},
likes: { 
    type: Number, 
    default: 0 
},
impressions: {
  type: Number,
  default: 0,
},
availability: { type: Boolean, default: true },
category: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Category', 
  required: true 
},
managementType: {
  type: String,
  enum: ['Landlord', 'Agency'],
  required: true,
},
rentDeadline: {
  type: Number,
  min: 1,
  max: 15,
  required: true,
},
location: {
  estate: { type: String },
  landmark: { type: String, required: true },
  landmarkCoordinates: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number], // [longitude, latitude] 
      required: true
    }
  },
  subCounty: { type: String, required: true },
  city: { type: String, default: 'Nairobi' },
  country: { type: String, default: 'Kenya' },
  houseLocation: { type: String, required: true },
  houseCoordinates: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number], // [longitude, latitude] 
      required: true
    }
  }
},


amenities: {
  wifi: { type: Boolean, default: false },
  parking: { 
      type: String, 
      enum: ['Limited', 'Medium', 'Enough'], 
      default: 'Limited' 
  },
  petsAllowed: { type: Boolean, default: false },
},
accessibility: {
  wheelchair: { type: Boolean, default: false },
  elevator: { type: Boolean, default: false },
},
policies: {
    cancellation: { type: String, required: true },
    houseRules: { type: String, required: true },
},
additionalPricing: {
    cleaningFee: { type: Number },
    deposit: { type: Number },
    extraPersonFee: { type: Number },
},
capacity: {
    guests: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
},
});

ListingSchema.index({ 'location.landmarkCoordinates': '2dsphere' });
ListingSchema.index({ 'location.houseCoordinates': '2dsphere' });

// Check if the model is already compiled, in which case use that, else compile it
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
export default Listing;