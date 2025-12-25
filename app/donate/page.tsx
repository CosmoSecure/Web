"use client"

import { Aurora } from "@/components/aurora";
import { AuthNavigation } from "@/components/auth-navigation";
import { CometShower } from "@/components/comet-shower";
import { Footer } from "@/components/footer";


export default function DonatePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <AuthNavigation />
            <CometShower />
            <Aurora />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 w-full">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-center break-words max-w-full">Donate</h1>

                <p className="text-base sm:text-lg text-muted-foreground mb-6 text-center max-w-2xl px-2 break-words">
                    Our mission is to make password management simple, secure, and open for everyone. If you like what we do, please consider supporting us.
                </p>

                <a
                    href="https://www.buymeacoffee.com/akash2061"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-transform hover:scale-105"
                >
                    <img
                        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                        alt="Buy Me A Coffee"
                        className="h-10 sm:h-12 w-auto max-w-[90vw] mx-auto btn-hover"
                        style={{ boxShadow: '0 4px 14px 0 rgba(255,186,0,0.39)' }}
                    />
                </a>
            </main>
            <Footer />
        </div>
    );
}
