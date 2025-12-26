"use client"

import { Aurora } from "@/components/aurora";
import { AuthNavigation } from "@/components/auth-navigation";
import { CometShower } from "@/components/comet-shower";
import { Footer } from "@/components/footer";


export default function DonatePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden w-full">
            <AuthNavigation />
            <CometShower />
            <Aurora />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 w-full max-w-full">
                <div className="w-full max-w-4xl flex flex-col items-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-center wrap-break-word w-full">Donate</h1>

                    <p className="text-base sm:text-lg text-muted-foreground mb-6 text-center w-full px-2 wrap-break-word">
                        Our mission is to make password management simple, secure, and open for everyone. If you like what we do, please consider supporting us.
                    </p>

                    <a
                        href="https://www.buymeacoffee.com/akash2061"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transition-transform hover:scale-105 max-w-full"
                    >
                        <img
                            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                            alt="Buy Me A Coffee"
                            className="h-10 sm:h-12 w-auto max-w-[280px] mx-auto btn-hover"
                            style={{ boxShadow: '0 4px 14px 0 rgba(255,186,0,0.39)' }}
                        />
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
}
