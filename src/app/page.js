export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Banner Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to RecipeHub</h1>
        <p className="text-lg mb-6">Discover, share, and create your favorite culinary delights.</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100">
          Browse Recipes
        </button>
      </section>

      {/* Placeholder for Featured Recipes */}
      <section className="py-12 container mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold">Recipe Name</h3>
            <p className="text-gray-600">Category: Placeholder</p>
          </div>
          {/* Add more cards here later */}
        </div>
      </section>
    </main>
  );
}