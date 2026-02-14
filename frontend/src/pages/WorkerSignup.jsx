import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerSignup.css";

function WorkerSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    profession: "",
    locality: ""
  });

  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.profession) {
      setMessage("Please fill required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://get-help.onrender.com/signup-worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setRegistered(true);
        setMessage("Registration Successful!");

        setTimeout(() => {
          navigate("/login-worker");
        }, 1500);

      } else {
        setMessage(data.message || "Signup Failed");
      }

    } catch (err) {
      setMessage("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="worker-container">

      {!registered ? (
        <div className="worker-card">
          <h1 className="worker-heading">Worker Sign Up</h1>
          <p className="worker-subtitle">
            Join GetHelp and grow your local business
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

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

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
            />

            <input
              type="text"
              name="profession"
              placeholder="Profession (Plumber)"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="locality"
              placeholder="Locality"
              onChange={handleChange}
            />

            <button type="submit" className="worker-btn">
              {loading ? "Registering..." : "Register as Worker"}
            </button>

          </form>

          {message && <p className="worker-message">{message}</p>}
        </div>
      ) : (
        <div className="worker-success">
          <h2>✅ Registration Successful!</h2>
          <p>Redirecting to Worker Login...</p>
        </div>
      )}

    </div>
  );
}

export default WorkerSignup;
