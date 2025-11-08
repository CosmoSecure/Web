"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NAVIGATION, DOCS } from "@/config/links"
import { useAuth, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import { Icon } from "../assets/"

export function AuthNavigation() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { isSignedIn, isLoaded } = useAuth()
    const { signOut } = useClerk()

    const links = [
        { href: NAVIGATION.home, label: "Home" },
        { href: NAVIGATION.features, label: "Features" },
        { href: DOCS.readme, label: "Docs", external: true },
        { href: NAVIGATION.about, label: "About" },
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('isLoggedIn') === 'true';

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex justify-center items-center">
                        <Image src={Icon} alt="CosmoSecure Logo" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {links.map((link) => {
                            if (link.external) {
                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground nav-link-hover"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                )
                            }
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary nav-link-hover",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}

                        {/* Auth Buttons */}
                        {isLoaded && (
                            <>
                                {(isSignedIn || isLoggedIn) ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            handleSignOut();
                                            sessionStorage.removeItem('isLoggedIn'); // Clear session on logout
                                            window.location.reload(); // Force navigation to re-render
                                        }}
                                        className="flex items-center gap-2 btn-hover"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link href="/login">
                                            <Button size="sm" variant="outline" className="btn-hover">Sign In</Button>
                                        </Link>
                                        <Link href="/signup">
                                            <Button size="sm" className="btn-hover">Sign Up</Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {links.map((link) => {
                                if (link.external) {
                                    return (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary text-muted-foreground hover:bg-primary/10 rounded-md"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </a>
                                    )
                                }
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "block px-3 py-2 text-base font-medium transition-colors hover:text-primary hover:bg-primary/10 rounded-md",
                                            pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {/* Mobile Auth Buttons */}
                            {isLoaded && (
                                <div className="pt-2 space-y-2">
                                    {isSignedIn ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                handleSignOut()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full justify-center flex items-center gap-2 btn-hover"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button size="sm" variant="outline" className="w-full justify-center btn-hover">
                                                    Sign In
                                                </Button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button size="sm" className="w-full justify-center btn-hover">
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}