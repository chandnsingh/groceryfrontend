import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const { syncTokenFromStorage } = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate("/", { replace: true });
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", form);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        syncTokenFromStorage();
        navigate(redirect, { replace: true });
      } else {
        await api.post("/auth/register", form);
        const loginRes = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
        localStorage.setItem("token", loginRes.data.token);
        syncTokenFromStorage();
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          (isLogin ? "Login failed" : "Signup failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg p-6 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "Log In" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {!isLogin && (
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />

        {/* 🔒 Password with Toggle */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-2 border rounded w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        {isLogin && (
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white py-2 rounded`}
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Signing up..."
            : isLogin
            ? "Log In"
            : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleMode} className="text-blue-500 underline">
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
