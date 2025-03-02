import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus, X, AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

// Create axios instance with auth
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add auth interceptor
api.interceptors.request.use(
  config => {
    // Get token from localStorage or your auth management
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle auth errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or trigger auth refresh
      console.log('Authentication error, redirecting to login...');
      // You might want to redirect here:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Modal Component for Add/Edit
const ProductModal = ({ isOpen, onClose, product, onSave, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
      });
    }
  }, [product, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
       
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {mode === "add" ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 shadow-lg p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle size={64} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-100 text-center mb-2">
          Confirm Deletion
        </h3>
        
        <p className="text-gray-300 text-center mb-6">
          Are you sure you want to delete <span className="font-semibold">{productName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
      ? 'bg-red-500' 
      : 'bg-blue-500';

  return (
    <motion.div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {type === 'success' && <div className="h-2 w-2 rounded-full bg-white"></div>}
      {type === 'error' && <AlertTriangle size={18} />}
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 hover:text-gray-200">
        <X size={18} />
      </button>
    </motion.div>
  );
};

// Products Table Component
const ProductsTable = ({ products, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(
      (product) => 
        product.name.toLowerCase().includes(term) || 
        product.category?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
    
    setFilteredProducts(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button 
                        className="text-indigo-400 hover:text-indigo-300 mr-4"
                        onClick={() => onEdit(product)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

// Main Products Page Component
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    topSelling: 0,
    lowStock: 0,
    totalRevenue: 0
  });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };
  
  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };
  
  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const lowStock = response.data.filter(p => p.quantity < 10).length;
      const revenue = response.data.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      
      setStats({
        totalProducts: total,
        topSelling: Math.floor(total * 0.1), // Assuming top 10% are top selling
        lowStock: lowStock,
        totalRevenue: revenue.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Add product handler
  const handleAddProduct = async (productData) => {
    try {
      await api.post('/products', productData);
      await fetchProducts();
      setIsAddModalOpen(false);
      showToast('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Failed to add product', 'error');
    }
  };
  
  // Edit product handler
  const handleEditProduct = async (productData) => {
    try {
      await api.put(`/products/${currentProduct._id}`, productData);
      await fetchProducts();
      setIsEditModalOpen(false);
      showToast('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product', 'error');
    }
  };
  
  // Delete product handler
  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${currentProduct._id}`);
      await fetchProducts();
      setIsDeleteModalOpen(false);
      showToast('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };
  
  // Open edit modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />
      
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard 
            name="Total Products" 
            icon={Package} 
            value={stats.totalProducts} 
            color="#6366F1" 
          />
          <StatCard 
            name="Top Selling" 
            icon={TrendingUp} 
            value={stats.topSelling} 
            color="#10B981" 
          />
          <StatCard 
            name="Low Stock" 
            icon={AlertTriangle} 
            value={stats.lowStock} 
            color="#F59E0B" 
          />
          <StatCard 
            name="Total Revenue" 
            icon={DollarSign} 
            value={`$${stats.totalRevenue}`} 
            color="#EF4444" 
          />
        </motion.div>
        
        {/* Add Product Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
        
        {/* Products Table */}
        <ProductsTable 
          products={products}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          loading={loading}
        />
        
        {/* Modals */}
        <ProductModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          mode="add"
        />
        
        <ProductModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={currentProduct}
          onSave={handleEditProduct}
          mode="edit"
        />
        
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteProduct}
          productName={currentProduct?.name}
        />
        
        {/* Toast Notification */}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </main>
    </div>
  );
};

export default ProductsPage;