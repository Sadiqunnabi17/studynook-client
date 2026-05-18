import { SessionProvider } from "./SessionProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "StudyNook – Find Your Perfect Study Room",
  description: "Browse and book quiet, private study rooms in your library.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}