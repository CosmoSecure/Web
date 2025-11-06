import { NAVIGATION, DOCS } from "@/config/links"
import { Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">© 2025 CosmoSecure. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href={NAVIGATION.about} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            About
                        </a>
                        <a href={DOCS.readme} target="_blank" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Documentation
                        </a>
                        <a href={NAVIGATION.donate} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
