// pages/api/auth/login.js

import { connectDb } from '../../../utils/db';
import AirbnbCloneUser from '../../../models/AirbnbCloneUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    await connectDb();

    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await AirbnbCloneUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back token to the client
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Login error', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
