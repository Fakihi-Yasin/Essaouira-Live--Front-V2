import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import { ArrowRight, Calendar, MapPin, ShoppingCart, Eye, X, Search, Star, Menu, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const featuredArtisans = [
    {
      id: 1,
      name: "Mohammed",
      specialty: "Zellige",
      image: "/artisan1.jpg",
      description: "Maître artisan avec 30 ans d'expérience"
    },
    {
      id: 2,
      name: "Fatima",
      specialty: "Tapis",
      image: "/artisan2.jpg",
      description: "Spécialiste des motifs traditionnels"
    },
    {
      id: 3,
      name: "Hassan",
      specialty: "Poterie",
      image: "/artisan3.jpg",
      description: "Créateur de pièces uniques"
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      text: "La qualité des tapis est exceptionnelle. Un vrai savoir-faire artisanal!",
      rating: 5,
      image: "/testimonial1.jpg"
    },
    {
      id: 2,
      name: "John D.",
      text: "Des pièces de poterie magnifiques qui racontent l'histoire du Maroc.",
      rating: 5,
      image: "/testimonial2.jpg"
    },
    {
      id: 3,
      name: "Maria L.",
      text: "Les zelliges sont absolument superbes. Ils ont transformé ma maison!",
      rating: 5,
      image: "/testimonial3.jpg"
    }
  ];
  
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setCartCount(savedCart.length);

    console.log("Initial cart load:", savedCart);
  }, []);

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
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error('Please log in to view categories');
          return;
        }

        const response = await axios.get('http://localhost:3000/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);

        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.error('Authentication failed. Please log in again.');
              break;
            case 403:
              toast.error('You do not have permission to view categories.');
              break;
            case 404:
              toast.error('Categories not found.');
              break;
            default:
              toast.error('Failed to load categories');
          }
        } else if (error.request) {
          toast.error('No response received from server');
        } else {
          toast.error('Error setting up the request');
        }
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error('Please log in to view products');
          return;
        }

        // Determine which endpoint to use based on selectedCategory
        const endpoint = selectedCategory 
          ? `http://localhost:3000/products/category/${selectedCategory}`
          : 'http://localhost:3000/products/all';

        const response = await axios.get(endpoint, {
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
  }, [selectedCategory]); 
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  const formatImageUrl = (imageUrl) => {
    // Check if imageUrl is undefined or null
    if (!imageUrl) {
      return "/placeholder.svg";
    }
  
    // Check if it's already a complete URL
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
  
    // If it's a server path like 'uploads/filename.jpg'
    if (imageUrl.includes('uploads/')) {
      // Extract the filename from the path
      const filename = imageUrl.split('/').pop();
      return `http://localhost:3000/products/image/${filename}`;
    }
  
    // Fallback: return the original path
    return imageUrl;
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsCategoryMenuOpen(false);
  };

  // Reset category filter
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };


  const Header = () => (    
<div className="relative z-50">
  <div className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <button
        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <Menu className="w-5 h-5" />
        <span className="hidden sm:inline">Categories</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search for anything"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-700"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  </div>

  <AnimatePresence>
    {isCategoryMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 left-0 right-0 max-w-7xl mx-auto px-4 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto"
      >
        <div className="py-4">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsCategoryMenuOpen(false);
            }}
            className={`flex items-center gap-2 p-2 rounded w-full text-left ${!selectedCategory ? 'bg-green-100' : 'hover:bg-gray-100'}`}
          >
            <span>All Categories</span>
          </button>

          <div className="flex flex-col space-y-2 mt-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => {
                  setSelectedCategory(category._id);
                  setIsCategoryMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded w-full text-left ${selectedCategory === category._id ? 'bg-sky-100' : 'hover:bg-gray-100'}`}
              >
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

  );

 
  const ProductModal = ({ product, onClose, onAddToCart }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <img
            src={formatImageUrl(product.imageUrl) || "/placeholder.svg"}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-sky-700 mb-6">
              ${product.price}
            </p>
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full bg-sky-700 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      <Header />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <img src="/essaouira-port-in-morocco-shot-after-sunset-at-blue-hour-ruslan-kalnitsky.jpg" alt="Essaouira Medina" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Artisanat d'Essaouira
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl"
          >
            Découvrez l'authenticité des artisans locaux
          </motion.p>
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={clearCategoryFilter}
              className="bg-sky-500 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span>Voir tous les produits</span>
            </motion.button>
          )}
        </div>
      </section>

    {/* Categories Section */}
{/* <section className="py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Nos Catégories</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((category) => (
        <motion.div
          key={category._id}
          whileHover={{ y: -10 }}
          className="relative group cursor-pointer"
          onClick={() => setSelectedCategory(category._id)}
        >
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={formatImageUrl(category.imageUrl) || "/default-image.jpg"}
              alt={category.name}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                console.log("Error loading image:", category.imageUrl);
                e.target.onerror = null;
                e.target.src = "/default-image.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
              {category.name}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section> */}

{/* Products Section */}
<section className="py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">
      {selectedCategory 
        ? `Produits ${categories.find(c => c._id === selectedCategory)?.name || ''}` 
        : 'Tous nos Produits'}
    </h2>
    
    {/* Loading indicator */}
    {/* {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-700"></div>
      </div>) : filteredProducts.length === 0 ? ( */}
      <div className="text-center text-gray-500 py-12">
        {/* <p className="text-xl">Aucun produit trouvé</p> */}
      </div>
    {/* ) : ( */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ y: -10 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative h-64">
              <img
                src={formatImageUrl(product.imageUrl) }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
              >
                <Eye className="w-8 h-8 text-white" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sky-700 font-bold">${product.price}</p>
              <p className="text-sm text-gray-500 mt-1">
                {product.quantity > 0 ? 'En stock' : 'Rupture de stock'}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity <= 0}
                className={`mt-3 w-full py-2 rounded-lg ${
                  product.quantity > 0 
                    ? 'bg-sky-700 text-white hover:bg-sky-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajouter au panier
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    {/* )} */}
  </div>
</section>

{/* Featured Artisans Section */}
<section className="py-16 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Nos Artisans</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredArtisans.map((artisan) => (
        <motion.div
          key={artisan.id}
          whileHover={{ y: -10 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={artisan.image || "/placeholder.svg"}
            alt={artisan.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{artisan.name}</h3>
            <p className="text-sky-700 mb-2">{artisan.specialty}</p>
            <p className="text-gray-600">{artisan.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Section */}
<section className="py-16 px-4 bg-green-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Témoignages</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          whileHover={{ y: -10 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <img
              src={testimonial.image || "/placeholder.svg"}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-4"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            <div>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 italic">{testimonial.text}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Product Modal */}
<AnimatePresence>
  {selectedProduct && (
    <ProductModal
      product={selectedProduct}
      onClose={closeProductModal}
      onAddToCart={handleAddToCart}
    />
  )}
</AnimatePresence>
    </div>
  );
};

export default HomePage;