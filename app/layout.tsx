import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Reel Description Generator | Instagram Reel Creator",
  description: "Create engaging Instagram reel descriptions for movies in Arabic or English with popular hashtags. Perfect for content creators and movie enthusiasts.",
  keywords: ["movie", "reel", "instagram", "description", "generator", "hashtags", "arabic", "english", "content creator"],
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
