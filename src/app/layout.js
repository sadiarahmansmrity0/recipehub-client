import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}