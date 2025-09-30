// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";


export const metadata = {
  title: "E-commerce Portfolio",
  description: "Dynamic coconut marketplace with AI recommendations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
