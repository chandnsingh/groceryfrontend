import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("Sending Rest Link ....");
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset link sent to your email.");

      setTimeout(() => {
        console.log("Navigating to login..."); // ✅ Debug line
        navigate("/auth");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg p-6 rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 text-sm text-green-600">{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;
