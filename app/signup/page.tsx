import { Navigation } from "@/components/navigation"
import { SignupForm } from "@/components/signup-form"
import { Shield } from "lucide-react"
import { DOCS, SUPPORT, NAVIGATION } from "@/config/links"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">Join CosmoSecure and start securing your digital life</p>
          </div>

          <SignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
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
