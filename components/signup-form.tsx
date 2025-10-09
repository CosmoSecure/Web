"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Eye, EyeOff, User, Mail, Lock, UserCheck, ShieldCheck } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useSignUp, useAuth, useClerk } from "@clerk/nextjs"

interface SignupFormProps {
    onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { isSignedIn } = useAuth()
    const { signOut } = useClerk()
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<{
        checking: boolean;
        available: boolean | null;
        message: string;
    }>({ checking: false, available: null, message: '' })
    const [emailStatus, setEmailStatus] = useState<{
        checking: boolean;
        available: boolean | null;
        message: string;
    }>({ checking: false, available: null, message: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const checkUsernameAvailability = async (username: string) => {
        if (username.length < 3) {
            setUsernameStatus({ checking: false, available: false, message: 'Username must be at least 3 characters' })
            return
        }

        setUsernameStatus({ checking: true, available: null, message: 'Checking...' })

        try {
            const response = await fetch('/api/check-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })

            const data = await response.json()
            setUsernameStatus({
                checking: false,
                available: data.available,
                message: data.message
            })
        } catch (error) {
            setUsernameStatus({
                checking: false,
                available: false,
                message: 'Error checking username'
            })
        }
    }

    const checkEmailAvailability = async (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setEmailStatus({ checking: false, available: false, message: 'Invalid email format' })
            return
        }

        setEmailStatus({ checking: true, available: null, message: 'Checking...' })

        try {
            const response = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()
            setEmailStatus({
                checking: false,
                available: data.available,
                message: data.message
            })
        } catch (error) {
            setEmailStatus({
                checking: false,
                available: false,
                message: 'Error checking email'
            })
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
        setFormData({ ...formData, username })

        if (username.length >= 3) {
            // Reduced timeout for faster checking
            const timeoutId = setTimeout(() => {
                checkUsernameAvailability(username)
            }, 300)
            return () => clearTimeout(timeoutId)
        } else {
            setUsernameStatus({ checking: false, available: null, message: '' })
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value.toLowerCase()
        setFormData({ ...formData, email })

        if (email.includes('@') && email.includes('.')) {
            // Reduced timeout for faster checking
            const timeoutId = setTimeout(() => {
                checkEmailAvailability(email)
            }, 300)
            return () => clearTimeout(timeoutId)
        } else {
            setEmailStatus({ checking: false, available: null, message: '' })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError('')

        if (!usernameStatus.available) {
            setError('Please choose an available username')
            setIsLoading(false)
            return
        }

        if (!emailStatus.available) {
            setError('Please use an available email address')
            setIsLoading(false)
            return
        }

        try {
            // If user is already signed in, sign them out first
            if (isSignedIn) {
                await signOut()
                // Wait a moment for the signout to complete
                await new Promise(resolve => setTimeout(resolve, 300))
            }

            // Step 1: Create Clerk user for email verification
            const signUpResponse = await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.name.split(' ')[0],
                lastName: formData.name.split(' ').slice(1).join(' ') || '',
                username: formData.username,
            })

            // Step 2: Send email verification
            try {
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code"
                })
            } catch (emailError) {
                console.error('Email preparation error:', emailError)
                // Continue anyway - user can still try to verify
            }

            setPendingVerification(true)
            setIsLoading(false)

        } catch (err: any) {
            console.error('Signup error:', err)

            // Handle specific Clerk errors more gracefully
            if (err.errors) {
                const error = err.errors[0]
                if (error.code === 'session_exists' || error.message?.includes('already signed in')) {
                    // Clear session and continue with signup flow
                    try {
                        await signOut()
                        await new Promise(resolve => setTimeout(resolve, 500))

                        // Retry the signup after clearing session
                        const retrySignUp = await signUp.create({
                            emailAddress: formData.email,
                            password: formData.password,
                            firstName: formData.name.split(' ')[0],
                            lastName: formData.name.split(' ').slice(1).join(' ') || '',
                            username: formData.username,
                        })

                        // Prepare email verification
                        await signUp.prepareEmailAddressVerification({
                            strategy: "email_code"
                        })

                        setPendingVerification(true)
                        setIsLoading(false)
                        return
                    } catch (retryError) {
                        console.error('Retry signup error:', retryError)
                        setError('Please sign out from the navigation bar and try again.')
                    }
                }
                const errorMessage = error.message || 'Error creating account'
                setError(errorMessage)
            } else {
                setError('Error creating account. Please try again.')
            }
            setIsLoading(false)
        }
    }

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setVerifying(true)
        setError('')

        try {
            // Step 3: Verify email with Clerk
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            })

