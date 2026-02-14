import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let temp = {};
    if (!form.email) temp.email = "Email is required";
    if (!form.password) temp.password = "Password is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost/quizapi/login.php", form);

      if (res.data.status) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">

          <img
            src="https://infovenz.com/wp-content/uploads/2020/08/Infovenz-Final-website.png"
            alt="Infovenz Logo"
            className="auth-logo"
          />

          <h3 className="auth-title">
           Quiz App Login
          </h3>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control-custom w-100"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="form-control-custom w-100"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              style={{ position: "absolute", right: 15, top: 14, cursor: "pointer" }}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="link-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
