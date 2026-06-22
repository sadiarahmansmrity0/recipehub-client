export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">RecipeHub</h2>
          <p className="text-gray-400">Sharing the joy of cooking, one recipe at a time.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="text-gray-400 space-y-2">
            <li>Home</li>
            <li>Browse Recipes</li>
            <li>Dashboard</li>
          </ul>
        </div>
        {/* Add Social Links & Contact Info Here */}
      </div>
      <div className="text-center mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
        &copy; 2026 RecipeHub. All rights reserved.
      </div>
    </footer>
  );
}