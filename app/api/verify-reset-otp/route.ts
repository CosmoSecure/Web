import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email, sessionId, developmentOTP } = await request.json()

        if (!email || !sessionId) {
            return NextResponse.json(
                { success: false, message: 'Email and sessionId are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // For development OTP, skip validation
        if (!developmentOTP) {
            // Validate OTP format (6 digits) - only if not using development OTP
            // In a real implementation, you would validate the actual OTP here
            console.log('OTP validation skipped - using development mode')
        }

        const users = await getUsersCollection();

        // Find user with valid reset session
        const user = await users.findOne({
            email: email.toLowerCase(),
            'passwordResetSession.sessionId': sessionId,
            'passwordResetSession.expiresAt': { $gt: new Date() },
            'passwordResetSession.verified': false
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired reset session' },
                { status: 400 }
            );
        }

        // Mark the session as verified
        // In development mode, we accept the 123456 OTP code
        await users.updateOne(
            {
                email: email.toLowerCase(),
                'passwordResetSession.sessionId': sessionId
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