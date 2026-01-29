# Kitchen Magic 🍳

AI-powered recipe generator that turns your ingredients into delicious meal ideas!

## Features

- 📸 Scan ingredients with your camera
- ✍️ Manually add ingredients
- 🤖 AI-powered recipe generation
- 📱 Mobile-optimized for iOS
- ✨ Beautiful, playful interface

## Quick Start - Deploy to Netlify (Easiest!)

### Method 1: Drag & Drop (No coding required!)

1. **Download this project** as a ZIP file
2. **Extract** the ZIP file on your computer
3. **Install dependencies and build:**
   - Open Terminal (Mac) or Command Prompt (Windows)
   - Navigate to the project folder: `cd path/to/kitchen-magic`
   - Run: `npm install`
   - Run: `npm run build`
4. Go to [Netlify](https://www.netlify.com/)
5. Sign up for free (use GitHub, Google, or email)
6. Click "Add new site" → "Deploy manually"
7. **Drag the `build` folder** into the deploy zone
8. Done! Your app is live!

### Method 2: GitHub + Netlify (Automatic updates)

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository (click the "+" icon)
3. Upload all project files to your repository
4. Go to [Netlify](https://www.netlify.com/) and sign in
5. Click "Add new site" → "Import an existing project"
6. Choose "GitHub" and select your repository
7. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
8. Click "Deploy site"
9. Netlify will build and deploy your app automatically!

## Quick Start - Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up for free (use GitHub, GitLab, or Bitbucket)
3. Click "Add New" → "Project"
4. Import your GitHub repository (or upload files)
5. Vercel auto-detects React settings - just click "Deploy"
6. Done! Your app is live!

## Important: API Key Setup

⚠️ **The app needs an Anthropic API key to work!**

### Get Your API Key:

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up and navigate to "API Keys"
3. Create a new API key
4. Copy the key

### Add API Key to Netlify:

1. In Netlify, go to your site
2. Click "Site settings" → "Environment variables"
3. Add new variable:
   - **Key:** `REACT_APP_ANTHROPIC_API_KEY`
   - **Value:** Your API key
4. Redeploy your site

### Add API Key to Vercel:

1. In Vercel, go to your project
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - **Name:** `REACT_APP_ANTHROPIC_API_KEY`
   - **Value:** Your API key
4. Redeploy your project

### For Local Development:

1. Copy `.env.example` to `.env`
2. Add your API key to `.env`
3. Run `npm start`

**⚠️ Never share your API key publicly or commit it to Git!**

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Add to iPhone Home Screen

1. Open the deployed website in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Kitchen Magic"
5. Tap "Add"

Now it appears like a real app on your home screen!

## API Costs

Using Anthropic's Claude Sonnet 4:
- **Scanning ingredients:** ~$0.01-0.03 per scan
- **Generating recipes:** ~$0.005-0.01 per generation
- Very affordable for personal use!

## Tech Stack

- React 18
- Lucide React (icons)
- Anthropic Claude API
- Responsive design (mobile-first)

## Support

Having issues? Check:
1. Is your API key set correctly in environment variables?
2. Did you redeploy after adding the API key?
3. Is your API key valid and has available credits?

## License

This code is yours to use, modify, and commercialize! 

---

Built with ❤️ and AI
