# HyPrism Website

Simple landing page for the HyPrism launcher.

## Features

- Download buttons for Windows, macOS, and Linux
- Automatic download count from GitHub Releases API
- GitHub repo link
- Bug report button
- Responsive design

## Setup

1. Create a new GitHub repository (e.g., `HyPrism-Website` or `hyprism.github.io`)
2. Push this code to the repository
3. Enable GitHub Pages in repository Settings → Pages → Source: main branch
4. Add your assets:
   - `assets/logo.png` - HyPrism logo (64x64 or larger)
   - `assets/favicon.png` - Favicon (32x32)
   - `assets/og-image.png` - Open Graph image for social sharing (1200x630)

## How Download Counts Work

The website uses the GitHub Releases API to:
- Fetch all releases from the HyPrism repository
- Count total downloads across all release assets
- Display the sum on the website

This is automatic - every time someone downloads from GitHub Releases, the count updates!

## Custom Domain (Optional)

To use a custom domain like `hyprism.dev`:
1. Buy the domain from a registrar
2. Add a `CNAME` file with your domain name
3. Configure DNS to point to GitHub Pages

## License

MIT
