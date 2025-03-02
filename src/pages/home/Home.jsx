import { Link } from "react-router-dom"
import { ArrowRight, Calendar, MapPin } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Traditional Silver Jewelry",
    price: 299,
    image: "",
  },
  {
    id: 2,
    name: "Pure Argan Oil",
    price: 49,
    image: "",
  },
  {
    id: 3,
    name: "Berber Rug",
    price: 599,
    image: "",
  },
]

const events = [
  {
    id: 1,
    title: "Gnawa Music Festival",
    date: "June 20-23, 2024",
    location: "Medina",
    image: "",
  },
  {
    id: 2,
    title: "Traditional Craft Fair",
    date: "July 15-17, 2024",
    location: "Port Area",
    image: "",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <img src="public/essaouira-port-in-morocco-shot-after-sunset-at-blue-hour-ruslan-kalnitsky.jpg" alt="Essaouira Medina" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Essaouira Differently</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Experience the magic of this coastal city through its culture, crafts, and vibrant music scene
          </p>
          <Link
            to="/explore"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition-colors"
          >
            Explore
          </Link>
        </div>
      </section>

      {/* Local Crafts Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">Local Crafts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="relative h-64">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <p className="text-blue-400 font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">Events & Gnawa Music</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{event.title}</h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/events" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

