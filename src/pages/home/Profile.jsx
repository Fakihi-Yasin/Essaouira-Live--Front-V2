import React, { useState } from 'react';

// UserProfile component that adapts based on user role
const UserProfile = ({ userData = {} }) => { // Add default empty object as fallback
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    bio: userData?.bio || '',
    // Additional fields depending on user type
    ...(userData?.role === 'seller' && {
      storeName: userData?.storeName || '',
      businessType: userData?.businessType || '',
      taxId: userData?.taxId || '',
    }),
    ...(userData?.role === 'admin' && {
      department: userData?.department || '',
      adminLevel: userData?.adminLevel || '',
    }),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send updated data to your API
    console.log('Submitting updated profile:', formData);
    // API call would go here - e.g., updateUserProfile(userData.id, formData)
    setIsEditing(false);
  };

  const renderCommonFields = () => (
    <>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        {isEditing ? (
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.name || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        {isEditing ? (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.email || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        {isEditing ? (
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.phone || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        {isEditing ? (
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
            rows="3"
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.address || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
        {isEditing ? (
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
            rows="3"
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.bio || 'N/A'}</p>
        )}
      </div>
    </>
  );

  const renderSellerFields = () => (
    <>
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium">Seller Information</h3>
      </div>

      <div className="mb-4">
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
        {isEditing ? (
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.storeName || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">Business Type</label>
        {isEditing ? (
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          >
            <option value="">Select business type</option>
            <option value="individual">Individual</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
          </select>
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.businessType || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID/EIN</label>
        {isEditing ? (
          <input
            type="text"
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          />
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.taxId || 'N/A'}</p>
        )}
      </div>
    </>
  );

  const renderAdminFields = () => (
    <>
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium">Admin Information</h3>
      </div>

      <div className="mb-4">
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
        {isEditing ? (
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          >
            <option value="">Select department</option>
            <option value="management">Management</option>
            <option value="support">Customer Support</option>
            <option value="technical">Technical</option>
            <option value="sales">Sales</option>
            <option value="finance">Finance</option>
          </select>
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.department || 'N/A'}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="adminLevel" className="block text-sm font-medium text-gray-700">Admin Level</label>
        {isEditing ? (
          <select
            id="adminLevel"
            name="adminLevel"
            value={formData.adminLevel}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            disabled={!isEditing}
          >
            <option value="">Select admin level</option>
            <option value="1">Level 1 - Junior</option>
            <option value="2">Level 2 - Standard</option>
            <option value="3">Level 3 - Senior</option>
            <option value="4">Level 4 - Super Admin</option>
          </select>
        ) : (
          <p className="mt-1 p-2 w-full">{userData?.adminLevel || 'N/A'}</p>
        )}
      </div>
    </>
  );

  // Additional section for user-specific stats
  const renderUserStats = () => (
    <>
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium">Account Statistics</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-xl font-bold">{userData?.stats?.orders || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Wishlisted Items</p>
          <p className="text-xl font-bold">{userData?.stats?.wishlist || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Reviews</p>
          <p className="text-xl font-bold">{userData?.stats?.reviews || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-md font-bold">{userData?.memberSince || 'N/A'}</p>
        </div>
      </div>
    </>
  );

  // Additional section for seller-specific stats
  const renderSellerStats = () => (
    <>
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-medium">Seller Statistics</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-xl font-bold">{userData?.sellerStats?.products || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Sales</p>
          <p className="text-xl font-bold">${userData?.sellerStats?.sales || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Avg. Rating</p>
          <p className="text-xl font-bold">{userData?.sellerStats?.avgRating || '0.0'} ⭐</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-500">Return Rate</p>
          <p className="text-xl font-bold">{userData?.sellerStats?.returnRate || '0'}%</p>
        </div>
      </div>
    </>
  );

  // Create a fallback if userData is not provided
  if (!userData) {
    return (
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-xl text-gray-500">User data not available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl overflow-hidden">
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.name || 'User'} className="h-full w-full object-cover" />
            ) : (
              (userData.name?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{userData.name || 'User'}</h2>
            <div className="flex items-center">
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                userData.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : userData.role === 'seller' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
              }`}>
                {userData.role ? (userData.role.charAt(0).toUpperCase() + userData.role.slice(1)) : 'User'}
              </span>
              {userData.role === 'seller' && userData.verified && (
                <span className="ml-2 inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  Verified Seller
                </span>
              )}
            </div>
          </div>
        </div>
        {(userData.role === 'admin' || userData.isSelf) && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded ${
              isEditing 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-blue-600 text-white'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {renderCommonFields()}
        
        {userData.role === 'seller' && renderSellerFields()}
        {userData.role === 'admin' && renderAdminFields()}
        
        {userData.role === 'user' && renderUserStats()}
        {userData.role === 'seller' && renderSellerStats()}

        {isEditing && (
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;