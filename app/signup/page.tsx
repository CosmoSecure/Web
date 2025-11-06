import { AuthNavigation } from "@/components/auth-navigation"
import { SignupForm } from "@/components/signup-form"
import { Shield } from "lucide-react"
import { Footer } from "@/components/footer"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthNavigation />

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

      <Footer />
    </div>
  )
}
