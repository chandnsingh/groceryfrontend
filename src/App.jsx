import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import AdminPanel from "./pages/AdminPanel";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import MyOrder from "./pages/MyOrder";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import MobileBottomNav from "./components/MobileBottomNav";
import ScrollToTop from "./components/ScrollToTop";

import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndCondition";

import { CartProvider } from "./context/CartContext";
import AdminRoute from "./components/AdminRoutes";
import GuestRoute from "./components/GuestRoute";
import ProductPage from "./pages/ProductPage";

import OrderDetails from "./pages/OrderDetails";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen relative">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Breadcrumb />
          <CartDrawer />

          <main className="flex-grow">
            <Routes>
              {/* ✅ Pass setSearchTerm to Home to clear on mount if needed */}
              <Route
                path="/"
                element={
                  <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                }
              />
              <Route
                path="/category/:categoryName"
                element={
                  <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                }
              />

              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />

              {/* ✅ Guest only routes */}
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <AuthPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <GuestRoute>
                    <ForgotPassword />
                  </GuestRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <GuestRoute>
                    <ResetPassword />
                  </GuestRoute>
                }
              />

              <Route path="/my-orders" element={<MyOrder />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermsAndConditions />} />

              {/* ✅ Admin only route */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/order-details/:id" element={<OrderDetails />} />
            </Routes>
          </main>

          <MobileBottomNav />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
