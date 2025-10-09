"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useAuth, useClerk } from "@clerk/nextjs"
import Link from "next/link"

interface LoginFormProps {
    onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const { isSignedIn } = useAuth()
    const { signOut } = useClerk()
    const [formData, setFormData] = useState({
        identifier: '', // Can be username or email
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: formData.identifier.toLowerCase().trim(),
                    password: formData.password
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setSuccess('Login successful! Redirecting to features...')

                // Save session in sessionStorage
                sessionStorage.setItem('isLoggedIn', 'true')

                setTimeout(() => {
                    window.location.href = '/features'
                    onSuccess?.()
                }, 1000)
            } else {
                setError(data.message || 'Login failed. Please check your credentials.')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const isEmailFormat = (identifier: string) => {
        return identifier.includes('@')
    }

    // Show message if user is already signed in
    if (isSignedIn) {
        return (
            <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Already Signed In</h2>
                    <p className="text-muted-foreground text-sm">
                        You're currently signed in. To log in with a different account, please sign out first.
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
                        Sign Out & Login with Different Account
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-4 sm:p-6 lg:p-8 bg-card border-border w-full mx-auto shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Username/Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium">
                        Username or Email
                    </Label>
                    <div className="relative">
                        {isEmailFormat(formData.identifier) ? (
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        ) : (
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                            id="identifier"
                            type="text"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            className="pl-10 text-sm sm:text-base"
                            placeholder="Enter username or email"
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
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
                            placeholder="Enter your password"
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
                    disabled={isLoading || !formData.identifier || !formData.password}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                {/* Additional Links */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </Card>
    )
}