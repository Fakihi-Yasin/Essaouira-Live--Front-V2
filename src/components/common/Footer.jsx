import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-red">Essaouira Live</h3>
          <p className="text-gray-400">
            Discover the magic of Essaouira through its culture, crafts, and vibrant music scene.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-400">Contact</h3>
          <p className="text-gray-400">Email: info@essaouiralive.com</p>
          <p className="text-gray-400">Phone: +212 524 123 456</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-blue-400">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/privacy" className="hover:text-blue-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-400">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Essaouira Live. All rights reserved.</p>
      </div>
    </footer>
  )
}

