import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://insta-aibio.vercel.app'), // TODO: Update with your actual domain
  title: {
    default: "Movie Reel Description Generator | Instagram AI Caption Creator",
    template: "%s | Movie Reel Generator"
  },
  description: "Create viral-worthy Instagram reel descriptions for movies in Arabic or English. Generate engaging captions with popular hashtags instantly using AI.",
  keywords: [
    "movie description generator",
    "instagram caption creator",
    "reel bio maker",
    "AI caption generator",
    "movie hashtags",
    "Arabic movie captions",
    "content creator tools",
    "social media automation"
  ],
  authors: [{ name: "Bio Generator Team" }],
  creator: "Bio Generator",
  publisher: "Bio Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Movie Reel Description Generator | Create Viral Captions Instantly",
    description: "Generates professional, engaging Instagram Reel descriptions for any movie in seconds. Supports Arabic & English with smart hashtag suggestions.",
    url: 'https://insta-aibio.vercel.app',
    siteName: 'Movie Reel Description Generator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Generate Viral Movie Reel Captions with AI",
    description: "Stop struggling with captions. Create perfect Instagram Reel descriptions for any movie in seconds.",
    creator: "@biogenerator", // Placeholder handle
  },
  alternates: {
    canonical: '/',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
