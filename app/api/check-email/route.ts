import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { available: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { available: false, message: 'Invalid email format' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Check if email already exists
        const existingUser = await users.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return NextResponse.json({
                available: false,
                message: 'Email is already registered'
            });
        }

        return NextResponse.json({
            available: true,
            message: 'Email is available'
        });

    } catch (error) {
        console.error('Email check error:', error);
        return NextResponse.json(
            { available: false, message: 'Error checking email availability' },
            { status: 500 }
        );
    }
}