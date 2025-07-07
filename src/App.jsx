import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import BlockOnHome from "./components/BlockHome";
import CartDrawer from "./components/CartDrawer";
import MobileBottomNav from "./components/MobileBottomNav";
import { CartProvider } from "./context/CartContext";

import AboutUs from "./pages/AboutUs";
import TermsAndConditions from "./pages/TermsAndCondition";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <CartProvider>
      <Router>
        <BlockOnHome />
        <ScrollToTop />

        <div className="flex flex-col min-h-screen relative">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Breadcrumb />
          <CartDrawer />

          {/* Main content area */}
          <main className="flex-grow ">
            {" "}
            {/* reserve bottom space for mobile nav */}
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm} />} />
              <Route
                path="/category/:categoryName"
                element={<Home searchTerm={searchTerm} />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route
                path="/admin"
                element={
                  user && user.isAdmin ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/my-orders" element={<MyOrder />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<TermsAndConditions />} />
            </Routes>
          </main>

          {/* Always visible on mobile at bottom */}
          <MobileBottomNav />

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
