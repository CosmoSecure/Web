import { AuthNavigation } from "@/components/auth-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Github, Linkedin, Mail, Code, Heart, User, ExternalLink, Coffee } from "lucide-react"
import { CONTACT, DOCS, SUPPORT, NAVIGATION, DOWNLOADS } from "@/config/links"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <AuthNavigation />

            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <User className="h-4 w-4" />
                            <span>About the Developer</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                            About <span className="text-primary">CosmoSecure</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto leading-relaxed">
                            CosmoSecure is a passion project built with security, privacy, and user experience in mind.
                            Learn more about the project and the developer behind it.
                        </p>
                    </div>

                    {/* Project Story */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">The Story Behind CosmoSecure</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    CosmoSecure was born out of the need for a truly secure, open-source password manager
                                    that doesn't compromise on user privacy. Built with modern technologies like Tauri,
                                    Rust, and React, it combines the security of native applications with the flexibility
                                    of web technologies.
                                </p>
                                <p>
                                    The project emphasizes zero-knowledge architecture, meaning your data is encrypted
                                    locally and never leaves your device in an unencrypted form. This ensures that even
                                    if someone gains access to the stored data, it remains completely unreadable without
                                    your master password.
                                </p>
                                <p>
                                    Every feature is carefully crafted with security best practices in mind, from AES
                                    encryption to secure password generation and storage mechanisms.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-card-foreground">Security First</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Built with industry-standard AES encryption and zero-knowledge architecture.
                                </p>
                            </Card>

                            <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Code className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-card-foreground">Open Source</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Completely open source and transparent. You can review, audit, and contribute to the code.
                                </p>
                            </Card>

                            <Card className="p-6 bg-card border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Heart className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-card-foreground">Community Driven</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Built for the community, by the community. Your feedback and contributions matter.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Developer Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-8">Meet the Developer</h2>
                        <div className="max-w-2xl mx-auto">
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Hi! I'm <span className="font-semibold text-foreground">Akash Soni</span>, the developer behind CosmoSecure. I'm passionate about cybersecurity,
                                privacy, and building tools that empower users to take control of their digital security.
                                CosmoSecure represents my commitment to creating software that respects user privacy
                                while delivering exceptional functionality.
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-muted/30 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
                        <p className="text-muted-foreground mb-8">
                            Have questions, suggestions, or want to contribute? I'd love to hear from you!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                                <a href={`mailto:${CONTACT.developer.email}`}>
                                    <Mail className="mr-2 h-5 w-5" />
                                    Get in Touch
                                </a>
                            </Button>

                            <div className="hidden sm:block w-px bg-border h-8"></div>


                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10" asChild>
                                <a href={CONTACT.developer.github} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-5 w-5" />
                                    GitHub Profile
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>

                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10" asChild>
                                <a href={CONTACT.developer.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="mr-2 h-5 w-5" />
                                    LinkedIn Profile
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>

                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-600 hover:text-yellow-700" asChild>
                                <a href={CONTACT.social.buyMeACoffee} target="_blank" rel="noopener noreferrer">
                                    <Coffee className="mr-2 h-5 w-5" />
                                    Buy Me a Coffee
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                You can also reach out through GitHub issues for bug reports, feature requests, or general questions.
                            </p>
                        </div>
                    </div>

                    {/* Project Links */}
                    <div className="mt-16 grid md:grid-cols-4 gap-6">
                        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors text-center">
                            <h3 className="font-semibold text-card-foreground mb-3">Features Overview</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Explore all CosmoSecure features and capabilities.
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <a href="/features">
                                    View Features
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                        </Card>

                        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors text-center">
                            <h3 className="font-semibold text-card-foreground mb-3">Documentation</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Learn how to use CosmoSecure and explore all its features.
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <a href={DOCS.readme} target="_blank" rel="noopener noreferrer">
                                    Read Docs
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                        </Card>

                        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors text-center">
                            <h3 className="font-semibold text-card-foreground mb-3">Report Issues</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Found a bug or have a feature request? Let me know!
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <a href={SUPPORT.issues} target="_blank" rel="noopener noreferrer">
                                    Report Issue
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                        </Card>

                        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors text-center">
                            <h3 className="font-semibold text-card-foreground mb-3">Star the Project</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Support the project by giving it a star on GitHub.
                            </p>
                            <Button variant="ghost" size="sm" asChild>
                                <a href={SUPPORT.repository} target="_blank" rel="noopener noreferrer">
                                    Star on GitHub
                                    <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                            <a href={DOCS.readme} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Documentation
                            </a>
                            <a href={SUPPORT.issues} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}