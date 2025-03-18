import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    
    // Calculate subtotal
    const total = savedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, []);

  // Update subtotal whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cart]);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch storage event to update other components/tabs
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Item removed from cart');
  };

  const formatImageUrl = (imageUrl) => {
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

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch storage event to update other components/tabs
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Dispatch storage event to update other components/tabs
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Cart cleared');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Clear Cart
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            to="/" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="border-b last:border-b-0 p-4 flex">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={item.imageUrl ? formatImageUrl(item.imageUrl) : "/default-image.jpg"}  
                      alt={item.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-2">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <span className="ml-auto font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
              </div>
              
              <button 
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <Link 
                to="/" 
                className="block text-center mt-4 text-green-600 hover:text-green-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;