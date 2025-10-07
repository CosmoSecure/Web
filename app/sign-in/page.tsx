import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, UserPlus } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-lg mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Join CosmoSecure</h1>
            <p className="text-muted-foreground">We're signup-only! Create your secure account to get started.</p>
          </div>

          <Card className="p-6 bg-card border-border">
            <div className="text-center space-y-4">
              <UserPlus className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-card-foreground">Ready to Secure Your Passwords?</h3>
              <p className="text-sm text-muted-foreground">
                CosmoSecure uses a simple signup process with email verification.
                No existing accounts needed - just create a new secure account!
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Your Account
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
