import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser } from '@/lib/db/queries';
import { FeedbackButton } from '@/components/feedback-button';
import { cn } from '@/lib/utils';
// import { UserProvider } from '@/lib/auth/index'; 

export const metadata: Metadata = {
  title: 'CSV Pro | Instant CSV to JSON & SQL',
  description: 'The fastest way to clean, validate, and convert your CSV files to developer-friendly formats. Built for high-performance teams.',
  keywords: ['CSV Converter', 'JSON to CSV', 'SQL Export', 'Data Cleaning', 'SaaS'],
  authors: [{ name: 'CSV Pro Team' }],
  
  // --- Social Media Previews ---
  openGraph: {
    title: 'CSV Pro | Data Conversion at Light Speed',
    description: 'Transform millions of rows with AI-powered schema detection.',
    url: 'https://csvpro.com', // Update to your real domain
    siteName: 'CSV Pro',
    images: [
      {
        url: '/og-image.png', // Place a 1200x630 image in your /public folder
        width: 1200,
        height: 630,
        alt: 'CSV Pro Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSV Pro | Instant Data Transformation',
    description: 'Convert CSV to JSON & SQL in seconds with zero configuration.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e87d61', // Matches your Liquid Coral brand color
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-black antialiased",
        manrope.className
      )}
    >
      {/* Added selection color: when users highlight text, it turns your brand color.
          Changed bg-gray-50 to your signature soft wash [#fdf2f0]
      */}
      <body className="min-h-[100dvh] bg-[#fdf2f0] selection:bg-[#e87d61] selection:text-white">
        {/* <UserProvider userPromise={userPromise}> */}
          {children}
        {/* </UserProvider> */}
        
        <FeedbackButton />
      </body>
    </html>
  );
}