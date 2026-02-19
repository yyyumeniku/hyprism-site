# HyPrism Website

[![Live](https://img.shields.io/badge/Live-hyprism.vercel.app-207e5c?style=for-the-badge)](https://hyprism.vercel.app)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/yyyumeniku)

Landing page for HyPrism. A free and open source third party launcher for Hytale, the game by Hypixel Studios. We are not affiliated with them.

- **Repo:** [github.com/HyPrismTeam/HyPrism](https://github.com/HyPrismTeam/HyPrism)
- **Website source:** [github.com/HyPrismTeam/hyprism-site](https://github.com/HyPrismTeam/hyprism-site)

## Features

- Real-time download counter from GitHub Releases API.
- Direct download links for Windows, macOS, and Linux.
- Contributors showcase.
- Manrope font (self-hosted, regular and bold).
- Prism-inspired color theme.
- Particle canvas background with connected dots.
- 3D card tilt on hover.
- Mouse-tracking hero glow.
- Scroll progress bar.
- Wave section dividers.
- Parallax scrolling.
- Count-up animation for download numbers.
- AOS scroll animations.
- Mobile responsive design.
- Deployed on Vercel.

## Project Structure

```
├── assets/
│   ├── fonts/
│   │   ├── Manrope-Regular.ttf
│   │   └── Manrope-Bold.ttf
│   └── images/
│       ├── icon.png          # Favicon / logo
│       └── team_logo.png     # Hero title image
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── vercel.json
└── README.md
```

## Local Development

```bash
# Any static server works
npx serve .
# or
python3 -m http.server 8080
```

## Deployment

Hosted on [Vercel](https://vercel.com) at **hyprism.vercel.app**.

Push to `main` to auto-deploy (when connected to Vercel via GitHub).

## License

MIT
