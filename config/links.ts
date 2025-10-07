/**
 * Global Links Configuration
 * Centralized place to manage all links used across the website
 */

const GITHUB_BASE = "https://github.com/CosmoSecure/CosmoSecure"

// Navigation
export const NAVIGATION = {
    home: "/",
    features: "/features",
    about: "/about",
} as const

// Documentation
export const DOCS = {
    readme: `${GITHUB_BASE}/blob/master/README.md`,
} as const

// Support & Repository
export const SUPPORT = {
    issues: `${GITHUB_BASE}/issues`,
    repository: GITHUB_BASE,
} as const

// Downloads
export const DOWNLOADS = {
    windows: {
        exe: `${GITHUB_BASE}/releases/latest/download/CosmoSecure.exe`,
    },
    linux: {
        appImage: `${GITHUB_BASE}/releases/latest/download/CosmoSecure.AppImage`,
        deb: `${GITHUB_BASE}/releases/latest/download/CosmoSecure.deb`,
        rpm: `${GITHUB_BASE}/releases/latest/download/CosmoSecure.rpm`,
    },
} as const

// Contact (for About page)
export const CONTACT = {
    developer: {
        email: "aakash.soni8781@gmail.com",
        github: "https://github.com/akash2061",
        linkedin: "https://linkedin.com/in/akash2061",
    },
    social: {
        buyMeACoffee: "https://buymeacoffee.com/akash2061",
    },
} as const