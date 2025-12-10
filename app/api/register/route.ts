import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { username, name, email, password, clerkUserId } = await request.json();

        // Validation
        if (!username || !name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { success: false, message: 'Username must be at least 3 characters long' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Check if username or email already exists
        const existingUser = await users.findOne({
            $or: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        });

        if (existingUser) {
            const field = existingUser.username === username.toLowerCase() ? 'Username' : 'Email';
            return NextResponse.json(
                { success: false, message: `${field} is already registered` },
                { status: 409 }
            );
        }

        // Hash password using bcrypt with salt rounds 12 to match the provided schema
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user document matching the exact schema provided
        const now = new Date();
        const userId = new ObjectId().toString();

        const newUser = {
            ui: userId, // user_id as ObjectId string
            username: username.toLowerCase(),
            n: name, // name
            ep: {
                ph: hashedPassword, // password hash (ph instead of hash)
                zkp: null
            }, // hashed_password object
            email: email.toLowerCase(),
            c: now, // created_at
            l: now, // last_login (set to creation time initially)
            uc: 0,  // username_change_count
            pc: [0, 25] // password_count [current: 0, max: 25]
        };

        // Insert user
        const result = await users.insertOne(newUser);

        if (result.insertedId) {
            return NextResponse.json({
                success: true,
                message: 'Account created successfully',
                userId: newUser.ui,
                mongoId: result.insertedId
            });
        } else {
            throw new Error('Failed to create user');
        }

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: 'Error creating account. Please try again.' },
            { status: 500 }
        );
    }
}