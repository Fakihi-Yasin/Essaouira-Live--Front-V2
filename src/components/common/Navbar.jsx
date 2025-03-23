import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, User } from "lucide-react";
import { requestseller } from "../util/service";
import toast from 'react-hot-toast'; 

export default function Navbar() {
  const { isLoggedIn, userRole, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in.");
        return;
      }
  
      await requestseller(token);
      toast.success("Seller request sent! Wait for admin approval.");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to request seller.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Listen for cart updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(storedCart);
    };

    // Initial load
    handleStorageChange();

    // Listen for storage changes across tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // If auth state is still loading, show minimal navbar or loading state
  if (isLoggedIn === null) {
    return (
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-sky-700">
                Essaouira Live
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <header className="bg-blue-900 text-white">
      <nav className="bg-zinc-300 shadow-md mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-sky-700">
                Essaouira Live
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {/* Rest of the existing navigation logic */}
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white px-4 py-2 bg-sky-700 rounded-md hover:bg-sky-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {/* Existing logged-in navigation */}
                  {(userRole === 'admin' || userRole === 'user' || userRole === 'seller') && (
                    <>
                      <Link to="/" className="text-black hover:text-sky-700 transition-colors">
                        Home
                      </Link>
                      <Link to="/about" className="text-black hover:text-sky-700 transition-colors">
                        About
                      </Link>
                      <Link
                        to="/cart"
                        className="relative text-black transition-colors"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/profile"
                        className="text-black hover:text-sky-700 transition-colors"
                      >
                        <User className="w-6 h-6" />
                      </Link>
                      {(userRole === 'admin' || userRole === 'seller') && (
                        <Link
                          to="/dashboard"
                          className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                        >
                          My Dashboard
                        </Link>
                      )}
                    </>
                  )}

                  {(userRole === 'user' || userRole === 'admin' || userRole === 'seller') && (
                    <>
                      {userRole === 'user' && (
                        <button
                          onClick={() => setShowModal(true)}
                          className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                        >
                          Become a Seller
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Cart Icon */}
              {isLoggedIn && (
                <>
                  <Link
                    to="/cart"
                    className="relative text-gray-300 hover:text-sky-700 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>

                  {/* Mobile Profile Icon */}
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-sky-700 transition-colors"
                  >
                    <User className="w-6 h-6" />
                  </Link>
                </>
              )}

              <button onClick={toggleMenu} className="text-gray-300 hover:text-sky-700">
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Rest of the existing mobile navigation logic */}
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-sky-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-300 hover:text-sky-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {/* Existing mobile navigation for logged-in users */}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-300 hover:text-sky-700 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    My Profile
                  </Link>

                  {(userRole === 'admin' || userRole === 'seller') && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-300 hover:text-sky-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}

                  {userRole === 'user' && (
                    <Link
                      to="/become-seller"
                      className="block px-3 py-2 text-gray-300 hover:text-sky-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a Seller
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-green-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Become a Seller?</h2>
            <p>Are you sure you want to request to become a seller?</p>
            <p className="text-sm mt-2">Please confirm your email: <strong>user@example.com</strong></p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleRequest}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}