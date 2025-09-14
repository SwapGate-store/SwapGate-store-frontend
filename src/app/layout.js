import { Geist, Geist_Mono, Pacifico, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { USDTProvider } from "@/context/USDTContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import StoreStatusBadge from "@/components/ui/StoreStatusBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "SwapGate - USDT/LKR Exchange",
  description: "Secure cryptocurrency exchange for USDT/LKR trading",
  icons: {
    icon: [
      { url: "/assets/logo.png" },
      { url: "/favicon.png" },
    ],
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logo.png" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${poppins.variable} antialiased font-poppins`}
      >
        <USDTProvider>
          <StoreSettingsProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
              {children}
              <StoreStatusBadge />
            </div>
          </StoreSettingsProvider>
        </USDTProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
