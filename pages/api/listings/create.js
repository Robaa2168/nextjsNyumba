// pages/api/listings/create.js

import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';
import AirbnbCloneUser from '../../../models/AirbnbCloneUser'; // Import the user model
import jwt from 'jsonwebtoken'; // Import jwt to decode the token

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Method not allowed
    return res.status(405).end();
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  // Ensure there is a token
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  let userId;

  try {
    // Verify and decode the token to get the user's information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId; // Use the 'userId' property, as that is what your token contains

    // Verify if the user exists in the database
    const user = await AirbnbCloneUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  // Connect to the database
  await connectDb();

  // Extract listing data from the request body and include the host
  const listingData = {
    ...req.body,
    host: userId, // Set the host field to the userId
  };

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
