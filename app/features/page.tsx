import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { SUPPORT, DOCS, NAVIGATION } from "@/config/links"

const features = [
  {
    name: "CosmoSecure Desktop App",
    description:
      "The main desktop application built with Tauri, Rust, and React. Features AES encryption, secure vault management, password generation, and cross-platform support for Windows and Linux.",
    tags: ["Rust", "Tauri", "React", "Desktop App", "Open Source"],
  },
  {
    name: "Password Security Analytics",
    description:
      "Built-in security dashboard that analyzes password strength, detects duplicates, monitors password aging, and provides security recommendations for better digital hygiene.",
    tags: ["Analytics", "Security Dashboard", "Password Health", "React"],
  },
  {
    name: "Secure Password Generator",
    description:
      "Cryptographically secure password generator with customizable parameters. Generate strong passwords with options for length, character sets, and complexity requirements.",
    tags: ["Password Generator", "Cryptography", "Security Tools", "Utility"],
  },
  {
    name: "Email Breach Checker",
    description:
      "Built-in tool to check if your email address appears in known data breaches. Stay informed about potential security risks and take proactive measures.",
    tags: ["Breach Detection", "Email Security", "Data Monitoring", "Privacy"],
  },
  {
    name: "System Process Monitor",
    description:
      "Integrated system monitoring tools to track running processes and system resources. Helps identify potential security threats and system performance.",
    tags: ["System Monitor", "Process Tracking", "Security", "Performance"],
  },
  {
    name: "Theme System & UI",
    description:
      "Comprehensive theming system with multiple themes, responsive design, and customizable navigation modes. Built with Material-UI and Tailwind CSS for modern aesthetics.",
    tags: ["UI/UX", "Themes", "Responsive Design", "Material-UI", "Tailwind"],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              CosmoSecure <span className="text-primary">Features</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Discover the comprehensive features and tools that make CosmoSecure a robust password management solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{feature.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="p-8 bg-card border-border max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-card-foreground mb-3">Want to Contribute?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                CosmoSecure is open source and welcomes contributions! Join our community of developers building the future of password security.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <a href={SUPPORT.repository}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
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
