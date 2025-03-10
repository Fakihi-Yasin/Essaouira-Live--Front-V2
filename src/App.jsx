import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import WebsiteLayout from "./layouts/WebsiteLayout";

// Dashboard pages
import OverviewPage from "./pages/dashboard/OverviewPage";
import ProductsPage from "./pages/dashboard/ProductsPage";
import UsersPage from "./pages/dashboard/UsersPage";
import SalesPage from "./pages/dashboard/SalesPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/home/Home";
import CartPage from "./pages/home/Cart";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Dashboard routes - no Navbar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Website routes - will include Navbar via WebsiteLayout */}
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;