import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState('');
  
  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      const role = localStorage.getItem('userRole');
      
      setIsLoggedIn(loggedInStatus === 'true');
      setUserRole(role || '');
    };
    // Load auth state when component mounts
    loadAuthState();
    // Add event listener for storage changes (helps with multi-tab synchronization)
    window.addEventListener('storage', loadAuthState);
  
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', loadAuthState);
    };
  }, []);
  
  // Login function
  const login = (role) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role || 'user');
    setIsLoggedIn(true);
    setUserRole(role || 'user');
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
  };
  
  // Value to be provided to consumers
  const value = {
    isLoggedIn,
    userRole,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}