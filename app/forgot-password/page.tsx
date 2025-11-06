import { AuthNavigation } from "@/components/auth-navigation"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <AuthNavigation />

            <section className="flex-1 flex items-center justify-center px-4 mt-4 mb-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sign In
                        </Link>

                        <div className="flex justify-center items-center gap-3">
                            <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
                                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">Reset Your Password</h1>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground px-2">
                            Enter your email address and we'll send you a verification code to reset your password
                        </p>
                    </div>

                    <ForgotPasswordForm />
                </div>
            </section>

            <Footer />
        </div>
    )
}