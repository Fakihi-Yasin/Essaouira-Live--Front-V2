import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({ user, isOpen, onClose, onConfirm }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Delete User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg mb-4 border border-red-800">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <h4 className="text-red-500 font-medium">Warning: This action cannot be undone</h4>
              <p className="text-gray-300 mt-2">
                Are you sure you want to delete this user? All the data associated with{" "}
                <span className="font-medium text-white">
                  {user.name} {user.lastname}
                </span>{" "}
                will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Delete User
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export {  DeleteConfirmationModal }