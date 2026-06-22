import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* This now sits above your page content everywhere */}
        {children}
      </body>
    </html>
  );
}