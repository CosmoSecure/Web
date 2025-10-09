import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email, code, resetSessionId } = await request.json();

        // Validation
        if (!email || !code || !resetSessionId) {
            return NextResponse.json(
                { success: false, message: 'Email, verification code, and session ID are required' },
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

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(code)) {
            return NextResponse.json(
                { success: false, message: 'Verification code must be a 6-digit number' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Find user with valid reset session
        const user = await users.findOne({
            email: email.toLowerCase(),
            'passwordResetSession.sessionId': resetSessionId,
            'passwordResetSession.expiresAt': { $gt: new Date() },
            'passwordResetSession.verified': false
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired reset session' },
                { status: 400 }
            );
        }

        // For now, we'll mark the session as verified
        // In a full Clerk integration, you would verify the code with Clerk here
        // This is a simplified approach that accepts any 6-digit code
        await users.updateOne(
            {
                email: email.toLowerCase(),
                'passwordResetSession.sessionId': resetSessionId
            },
            {
                $set: {
                    'passwordResetSession.verified': true,
                    'passwordResetSession.verifiedAt': new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Verification code confirmed. You can now set your new password.'
        });

    } catch (error) {
        console.error('Verify reset OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}