import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
    // Check if Google Client ID exists
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables');
    }

    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <GoogleOAuthProvider clientId={googleClientId || ''}>
                    <AuthProvider>
                        <Navbar />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </AuthProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}