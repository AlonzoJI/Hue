<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Hue

An AI-powered app built with the Gemini API and deployed on Vercel.

## Live Demo

[hue.vercel.app](https://vercel.com/jared-alonzos-projects/hue)

## About

Hue is an AI Studio app powered by the Gemini API. Hue is a language learning app which grades your speech with daily challenges.

## Getting Started

**Prerequisites:** Node.js

1. Clone the repo
   ```bash
   git clone https://github.com/your-username/hue.git
   cd hue
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables — create a `.env.local` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Tech Stack

- **Framework:** Next.js
- **AI:** Google Gemini API
- **Deployment:** Vercel

## Deployment

To deploy your own instance, push the repo to GitHub, import it into [Vercel](https://vercel.com), and add `GEMINI_API_KEY` to your [environment variables](https://vercel.com/jared-alonzos-projects/hue/settings/environment-variables).

## License

MIT
