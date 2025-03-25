import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    totalProducts: 0,
    topSelling: 0,
    lowStock: 0,
    totalRevenue: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products/my-products");
      setProducts(response.data);

      // Calculate stats
      const total = response.data.length;
      const lowStock = response.data.filter((p) => p.quantity < 10).length;
      const revenue = response.data.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      setStats({
        totalProducts: total,
        topSelling: Math.floor(total * 0.1), 
        lowStock: lowStock,
        totalRevenue: revenue.toFixed(2),
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const addProduct = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post('/products', formData);
      setProducts([...products, response.data]);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product: " + (err.response?.data?.message || err.message));
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, formData) => {
    setLoading(true);
    try {
      const response = await api.put(`/products/${id}`, formData);
      setProducts(products.map(p => p._id === id ? response.data : p));
      await fetchProducts();
      return { success: true };
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product: " + (err.response?.data?.message || err.message));
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      await fetchProducts();
      return { success: true };
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const toggleProductDisplay = async (id, currentDisplay) => {
    setLoading(true);
    try {
      const response = await api.put(`/products/${id}`, {
        display: !currentDisplay
      });
      setProducts(products.map(p => p._id === id ? response.data : p));
      return { success: true };
    } catch (err) {
      console.error("Error toggling product display:", err);
      setError("Failed to update product visibility");
      return { 
        success: false, 
        error: err.response?.data?.message || err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const value = {
    products,
    loading,
    categories,
    error,
    stats,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductDisplay
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};