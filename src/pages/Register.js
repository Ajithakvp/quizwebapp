import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/register.css";
import { useNavigate, Link } from "react-router-dom";


function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    let temp = {};

    if (!form.name.trim()) temp.name = "Full Name is required";

    if (!form.email.trim())
      temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    if (!form.password)
      temp.password = "Password is required";
    else if (form.password.length < 6)
      temp.password = "Minimum 6 characters required";

    if (form.password !== form.confirmPassword)
      temp.confirmPassword = "Passwords do not match";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setSuccess("");

      const res = await axios.post(
        "http://localhost/quizapi/register.php",
        form
      );

      if (res.data.status) {
        setSuccess("🎉 Registration Successful!");
        navigate("/");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">

        <h2 className="register-title">Create Your Account 🚀</h2>

        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group-custom">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="input-group-custom">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="input-group-custom">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="input-group-custom">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          <button className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;
