import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUsersCollection } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
    try {
        const { identifier, password } = await request.json()

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, message: 'Username/email and password are required' },
                { status: 400 }
            )
        }

        const users = await getUsersCollection()

        // Search for user by username or email
        const user = await users.findOne({
            $or: [
                { username: identifier.toLowerCase() },
                { email: identifier.toLowerCase() }
            ]
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid username/email or password' },
                { status: 401 }
            )
        }

        // Check if user has a password hash
        if (!user.ep || !user.ep.ph) {
            return NextResponse.json(
                { success: false, message: 'Account not properly configured. Please contact support.' },
                { status: 500 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.ep.ph)

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid username/email or password' },
                { status: 401 }
            )
        }

        // Login successful - update last login time
        await users.updateOne(
            { _id: user._id },
            { $set: { 'l': new Date() } }
        )

        // Return user info (without sensitive data)
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.n,
                lastLogin: new Date()
            }
        })

    } catch (error) {
        console.error('Login API error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}