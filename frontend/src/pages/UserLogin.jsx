import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

function UserLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://get-help.onrender.com/login-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        // Save userId in localStorage
        localStorage.setItem("userId", data.userId);

        navigate("/user-home");
      } else {
        setError(data.message || "Login failed");
      }

    } catch (err) {
      setError("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="back-link" onClick={() => navigate("/")}>
          ← Back to Home
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
