# 🎬 Movie Reel Description Generator

A beautiful, bilingual Instagram reel description generator for movies. Create engaging content in **Arabic** or **English** with popular hashtags instantly!

## ✨ Features

- 🌍 **Bilingual Support**: Switch seamlessly between English and Arabic
- 🎯 **Smart Descriptions**: Pre-loaded descriptions for popular movies (Inception, Interstellar, The Dark Knight, Oppenheimer, Avatar)
- 🏷️ **Popular Hashtags**: Automatically generates 15 relevant Instagram hashtags
- 📋 **One-Click Copy**: Copy description and hashtags to clipboard instantly
- 🎨 **Premium Design**: Stunning dark theme with gradient effects and smooth animations
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast & Smooth**: Built with Next.js 16 and React 19

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd bio-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Use

1. **Select Language**: Choose between English or Arabic using the language toggle
2. **Enter Movie Name**: Type the name of the movie (e.g., "Inception", "Interstellar")
3. **Generate**: Click the "Generate Description" button
4. **Copy**: Use the "Copy to Clipboard" button to copy the description and hashtags
5. **Paste**: Paste directly into your Instagram reel caption!

## 🎬 Supported Movies

The app has pre-written descriptions for these popular movies:

- **Inception** (بداية)
- **Interstellar** (بين النجوم)
- **The Dark Knight** (فارس الظلام)
- **Oppenheimer** (أوبنهايمر)
- **Avatar** (أفاتار)

For any other movie, it will generate a generic but engaging description with relevant hashtags.

## 🎨 Design Features

- **Glassmorphism**: Modern glass-effect cards with backdrop blur
- **Gradient Backgrounds**: Animated radial gradients with purple, pink, and cyan colors
- **Smooth Animations**: Fade-in and slide-in effects for all elements
- **Custom Scrollbar**: Styled scrollbar matching the app theme
- **RTL Support**: Full right-to-left layout support for Arabic
- **Google Fonts**: Uses Inter for English and Tajawal for Arabic

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Language**: TypeScript
- **Fonts**: Google Fonts (Inter, Tajawal)

## 📝 Customization

### Adding More Movies

Edit `app/page.tsx` and add entries to the `movieDatabase` object:

```typescript
const movieDatabase = {
  'your-movie': {
    en: {
      description: 'Your English description...',
      hashtags: ['#YourMovie', '#Cinema', ...]
    },
    ar: {
      description: 'وصفك بالعربية...',
      hashtags: ['#فيلمك', '#سينما', ...]
    }
  }
};
```

### Changing Colors

Edit `app/globals.css` to modify the color scheme:

```css
:root {
  --primary: #8b5cf6;      /* Purple */
  --secondary: #ec4899;     /* Pink */
  --accent: #06b6d4;        /* Cyan */
}
```

## 📱 Screenshots

The app features:
- A stunning gradient background with animated effects
- Large, bold title with gradient text
- Clean language toggle with active state highlighting
- Glassmorphic input card with smooth transitions
- Generated descriptions with hashtag pills
- Responsive design that works on mobile and desktop

## 🌟 Perfect For

- 📱 Instagram content creators
- 🎬 Movie reviewers and critics
- 🎥 Film enthusiasts
- 📺 Social media managers
- 🎭 Entertainment bloggers

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Made with ❤️ for Content Creators** ✨
