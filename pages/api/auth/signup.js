// pages/api/auth/signup.js

import { connectDb } from '../../../utils/db';
import AirbnbCloneUser from '../../../models/AirbnbCloneUser';
import bcrypt from 'bcryptjs';


const formatPhoneNumber = (phoneNumber) => {
    // Check for expected formats and modify accordingly
    if (phoneNumber.startsWith("+")) {
      return phoneNumber.slice(1); // remove the '+' prefix
    }
    else if (phoneNumber.startsWith("254")) {
      return phoneNumber; // format is already correct
    } else if (phoneNumber.startsWith("0")) {
      return `254${phoneNumber.slice(1)}`; // replace leading 0 with country code
    } else if (phoneNumber.startsWith("7") || phoneNumber.startsWith("1")) {
      return `254${phoneNumber}`; // add country code prefix
    } else {
      return phoneNumber;
    }
  };

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await connectDb();

    const { email, phoneNumber, password } = req.body; // Get user input

    // Check if required fields are provided
    if (!email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Format the phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    try {
        // Check if a user with the provided email already exists
        if (await AirbnbCloneUser.findOne({ email })) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique data for the new user
        const username = generateRandomUsername();
        const referralCode = generateReferralCode();
        const uniqueId = generateUniqueId();
        const otp = generateOtp();

        // Create the new user instance
        const newUser = new AirbnbCloneUser({
            email,
            phoneNumber: formattedPhoneNumber, // use the formatted phone number here
            password: hashedPassword,
            username,  // Autogenerated username
            referralCode,  // Autogenerated referral code
            uniqueId,  // Autogenerated unique ID
            otp,  // Autogenerated OTP
        });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error('Signup error', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


// Utility functions to generate unique information for the user

const adjectives = ['Adorable', 'Brave', 'Calm']; 
const nouns = ['Panda', 'Lion', 'Eagle'];

function generateRandomUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);

    return `${adj}${noun}${number}`;
}

const crypto = require('crypto');

function generateReferralCode() {
    return crypto.randomBytes(8).toString('hex');
}

const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
    return uuidv4();
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit code
}
