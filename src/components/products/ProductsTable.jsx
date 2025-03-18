import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  DollarSign,
  Package,
  TrendingUp,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Tag
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import { useProducts, ProductProvider } from "../../context/ProductContext";


const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

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

// Modal Component for Add/Edit
const ProductModal = ({ isOpen, onClose, product, onSave, mode ,categories}) => {
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    image: null,
    display: true,
    category: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        display: product.display !== undefined ? product.display : true,
        image: null,
        category: product.category?._id || product.category || "",
      });

      // If there's an existing image URL, set it as preview
      if (product.imageUrl) {
        setImagePreview(formatImageUrl(product.imageUrl));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        display: true,
        image: null,
        category: "",
      });
      setImagePreview(null);
    }
  }, [product, mode]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      if (files && files.length > 0) {
        const file = files[0];

        // Update formData with the file
        setFormData(prev => ({
          ...prev,
          image: file
        }));

        // Create preview URL for image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "price" || name === "quantity" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price.toString());
    productFormData.append("quantity", formData.quantity.toString());
    productFormData.append("display", formData.display.toString());
    productFormData.append("category", formData.category);

    if (formData.image && formData.image instanceof File) {
      productFormData.append("image", formData.image);
    }

    onSave(productFormData);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        <form onSubmit={handleSubmit} className="p-6" encType="multipart/form-data">
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
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Image
              </label>

              {imagePreview ? (
                <div className="relative mb-3 border border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center mb-3 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-400">
                    Drop your image here, or click to browse
                  </p>
                </div>
              )}

              <input
                type="file"
                name="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
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

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) => {
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
          Are you sure you want to delete{" "}
          <span className="font-semibold">{productName}</span>? This action
          cannot be undone.
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

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <motion.div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      {type === "success" && (
        <div className="h-2 w-2 rounded-full bg-white"></div>
      )}
      {type === "error" && <AlertTriangle size={18} />}
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 hover:text-gray-200">
        <X size={18} />
      </button>
    </motion.div>
  );
};

const ProductsTable = ({ products, onEdit, onDelete, categories, onToggleDisplay, loading }) => {
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
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-400"
                  >
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
                      {categories && categories.length > 0
                        ? categories.find(cat => cat._id === product.category)?.name || "—"
                        : "—"}
                    </td>         
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.imageUrl ? (
                        <img
                          src={formatImageUrl(product.imageUrl)}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-700 flex items-center justify-center">
                          <ImageIcon size={18} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'in stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button
                        className={`${product.display
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-gray-500 hover:text-gray-400'
                          }`}
                        onClick={() => onToggleDisplay(product)}
                        title={product.display ? "Product is visible" : "Product is hidden"}
                      >
                        {product.display ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
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

// Main Products Page Component (using Context)
const ProductsPageContent = () => {
  const {
    products,
    categories,
    loading,
    error: contextError,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductDisplay
  } = useProducts();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Local error state
  const [error, setError] = useState("");

  // Set error from context
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Add product handler
  const handleAddProduct = async (formData) => {
    const result = await addProduct(formData);
    if (result.success) {
      setIsAddModalOpen(false);
      showToast("Product added successfully", "success");
    } else {
      showToast(result.error || "Failed to add product", "error");
    }
  };

  const handleEditProduct = async (formData) => {
    const result = await updateProduct(currentProduct._id, formData);
    if (result.success) {
      setIsEditModalOpen(false);
      showToast("Product updated successfully", "success");
    } else {
      showToast(result.error || "Failed to update product", "error");
    }
  };

  const handleDeleteProduct = async () => {
    const result = await deleteProduct(currentProduct._id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      showToast("Product deleted successfully");
    } else {
      showToast(result.error || "Failed to delete product", "error");
    }
  };

  const handleToggleDisplay = async (product) => {
    const result = await toggleProductDisplay(product._id, product.display);
    if (result.success) {
      showToast(`Product is now ${product.display ? 'hidden' : 'visible'}`);
    } else {
      showToast(result.error || "Failed to update visibility", "error");
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Error message display */}
        {error && (
          <div className="bg-red-500 text-white p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}

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

        <ProductsTable
          products={products}
          categories={categories}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onToggleDisplay={handleToggleDisplay}
          loading={loading}
        />

        <ProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          mode="add"
          categories={categories}
        />

        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={currentProduct}
          onSave={handleEditProduct}
          mode="edit"
          categories={categories}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteProduct}
          productName={currentProduct?.name}
        />

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
const ProductsPage = () => (
  <ProductProvider>
    <ProductsPageContent />
  </ProductProvider>
);

export default ProductsPage;