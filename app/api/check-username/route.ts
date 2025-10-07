import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username || username.length < 3) {
            return NextResponse.json(
                { available: false, message: 'Username must be at least 3 characters long' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Check if username already exists
        const existingUser = await users.findOne({ username: username.toLowerCase() });

        if (existingUser) {
            return NextResponse.json({
                available: false,
                message: 'Username is already taken'
            });
        }

        return NextResponse.json({
            available: true,
            message: 'Username is available'
        });

    } catch (error) {
        console.error('Username check error:', error);
        return NextResponse.json(
            { available: false, message: 'Error checking username availability' },
            { status: 500 }
        );
    }
}