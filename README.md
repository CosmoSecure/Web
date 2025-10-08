# CosmoSecure Website

A modern, responsive website for CosmoSecure - a robust and secure password manager desktop application built with Tauri, Rust, and React.

## Features

- **Home Page**: Showcases CosmoSecure password manager with download buttons for Linux and Windows
- **Features Page**: Displays comprehensive features and tools of the CosmoSecure desktop application
- **Authentication**: User signup and signin with email verification via Clerk (free tier available)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Professional dark mode design with primary accents

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS v4
- **Authentication**: Clerk (handles signup, signin, email verification)
- **UI Components**: shadcn/ui with Radix UI
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Clerk account (free tier available)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Clerk authentication:
   - Sign up for a free account at [Clerk](https://clerk.com)
   - Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com)
   - Copy your API keys from the dashboard
   - Create a `.env.local` file and add your keys:
   
     ```bash
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
     CLERK_SECRET_KEY=sk_test_your_secret_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

### Required

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key (client-side)
- `CLERK_SECRET_KEY`: Clerk secret key (server-side)

## Setting Up Clerk Authentication

1. Sign up for a free account at [Clerk](https://clerk.com)
2. Create a new application in the dashboard
3. Configure email verification:
   - Go to "Email, Phone, Username" settings
   - Enable email verification
   - Clerk automatically sends verification emails (no additional setup needed)
4. Copy your API keys and add them to `.env.local`
5. Customize the appearance in `app/layout.tsx` if needed

## Pages

- `/` - Home page with CosmoSecure password manager branding and download buttons
- `/features` - Features showcase of CosmoSecure desktop application
- `/signup` - User registration with email verification OTP (powered by Clerk)
- `/sign-in` - Redirects to signup page

## Features

### Authentication
- Email-based signup with OTP verification
- Secure email verification process
- User profile management
- No database setup required (Clerk handles user storage)
- Sign-in functionality redirects to signup

### Design
- Professional dark theme with cyan accents
- Responsive navigation with user menu
- Clean, modern UI components
- Optimized for both desktop and mobile

## Development Notes

- Clerk provides free email verification (no paid email service needed)
- Update GitHub release URLs in the download buttons on the home page
- Customize feature cards in `/features` page with your actual features
- Clerk's free tier includes:
  - Up to 10,000 monthly active users
  - Email verification
  - Social login options
  - User management dashboard

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Deploy

## Customization

### Update Download Links
The download links are configured to point to the official CosmoSecure GitHub repository: `https://github.com/CosmoSecure/CosmoSecure/releases/latest`

### Features Page
The `/features` page now showcases the comprehensive features of the CosmoSecure desktop application including password management, security analytics, breach detection, and more.

### Customize Theme
Modify `app/globals.css` to adjust colors, fonts, and design tokens to match your brand.

## License

All rights reserved © 2025 CosmoSecure
