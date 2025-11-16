import { AuthNavigation } from "@/components/auth-navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { SUPPORT } from "@/config/links"
import { Footer } from "@/components/footer"
import { AnimatedElement, StaggeredContainer, AnimatedCard } from "@/components/animated-elements"

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
      <AuthNavigation />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <AnimatedElement animation="slideUp" duration={600}>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
                CosmoSecure <span className="text-primary">Features</span>
              </h1>
            </AnimatedElement>
            <AnimatedElement animation="slideUp" duration={600} delay={100}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                Discover the comprehensive features and tools that make CosmoSecure a robust password management solution
              </p>
            </AnimatedElement>
          </div>

          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" itemDelay={120}>
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                delay={index * 120}
              >
                <Card
                  className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 flex flex-col card-hover"
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
              </AnimatedCard>
            ))}
          </StaggeredContainer>

          <AnimatedElement animation="slideUp" duration={600} delay={600} className="mt-16 text-center" threshold={0.3}>
            <Card className="p-8 bg-card border-border max-w-2xl mx-auto card-hover">
              <h3 className="text-2xl font-bold text-card-foreground mb-3">Want to Contribute?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                CosmoSecure is open source and welcomes contributions! Join our community of developers building the future of password security.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-hover" asChild>
                <a href={SUPPORT.repository}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </Card>
          </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  )
}
