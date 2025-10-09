import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, newPassword, resetSessionId } = await request.json();

        // Validation
        if (!email || !newPassword || !resetSessionId) {
            return NextResponse.json(
                { success: false, message: 'Email, new password, and session ID are required' },
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

        // Validate password strength
        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        const users = await getUsersCollection();

        // Find user with verified reset session
        const user = await users.findOne({
            email: email.toLowerCase(),
            'passwordResetSession.sessionId': resetSessionId,
            'passwordResetSession.expiresAt': { $gt: new Date() },
            'passwordResetSession.verified': true
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired reset session. Please start the password reset process again.' },
                { status: 400 }
            );
        }

        // Hash the new password using bcrypt with salt rounds 12 to match existing schema
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password hash in the hp[0].ph field and remove the reset session
        const updateResult = await users.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    'hp.0.ph': hashedPassword,
                    'l': new Date() // Update last login time
                },
                $unset: {
                    passwordResetSession: 1 // Remove the reset session data
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Failed to update password' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Password has been successfully reset'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}