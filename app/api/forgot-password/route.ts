import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Check if user exists with this email
        const existingUser = await users.findOne({
            email: email.toLowerCase()
        });

        if (!existingUser) {
            // For security, don't reveal if email exists or not
            return NextResponse.json(
                { success: true, message: 'If this email is registered, you will receive password reset instructions.' },
                { status: 200 }
            );
        }

        // Generate a unique session ID for password reset tracking
        const resetSessionId = `pwdreset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Store the reset session info in MongoDB
        // We'll let Clerk handle the actual OTP generation and sending
        await users.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    passwordResetSession: {
                        sessionId: resetSessionId,
                        expiresAt: sessionExpiry,
                        createdAt: new Date(),
                        verified: false,
                        email: email.toLowerCase()
                    }
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Password reset verification code has been sent to your email.',
            resetSessionId: resetSessionId,
            email: email.toLowerCase()
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}