            if (completeSignUp.status === "complete") {
                // Step 4: Save to MongoDB in parallel with session creation (faster)
                const [mongoResponse] = await Promise.allSettled([
                    fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...formData,
                            clerkUserId: completeSignUp.createdUserId
                        })
                    })
                ])

                // Handle MongoDB response
                if (mongoResponse.status === 'fulfilled') {
                    const data = await mongoResponse.value.json()

                    if (data.success) {
                        // Set active session
                        try {
                            await setActive({ session: completeSignUp.createdSessionId })
                        } catch (sessionError: any) {
                            // If session setting fails, it might already be active - continue
                            console.warn('Session setting warning:', sessionError)
                        }

                        setSuccess('Email verified! Account created successfully!')
                        setTimeout(() => {
                            router.push('/features')
                            onSuccess?.()
                        }, 1000) // Reduced delay for faster UX
                    } else {
                        setError(data.message || 'Error saving account details')
                    }
                } else {
                    setError('Error saving account details. Please contact support.')
                }
            } else {
                setError('Email verification incomplete. Please try again.')
            }
        } catch (err: any) {
            console.error('Verification error:', err)

            // Handle specific error cases
            if (err.errors) {
                const error = err.errors[0]
                if (error.code === 'verification_failed') {
                    setError('Invalid verification code. Please check and try again.')
                } else if (error.code === 'session_exists') {
                    // Session already exists - try to set it active
                    try {
                        if (signUp.createdSessionId) {
                            await setActive({ session: signUp.createdSessionId })
                        }
                        setSuccess('Account verified successfully!')
                        setTimeout(() => {
                            router.push('/features')
                            onSuccess?.()
                        }, 1000)
                        return
                    } catch (sessionError) {
                        console.warn('Session activation error:', sessionError)
                        setError('Account created but session error. Please sign in manually.')
                        return
                    }
                } else {
                    setError(error.message || 'Verification failed')
                }
            } else {
                setError('Invalid verification code. Please try again.')
            }
        } finally {
            setVerifying(false)
        }
    }

    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[a-z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        return strength
    }

    const passwordStrength = getPasswordStrength(formData.password)
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

    // Show message if user is already signed in
    if (isSignedIn && !pendingVerification) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Already Signed In</h2>
                    <p className="text-muted-foreground text-sm">
                        You're currently signed in. To create a new account, please sign out first.
                    </p>
                    <Button
                        onClick={async () => {
                            try {
                                await signOut()
                                window.location.reload()
                            } catch (err) {
                                console.error('Sign out error:', err)
                            }
                        }}
                        className="w-full"
                    >
                        Sign Out & Create New Account
                    </Button>
                </div>
            </Card>
        )
    }

    if (pendingVerification) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
                        <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
                    <p className="text-muted-foreground text-xs sm:text-sm px-2">
                        We've sent a verification code to <strong className="break-all">{formData.email}</strong>
                    </p>
                    <p className="text-muted-foreground text-xs px-2 mt-2">
                        Check your email inbox and spam folder for the 6-digit code.
                    </p>
                </div>

                <form onSubmit={handleVerifyEmail} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-sm font-medium">
                            Verification Code
                        </Label>
                        <Input
                            id="code"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="text-center text-base sm:text-lg tracking-widest"
                            required
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="border-green-500 text-green-700 bg-green-50">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
                        size="lg"
                        disabled={verifying || verificationCode.length !== 6}
                    >
                        {verifying ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span className="text-sm sm:text-base">Verifying...</span>
                            </div>
                        ) : (
                            'Verify Email'
                        )}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 text-sm sm:text-base"
                            onClick={async () => {
                                try {
                                    setError('')
                                    if (signUp) {
                                        await signUp.prepareEmailAddressVerification({
                                            strategy: "email_code"
                                        })
                                        setSuccess('Verification code resent!')
                                    } else {
                                        setError('Unable to resend code. Please refresh and try again.')
                                    }
                                } catch (err) {
                                    console.error('Resend error:', err)
                                    setError('Failed to resend code. Please try again.')
                                }
                            }}
                        >
                            Resend Code
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 text-sm sm:text-base"
                            onClick={async () => {
                                setPendingVerification(false)
                                setVerificationCode('')
                                setError('')
                                setSuccess('')
                                // Clear any existing sessions to start fresh
                                try {
                                    if (isSignedIn) {
                                        await signOut()
                                    }
                                } catch (err) {
                                    // Ignore errors when resetting
                                    console.warn('Reset session warning:', err)
                                }
                            }}
                        >
                            Back to Sign Up
                        </Button>
                    </div>
                </form>
            </Card>
        )
    }

    return (
        <div className="relative w-full">
            {/* Clerk CAPTCHA widget container - positioned for proper visibility */}
            <div id="clerk-captcha" className="mb-4 flex justify-center"></div>

            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs sm:text-sm font-medium">
                            Username
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={handleUsernameChange}
                                className="pl-10 pr-10 text-sm sm:text-base"
                                placeholder="Enter username"
                                required
                            />
                            {usernameStatus.checking && (
                                <div className="absolute right-3 top-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                </div>
                            )}
                            {!usernameStatus.checking && usernameStatus.available === true && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                            )}
                            {!usernameStatus.checking && usernameStatus.available === false && formData.username.length >= 3 && (
                                <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                            )}
                        </div>
                        {usernameStatus.message && (
                            <p className={`text-xs sm:text-sm ${usernameStatus.available ? 'text-green-500' : 'text-red-500'} px-1`}>
                                {usernameStatus.message}
                            </p>
                        )}
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                            Full Name
                        </Label>
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pl-10 text-sm sm:text-base"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleEmailChange}
                                className="pl-10 pr-10 text-sm sm:text-base"
                                placeholder="Enter your email"
                                required
                            />
                            {emailStatus.checking && (
                                <div className="absolute right-3 top-3">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                </div>
                            )}
                            {!emailStatus.checking && emailStatus.available === true && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                            )}
                            {!emailStatus.checking && emailStatus.available === false && formData.email.includes('@') && (
                                <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                            )}
                        </div>
                        {emailStatus.message && formData.email && (
                            <p className={`text-xs sm:text-sm ${emailStatus.available ? 'text-green-500' : 'text-red-500'} px-1`}>
                                {emailStatus.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs sm:text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="pl-10 pr-10 text-sm sm:text-base"
                                placeholder="Create a strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="space-y-2">
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded ${level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground px-1">
                                    Strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter password'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <Alert className="border-green-500 text-green-700 bg-green-50">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
                        size="lg"
                        disabled={isLoading || !usernameStatus.available || !emailStatus.available || passwordStrength < 3}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span className="text-sm sm:text-base">Setting up account...</span>
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </Button>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Have an account?{' '}
                            <a href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                                Log In
                            </a>
                        </p>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground text-center px-2 leading-relaxed">
                        By creating an account, you agree to keep your passwords secure with CosmoSecure.
                    </p>
                </form>
            </Card>
        </div>
    )
}