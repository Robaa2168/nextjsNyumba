// pages/api/listings/create.js

import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Method not allowed
    return res.status(405).end();
  }

  // Connect to the database
await connectDb();

  // Extract listing data from the request body
  const listingData = req.body;

  try {
    // Create a new listing record in the database
    const listing = await Listing.create(listingData);
    
    // Send the new listing as the response
    res.status(201).json(listing);
  } catch (error) {
    // If an error occurs, send a server error response
    res.status(500).json({ message: 'An error occurred while creating the listing.', error });
  }
}
