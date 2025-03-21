import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('id');

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!paymentId) {
        setIsLoading(false);
        // No payment ID, assume success from redirect
        clearCart();
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:3000/payments/${paymentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }
        
        const paymentData = await response.json();
        setPaymentStatus(paymentData);
        
        // Clear cart if payment is successful
        if (paymentData.status === 'paid') {
          clearCart();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentStatus();
  }, [paymentId]);

  const clearCart = () => {
    localStorage.setItem('cart', JSON.stringify([]));
    // Remove pending order if it exists
    localStorage.removeItem('pendingOrder');
    
    // Dispatch storage event to update other components/tabs
    window.dispatchEvent(new Event('storage'));
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto my-16 text-center">
        <div className="animate-pulse text-gray-600">
          <p className="text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto my-16 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-green-600 hover:text-green-800 flex items-center justify-center">
            Return to Home <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-16 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
          {orderId && <span className="block mt-2">Order ID: {orderId}</span>}
        </p>
        
        <div className="flex flex-col gap-4 mt-8">
          <Link 
            to="/orders" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="text-green-600 hover:text-green-800 flex items-center justify-center"
          >
            Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;