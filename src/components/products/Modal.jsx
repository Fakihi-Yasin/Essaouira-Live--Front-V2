import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

const ProductModal = ({ isOpen, setIsOpen, product, fetchProducts }) => {
	const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "" });

	useEffect(() => {
		if (product) setFormData(product);
	}, [product]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (product) {
				await axios.put(`http://localhost:3000/products/${product.id}`, formData);
			} else {
				await axios.post("http://localhost:3000/products", formData);
			}
			setIsOpen(false);
			fetchProducts();
		} catch (error) {
			console.error("Error saving product:", error);
		}
	};

	if (!isOpen) return null;
	return (
		<motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<form className="bg-gray-800 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
				<h2 className="text-lg text-white">{product ? "Edit Product" : "Add Product"}</h2>
				<input className="w-full bg-gray-700 p-2 mt-2 rounded" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
				<input className="w-full bg-gray-700 p-2 mt-2 rounded" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
				<button type="submit" className="w-full bg-blue-500 mt-4 py-2 text-white rounded">Save</button>
			</form>
		</motion.div>
	);
};

export default ProductModal;
