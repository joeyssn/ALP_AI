function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold text-emerald-700">
          WasteSorter
        </h1>
        <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-4 py-1 rounded-full mb-4">
          AI Powered Waste Sorting
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 max-w-3xl leading-tight">
          Sort Your Garbage <span className="text-emerald-600">Smarter</span>,
          Save the Planet
        </h2>

        <p className="mt-6 text-gray-600 max-w-xl">
          Upload an image of your waste and let our AI classify it into
          organic, recyclable, or hazardous materials instantly.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
            Upload Waste
          </button>
          <button className="px-6 py-3 rounded-xl border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition">
            Learn More
          </button>
        </div>
      </main>

      {/* Features */}
      <section className="mt-24 px-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            📸 Image Detection
          </h3>
          <p className="text-gray-600 text-sm">
            Identify waste types instantly using AI-powered image recognition.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            ♻️ Smart Sorting
          </h3>
          <p className="text-gray-600 text-sm">
            Automatically classify waste into organic, recyclable, or hazardous.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            🌱 Eco Impact
          </h3>
          <p className="text-gray-600 text-sm">
            Reduce pollution and help build a cleaner, sustainable future.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Homepage