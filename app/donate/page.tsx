"use client"

import { AuthNavigation } from "@/components/auth-navigation";
import { Footer } from "@/components/footer";
import { AnimatedElement } from "@/components/animated-elements";

export default function DonatePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AuthNavigation />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <AnimatedElement animation="slideUp" duration={600}>
                    <h1 className="text-6xl font-bold text-foreground mb-2 text-center">Donate</h1>
                </AnimatedElement>

                <AnimatedElement animation="slideUp" duration={600} delay={100}>
                    <p className="text-lg text-muted-foreground mb-4 text-center">
                        Our mission is to make password management simple, secure, and open for everyone. <br />If you like what we do, please consider supporting us.
                    </p>
                </AnimatedElement>

                <AnimatedElement animation="zoomIn" duration={600} delay={200}>
                    <a
                        href="https://www.buymeacoffee.com/akash2061"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transition-transform hover:scale-105"
                    >
                        <img
                            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                            alt="Buy Me A Coffee"
                            className="h-12 w-auto mx-auto btn-hover"
                            style={{ boxShadow: '0 4px 14px 0 rgba(255,186,0,0.39)' }}
                        />
                    </a>
                </AnimatedElement>
            </main>
            <Footer />
        </div>
    );
}
