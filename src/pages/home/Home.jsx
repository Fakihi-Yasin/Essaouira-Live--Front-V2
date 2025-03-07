import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import { ArrowRight, Calendar, MapPin, ShoppingCart, Eye, X } from "lucide-react"
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on component mount and update cart count
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setCartCount(savedCart.length);
    
    // Log for debugging
    console.log("Initial cart load:", savedCart);
  }, []);

  // Listen for storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(storedCart);
      setCartCount(storedCart.length);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error('Please log in to view products');
          return;
        }

        const response = await axios.get('http://localhost:3000/products/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        
        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.error('Authentication failed. Please log in again.');
              break;
            case 403:
              toast.error('You do not have permission to view products.');
              break;
            case 404:
              toast.error('Products not found.');
              break;
            default:
              toast.error('Failed to load products');
          }
        } else if (error.request) {
          toast.error('No response received from server');
        } else {
          toast.error('Error setting up the request');
        }
      }
    };

    fetchProducts();
  }, []);

  // Function to get image URL from product image data
  const getImageUrl = (image) => {
    // If image is a full URL, return it
    if (image && (image.startsWith('http://') || image.startsWith('https://'))) {
      return image;
    }
    
    // If image is a path from your server, construct the complete URL
    if (image) {
      return `http://localhost:3000/uploads/${image}`;
    }
    
    // Return a placeholder if no image is available
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const handleAddToCart = (product) => {
    console.log("Attempting to add product:", product);
    console.log("Current cart:", cart);
    
    // Check if product is already in cart
    const isProductInCart = cart.some(item => item._id === product._id);
    console.log("Is product in cart?", isProductInCart);
    
    if (isProductInCart) {
      // If product exists, just show a message
      toast.error(`${product.name} is already in your cart!`, {
        icon: '🛒',
        duration: 2000,
      });
    } else {
      // If product is not in cart, add it with quantity 1
      const updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ];
      
      console.log("Updated cart:", updatedCart);
      
      // Update state and localStorage
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Update cart count
      setCartCount(updatedCart.length);
      
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        duration: 2000,
      });
      
      // Dispatch storage event to update other components/tabs
      window.dispatchEvent(new Event('storage'));
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // Product Modal Component
  const ProductModal = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;
    
    // Check if product is already in cart
    const isInCart = cart.some(item => item._id === product._id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="text-2xl text-blue-600 font-semibold mb-4">${product.price}</p>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
                  disabled={isInCart}
                >
                  <ShoppingCart className="mr-2" /> 
                  {isInCart ? "Already in Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Event data
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
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Add Toaster for notifications */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
      />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={closeProductModal} 
          onAddToCart={handleAddToCart} 
        />
      )}

      {/* Local Crafts Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">
            {products.length > 0 ? 'Local Crafts' : 'No Products Available'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative group"
              >
                <div className="relative h-64">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openProductModal(product)}
                        className="bg-white text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors mx-auto"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <p className="text-blue-400 font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          {products.length > 3 && (
            <div className="text-center mt-8">
              <Link 
                to="/products" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
              >
                See More Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;