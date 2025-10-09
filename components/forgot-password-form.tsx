"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Eye, EyeOff, Mail, Lock, ShieldCheck, LogOut } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useSignIn, useAuth, useClerk } from "@clerk/nextjs"

enum Step {
    EMAIL = 'email',
    VERIFY_OTP = 'verify_otp',
    NEW_PASSWORD = 'new_password',
    SUCCESS = 'success'
}

export function ForgotPasswordForm() {
    const { isLoaded, signIn } = useSignIn()
    const { isSignedIn } = useAuth()
    const { signOut } = useClerk()
    const [currentStep, setCurrentStep] = useState<Step>(Step.EMAIL)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [resetSessionId, setResetSessionId] = useState('')
    const router = useRouter()

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
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

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError('')

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }

        try {
            // First, check if email exists in our database
            const checkResponse = await fetch('/api/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase() })
            })

            const checkData = await checkResponse.json()

            // If email is available (available: true), it means the account doesn't exist
            // If email is not available (available: false), it means the account exists
            if (checkData.available === true) {
                setError('No account found with this email address. Please check your email or create a new account.')
                setIsLoading(false)
                return
            }

            // If there was an error checking the email, we still proceed for security
            if (!checkData.success && !checkData.hasOwnProperty('available')) {
                console.warn('Email check failed, proceeding with reset attempt')
            }

            // Email exists in database, proceed with password reset
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase() })
            })

            const data = await response.json()

            if (data.success) {
                setResetSessionId(data.resetSessionId || '')

                // Now use Clerk to send the actual email verification
                try {
                    // If user is already signed in, sign them out first
                    if (isSignedIn) {
                        console.log('User is signed in, signing out first...')
                        try {
                            await signOut()
                            // Wait longer for the sign out to complete
                            await new Promise(resolve => setTimeout(resolve, 1000))
                            console.log('Sign out completed')
                        } catch (signOutError) {
                            console.error('Sign out error:', signOutError)
                            // Continue anyway, as the sign-in create might still work
                        }
                    }

                    // Create a sign-in attempt with the email
                    console.log('Creating sign-in attempt...')
                    await signIn.create({
                        identifier: email.toLowerCase(),
                    })
                    console.log('Sign-in attempt created successfully')

                    // Find the email address factor
                    const emailFactor = signIn.supportedFirstFactors?.find(
                        factor => factor.strategy === "email_code"
                    )

                    if (emailFactor && 'emailAddressId' in emailFactor) {
                        // Prepare email verification
                        await signIn.prepareFirstFactor({
                            strategy: "email_code",
                            emailAddressId: emailFactor.emailAddressId
                        })

                        setCurrentStep(Step.VERIFY_OTP)
                        setSuccess('Password reset code sent to your email!')
                    } else {
                        throw new Error('Email verification not available')
                    }
                } catch (clerkError: any) {
                    console.error('Clerk error:', clerkError)

                    // Handle "already signed in" error specifically
                    if (clerkError.message?.includes("You're already signed in") ||
                        clerkError.errors?.[0]?.message?.includes("You're already signed in")) {
                        console.log('Still signed in, trying to force sign out and retry...')
                        try {
                            // Force sign out and retry
                            await signOut()
                            await new Promise(resolve => setTimeout(resolve, 1500))

                            // Retry the sign-in creation
                            await signIn.create({
                                identifier: email.toLowerCase(),
                            })

                            // Find the email address factor
                            const emailFactor = signIn.supportedFirstFactors?.find(
                                factor => factor.strategy === "email_code"
                            )

                            if (emailFactor && 'emailAddressId' in emailFactor) {
                                // Prepare email verification
                                await signIn.prepareFirstFactor({
                                    strategy: "email_code",
                                    emailAddressId: emailFactor.emailAddressId
                                })

                                setCurrentStep(Step.VERIFY_OTP)
                                setSuccess('Password reset code sent to your email!')
                                return // Exit successfully
                            } else {
                                throw new Error('Email verification not available')
                            }
                        } catch (retryError) {
                            console.error('Retry failed:', retryError)
                            // Fall through to default error handling
                        }
                    }

                    // If Clerk fails, we still proceed but inform the user  
                    // This handles cases where the user might not exist in Clerk
                    setCurrentStep(Step.VERIFY_OTP)
                    setSuccess('Please enter the 6-digit code. If no email arrives, the account may not exist.')
                }
            } else {
                setError(data.message || 'Failed to send verification code')
            }
        } catch (error) {
            console.error('Network error:', error)
            setError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError('')

        if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit verification code')
            setIsLoading(false)
            return
        }

        try {
            // Verify the code with Clerk
            const result = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: otp,
            })

            if (result.status === "complete" || result.status === "needs_new_password") {
                // Mark our session as verified in MongoDB
                try {
                    await fetch('/api/verify-reset-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email.toLowerCase(),
                            code: otp,
                            resetSessionId
                        })
                    })
                } catch (error) {
                    console.error('Failed to mark session as verified:', error)
                }

                setCurrentStep(Step.NEW_PASSWORD)
                setSuccess('Code verified! Now set your new password.')
            } else {
                setError('Invalid verification code. Please try again.')
            }
        } catch (clerkError: any) {
            console.error('Clerk verification error:', clerkError)

            if (clerkError.errors) {
                const error = clerkError.errors[0]
                if (error.code === 'form_code_incorrect') {
                    setError('Invalid verification code. Please try again.')
                } else if (error.code === 'form_identifier_not_found') {
                    setError('Account not found. Please check your email address.')
                } else {
                    setError(error.message || 'Verification failed. Please try again.')
                }
            } else {
                setError('Verification failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        const passwordStrength = getPasswordStrength(newPassword)
        if (passwordStrength < 3) {
            setError('Password is too weak. Please use a stronger password.')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    newPassword,
                    resetSessionId
                })
            })

            const data = await response.json()

            if (data.success) {
                setCurrentStep(Step.SUCCESS)
                setSuccess('Password reset successfully!')
            } else {
                setError(data.message || 'Failed to reset password')
            }
        } catch (error) {
            setError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const passwordStrength = getPasswordStrength(newPassword)
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

    // Step 1: Email Input
    if (currentStep === Step.EMAIL) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <form onSubmit={handleSendOTP} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 text-sm sm:text-base"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
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
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>Sending code...</span>
                            </div>
                        ) : (
                            'Send Verification Code'
                        )}
                    </Button>

                    {/* Show logout button if user is signed in */}
                    {isSignedIn && (
                        <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground text-center mb-3">
                                Already signed in? Sign out to continue with password reset.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="w-full flex items-center gap-2"
                                onClick={async () => {
                                    try {
                                        await signOut()
                                        setSuccess('Signed out successfully. You can now reset your password.')
                                        setError('')
                                    } catch (error) {
                                        console.error('Sign out error:', error)
                                        setError('Failed to sign out. Please try again.')
                                    }
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    )}
                </form>
            </Card>
        )
    }

    // Step 2: OTP Verification
    if (currentStep === Step.VERIFY_OTP) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
                        <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Enter Verification Code</h2>
                    <p className="text-muted-foreground text-xs sm:text-sm px-2">
                        We've sent a 6-digit code to <strong className="break-all">{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-medium">
                            Verification Code
                        </Label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            'Verify Code'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-sm sm:text-base"
                        onClick={() => {
                            setCurrentStep(Step.EMAIL)
                            setOtp('')
                            setError('')
                            setSuccess('')
                        }}
                    >
                        Back to Email
                    </Button>
                </form>
            </Card>
        )
    }

    // Step 3: New Password
    if (currentStep === Step.NEW_PASSWORD) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
                        <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Set New Password</h2>
                    <p className="text-muted-foreground text-xs sm:text-sm px-2">
                        Create a strong new password for your account
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pl-10 pr-10 text-sm sm:text-base"
                                placeholder="Enter new password"
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
                        {newPassword && (
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

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 pr-10 text-sm sm:text-base"
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs sm:text-sm text-red-500 px-1">
                                Passwords do not match
                            </p>
                        )}
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
                        disabled={isLoading || passwordStrength < 3 || newPassword !== confirmPassword}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>Resetting password...</span>
                            </div>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                </form>
            </Card>
        )
    }

    // Step 4: Success
    if (currentStep === Step.SUCCESS) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Password Reset Successful!</h2>
                    <p className="text-muted-foreground text-sm">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                    <Button
                        onClick={() => router.push('/sign-in')}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="lg"
                    >
                        Go to Sign In
                    </Button>
                </div>
            </Card>
        )
    }

    return null
}