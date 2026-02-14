import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerLogin.css";

function WorkerLogin() {
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
      const response = await fetch("https://get-help.onrender.com/login-worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Save workerId (optional)
        localStorage.setItem("workerId", data.workerId);

        navigate("/worker-home");
      } else {
        setError(data.message || "Login Failed");
      }

    } catch (err) {
      setError("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="worker-login-container">
      <div className="worker-login-card">

        <h1 className="worker-login-heading">Worker Login</h1>
        <p className="worker-login-subtitle">
          Access your dashboard and manage availability
        </p>

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

          {error && <p className="worker-error">{error}</p>}

          <button type="submit" className="worker-login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="worker-back" onClick={() => navigate("/")}>
          ← Back to Home
        </p>

      </div>
    </div>
  );
}

export default WorkerLogin;
