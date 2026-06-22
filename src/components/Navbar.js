import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          RecipeHub
        </Link>

        {/* Links */}
        <div className="space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link href="/browse" className="text-gray-600 hover:text-blue-600 font-medium">
            Browse
          </Link>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}