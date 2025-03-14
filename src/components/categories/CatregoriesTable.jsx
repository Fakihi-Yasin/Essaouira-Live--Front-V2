import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, AlertTriangle, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = 'http://localhost:3000';

const categoryService = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Category fetch error:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },
  
  createCategory: async (name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, { name });
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
  },
  
  updateCategory: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${id}`, { name: data.name });
      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
};
  
  const CreateCategoryModal = ({ isOpen, onClose, onCreate }) => {
	const [name, setName] = useState("");
  
	const handleSubmit = (e) => {
	  e.preventDefault();
	  if (name.trim()) {
		onCreate(name);
		setName("");
	  }
	};
  
	if (!isOpen) return null;
  
	return (
	  <motion.div
		className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	  >
		<motion.div
		  className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
		  initial={{ scale: 0.9, opacity: 0 }}
		  animate={{ scale: 1, opacity: 1 }}
		  exit={{ scale: 0.9, opacity: 0 }}
		>
		  <h2 className="text-xl font-bold mb-4 text-white">Create New Category</h2>
		  <form onSubmit={handleSubmit}>
			<div className="mb-4">
			  <label className="block text-gray-300 mb-2">Category Name</label>
			  <input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Enter category name"
				required
			  />
			</div>
			<div className="flex justify-end space-x-2">
			  <button
				type="button"
				onClick={onClose}
				className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
			  >
				Cancel
			  </button>
			  <button
				type="submit"
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
			  >
				Create
			  </button>
			</div>
		  </form>
		</motion.div>
	  </motion.div>
	);
  };
  
  const UpdateCategoryModal = ({ category, isOpen, onClose, onUpdate }) => {
	const [name, setName] = useState(category?.name || "");
  
	useEffect(() => {
	  if (category) {
		setName(category.name);
	  }
	}, [category]);
  
	const handleSubmit = (e) => {
	  e.preventDefault();
	  if (name.trim()) {
		onUpdate({ ...category, name });
	  }
	};
  
	if (!isOpen) return null;
  
	return (
	  <motion.div
		className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	  >
		<motion.div
		  className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
		  initial={{ scale: 0.9, opacity: 0 }}
		  animate={{ scale: 1, opacity: 1 }}
		  exit={{ scale: 0.9, opacity: 0 }}
		>
		  <h2 className="text-xl font-bold mb-4 text-white">Update Category</h2>
		  <form onSubmit={handleSubmit}>
			<div className="mb-4">
			  <label className="block text-gray-300 mb-2">Category Name</label>
			  <input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder="Enter category name"
				required
			  />
			</div>
			<div className="flex justify-end space-x-2">
			  <button
				type="button"
				onClick={onClose}
				className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
			  >
				Cancel
			  </button>
			  <button
				type="submit"
				className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
			  >
				Update
			  </button>
			</div>
		  </form>
		</motion.div>
	  </motion.div>
	);
  };
  
  const DeleteConfirmationModal = ({ category, isOpen, onClose, onConfirm }) => {
	if (!isOpen) return null;
  
	return (
	  <motion.div
		className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	  >
		<motion.div
		  className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
		  initial={{ scale: 0.9, opacity: 0 }}
		  animate={{ scale: 1, opacity: 1 }}
		  exit={{ scale: 0.9, opacity: 0 }}
		>
		  <h2 className="text-xl font-bold mb-4 text-white">Delete Category</h2>
		  <p className="text-gray-300 mb-6">
			Are you sure you want to delete the category "{category?.name}"? This action cannot be undone.
		  </p>
		  <div className="flex justify-end space-x-2">
			<button
			  onClick={onClose}
			  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
			>
			  Cancel
			</button>
			<button
			  onClick={() => onConfirm(category._id)}
			  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
			>
			  Delete
			</button>
		  </div>
		</motion.div>
	  </motion.div>
	);
  };
  
  // Main Categories Table Componen
  

  

// Main Categories Table Component
const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
	if (categories && Array.isArray(categories) && categories.length) {
	  const filtered = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase())
	  );
	  setFilteredCategories(filtered);
	} else {
	  setFilteredCategories([]);
	}
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
	setIsLoading(true);
	try {
	  const data = await categoryService.getCategories();
	  const categoriesArray = Array.isArray(data.categories) ? data.categories : 
							 Array.isArray(data) ? data : [];
	  setCategories(categoriesArray);
	  setFilteredCategories(categoriesArray);
	  setError(null);
	} catch (err) {
	  setError("Failed to load categories. Please try again later.");
	  toast.error("Failed to load categories");
	} finally {
	  setIsLoading(false);
	}
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleCategoryCreate = async (name) => {
    try {
      const newCategory = await categoryService.createCategory(name);
      setCategories([...categories, newCategory]);
      setCreateModalOpen(false);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  const handleCategoryUpdate = async (updatedCategory) => {
    try {
      await categoryService.updateCategory(updatedCategory._id, updatedCategory);
      setCategories(categories.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat));
      setUpdateModalOpen(false);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat._id !== categoryId));
      setDeleteModalOpen(false);
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Categories</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              <Plus size={18} className="mr-1" /> Add Category
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <motion.tr key={category._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex">
                        <button onClick={() => handleEditClick(category)} className="text-indigo-400 hover:text-indigo-300 mr-4 flex items-center">
                          <Edit size={16} className="mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDeleteClick(category)} className="text-red-400 hover:text-red-300 flex items-center">
                          <Trash2 size={16} className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-400">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {createModalOpen && (
          <CreateCategoryModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreate={handleCategoryCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {updateModalOpen && selectedCategory && (
          <UpdateCategoryModal
            category={selectedCategory}
			isOpen={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            onUpdate={handleCategoryUpdate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && selectedCategory && (
          <DeleteConfirmationModal
            category={selectedCategory}
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleCategoryDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoriesTable;			