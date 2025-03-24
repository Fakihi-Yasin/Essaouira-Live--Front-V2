import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import WebsiteLayout from "./layouts/WebsiteLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import ProductsPage from "./pages/dashboard/ProductsPage";
import UsersPage from "./pages/dashboard/UsersPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CatregoriesPage from "./pages/dashboard/CatregoriesPage";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/home/Home";
import CartPage from "./pages/home/Cart";
import ProfilePage from "./pages/home/Profile";
import CheckoutSuccess from './pages/home/CheckoutSuccess';
import NotFound  from "./pages/home/404";
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const AdminRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();
  
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route 
            path="users" 
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            } 
          />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="categories" element={<CatregoriesPage />} />
        </Route>
        
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;