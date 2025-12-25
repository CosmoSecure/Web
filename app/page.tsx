"use client"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { AuthNavigation } from "@/components/auth-navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Shield, Lock, Zap, CheckCircle2, ChevronDown, X } from "lucide-react"
import { FaLinux, FaRedhat, FaDebian } from "react-icons/fa6"
import { DOWNLOADS, DOCS, SUPPORT } from "@/config/links"

import { CometShower } from "@/components/comet-shower"
import { Aurora } from "@/components/aurora"

export default function HomePage() {
  const [showDistroSelector, setShowDistroSelector] = useState(false)
  const [selectedDistro, setSelectedDistro] = useState<number | null>(null)

  const distributions = [
    {
      name: "AppImage (Universal)",
      description: "Works on all Linux distributions",
      downloadUrl: DOWNLOADS.linux.appImage,
      icon: <FaLinux className="text-lg text-primary" />,
      instructions: [
        "1. Download the CosmoSecure.AppImage file",
        "2. Make it executable: chmod +x CosmoSecure.AppImage",
        "3. Run directly: ./CosmoSecure.AppImage",
        "4. Optional: Move to /usr/local/bin for system-wide access"
      ]
    },
    {
      name: "Ubuntu / Debian (.deb)",
      description: "For Debian-based distributions",
      downloadUrl: DOWNLOADS.linux.deb,
      icon: <FaDebian className="text-lg text-primary" />,
      instructions: [
        "1. Download the CosmoSecure.deb file",
        "2. Install via GUI: Double-click the .deb file",
        "3. Or via terminal: sudo dpkg -i CosmoSecure.deb",
        "4. Fix dependencies if needed: sudo apt-get install -f"
      ]
    },
    {
      name: "Fedora / Red Hat (.rpm)",
      description: "For Red Hat-based distributions",
      downloadUrl: DOWNLOADS.linux.rpm,
      icon: <FaRedhat className="text-lg text-primary" />,
      instructions: [
        "1. Download the CosmoSecure.rpm file",
        "2. Install via DNF: sudo dnf install CosmoSecure.rpm",
        "3. Or via YUM: sudo yum localinstall CosmoSecure.rpm",
        "4. Or via RPM: sudo rpm -i CosmoSecure.rpm"
      ]
    },
  ]

  const handleDistroSelect = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank')
    setShowDistroSelector(false)
    setSelectedDistro(null)
  }

  const closeModal = () => {
    setShowDistroSelector(false)
    setSelectedDistro(null)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <AuthNavigation />

      {/* Distribution Selector Modal */}
      {showDistroSelector && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-2 sm:p-4 transition-smooth overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal()
            }
          }}
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl max-w-md w-[calc(100vw-1rem)] sm:w-full max-h-[90vh] overflow-y-auto card-hover my-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FaLinux className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Choose Linux Package</h3>
                  <p className="text-sm text-muted-foreground">Select your package format</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-2">
              {selectedDistro === null ? (
                // Distribution Selection View
                distributions.map((distro, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDistro(index)}
                    className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group card-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">{distro.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {distro.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {distro.description}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors -rotate-90" />
                    </div>
                  </button>
                ))
              ) : (
                // Installation Instructions View
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {distributions[selectedDistro].icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {distributions[selectedDistro].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Installation Instructions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Installation Steps:</h5>
                    <div className="space-y-2">
                      {distributions[selectedDistro].instructions.map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">{idx + 1}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {instruction.replace(/^\d+\.\s/, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDistro(null)}
                      className="flex-1"
                    >
                      Back to Selection
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDistroSelect(distributions[selectedDistro].downloadUrl)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Now
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-muted/30">
              {selectedDistro === null ? (
                <p className="text-xs text-muted-foreground text-center">
                  Not sure which to choose? AppImage works on all Linux distributions.
                </p>
              ) : (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="text-center font-medium">Need Help?</p>
                  <div className="flex justify-center gap-4">
                    <a href={DOCS.readme} className="hover:text-primary transition-colors">
                      Documentation
                    </a>
                    <a href={SUPPORT.issues} className="hover:text-primary transition-colors">
                      Support
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Aurora />
      <CometShower />

      {/* Hero Section */}
      <section className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 glow-hover backdrop-blur-md">
            <Shield className="h-4 w-4" />
            <span>Open Source Password Manager</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance break-words px-2">
            Secure Password Manager with <span className="text-primary">CosmoSecure</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto leading-relaxed px-2 break-words">
            A robust and secure password manager desktop application built with Tauri, Rust, and React.
            Keep your credentials safe with state-of-the-art AES encryption and intuitive design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground btn-hover"
              onClick={() => setShowDistroSelector(true)}
            >
              <Download className="mr-2 h-5 w-5" />
              Download for Linux
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 btn-hover bg-background/30 backdrop-blur-md"
              asChild
            >
              <a href={DOWNLOADS.windows.exe}>
                <Download className="mr-2 h-5 w-5" />
                Download for Windows
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="p-6 bg-card border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-hover">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Secure Storage</h3>
            <p className="text-muted-foreground leading-relaxed">
              State-of-the-art AES encryption to protect your passwords with zero-knowledge architecture.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-hover">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Password Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Effortlessly add, edit, delete, and view stored passwords with intuitive interface design.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 glow-hover">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Lightweight & Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built with Tauri for high performance. Available as AppImage, .deb, and .rpm packages for Linux, plus Windows installer.
            </p>
          </Card>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">Download CosmoSecure</h2>

          <p className="text-center text-muted-foreground mb-12 text-lg">
            Choose your platform and get started in minutes
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg glow-hover">
                  <FaLinux className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Linux</h3>
                  <p className="text-sm text-muted-foreground">Choose your distribution and package format</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>AppImage (Universal)</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>.deb (Debian/Ubuntu)</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>.rpm (Red Hat/Fedora)</span>
                </li>
              </ul>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground btn-hover"
                size="lg"
                onClick={() => setShowDistroSelector(true)}
              >
                <Download className="mr-2 h-5 w-5" />
                Choose Distribution
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-8 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg glow-hover">
                  <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Windows</h3>
                  <p className="text-sm text-muted-foreground">Windows 10, 11 (x64)</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Easy installer package</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>User-friendly interface</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Minimal resource usage</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground btn-hover" size="lg" asChild>
                <a href={DOWNLOADS.windows.exe}>
                  <Download className="mr-2 h-5 w-5" />
                  Download for Windows
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
