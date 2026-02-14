import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignup.css";

function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    locality: ""
  });

  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);

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

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill required fields");
      return;
    }

    try {
      const response = await fetch("https://get-help.onrender.com/signup-user", {
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
          navigate("/login-user");
        }, 1500);
      } else {
        setMessage(data.message || "Signup Failed");
      }

    } catch (error) {
      setMessage("Server Error");
    }
  };

  return (
    <div className="signup-container">

      {!registered ? (
        <div className="signup-card">
          <h2>Create Your Account</h2>
          <p className="subtitle">Join GetHelp and connect instantly</p>

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
              name="locality"
              placeholder="Locality"
              onChange={handleChange}
            />

            <button type="submit" className="signup-btn">
              Register Now
            </button>
          </form>

          {message && <p className="signup-message">{message}</p>}
        </div>
      ) : (
        <div className="success-card">
          <h2>🎉 Registration Successful!</h2>
          <p>Redirecting to login page...</p>
        </div>
      )}

    </div>
  );
}

export default UserSignup;
