"use client"

import { AuthNavigation } from "@/components/auth-navigation"
import { LoginForm } from "@/components/login-form"
import { Shield } from "lucide-react"
import { Footer } from "@/components/footer"
import { AnimatedElement } from "@/components/animated-elements"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <AuthNavigation />

            <section className="flex-1 flex items-center justify-center px-4 mt-4 mb-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <AnimatedElement animation="scaleUp" duration={500}>
                            <div className="flex justify-center items-center gap-3 mb-4">
                                <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg glow-hover">
                                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                </div>
                            </div>
                        </AnimatedElement>

                        <AnimatedElement animation="slideUp" duration={600} delay={100}>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Welcome Back</h1>
                        </AnimatedElement>

                        <AnimatedElement animation="slideUp" duration={600} delay={200}>
                            <p className="text-sm sm:text-base text-muted-foreground px-2 mt-3">
                                Sign in to your CosmoSecure account to access your secure password vault
                            </p>
                        </AnimatedElement>
                    </div>

                    <AnimatedElement animation="slideUp" duration={700} delay={300}>
                        <LoginForm />
                    </AnimatedElement>
                </div>
            </section>

            <Footer />
        </div>
    )
}