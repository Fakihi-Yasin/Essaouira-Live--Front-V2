import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-slate-200 text-black py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-700">Essaouira Live</h3>
          <p className="text-white-400">
            Discover the magic of Essaouira through its culture, crafts, and vibrant music scene.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-700">Contact</h3>
          <p className="text-white-400">Email: info@essaouiralive.com</p>
          <p className="text-white-400">Phone: +212 524 123 456</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-700">Legal</h3>
          <ul className="space-y-2 text-white-400">
            <li>
              <Link to="/privacy" className="hover:sky-700">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:sky-700">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white-700 text-center text-white-400">
        <p>&copy; {new Date().getFullYear()} Essaouira Live. All rights reserved.</p>
      </div>
    </footer>
  )
}

