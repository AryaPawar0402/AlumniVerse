import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import "../pages/AuthPage.css";
import campusImg from "../assets/wce-campus.jpg";
import walchandLogo from "../assets/walchand-logo.png";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LdJxtsrAAAAAJqsqocP9g5vYiEVlV_m_SU7d7Le";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "STUDENT",
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const captchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => setCaptchaValue(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!captchaValue) {
      setError("Please verify that you are not a robot.");
      return;
    }

    try {
      if (isLogin) {
        const res = await login({
          email: formData.email,
          password: formData.password,
          captcha: captchaValue,
        });

        // ✅ Save token and role for later use
        if (res.token) {
          localStorage.setItem("token", res.token);
        }

        const userRole = res.role || res.user?.role || "STUDENT";
        localStorage.setItem("role", userRole);

        console.log("🔑 Login successful - Role:", userRole);
        console.log("🔄 Redirecting user...");

        // ✅ FIXED: Proper redirect for all roles
        if (userRole === "STUDENT" || userRole === "ROLE_STUDENT") {
          navigate("/student/dashboard");
        } else if (userRole === "ALUMNI" || userRole === "ROLE_ALUMNI") {
          navigate("/alumni/dashboard"); // ✅ FIXED: Direct to alumni dashboard
        } else if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else {
          console.warn("Unknown role, defaulting to student dashboard");
          navigate("/student/dashboard");
        }

        if (captchaRef.current) {
          captchaRef.current.reset();
          setCaptchaValue(null);
        }
      } else {
        const res = await register({
          ...formData,
          captcha: captchaValue,
        });
        setSuccess(res.message || "Registration successful, please login");
        setIsLogin(true);

        if (captchaRef.current) {
          captchaRef.current.reset();
          setCaptchaValue(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    if (captchaRef.current) {
      captchaRef.current.reset();
      setCaptchaValue(null);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${campusImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="auth-overlay">
        <div className="auth-card">
          <img src={walchandLogo} alt="Walchand Logo" className="auth-logo" />
          <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {!isLogin && (
              <>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="role-select"
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </>
            )}

            <div style={{ margin: "1rem 0" }} className="recaptcha-wrapper">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />
            </div>

            <button type="submit" className="auth-btn">
              {isLogin ? "Login" : "Register"}
            </button>

            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
              <span className="toggle-link" onClick={toggleForm}>
                {isLogin ? "Register here" : "Login here"}
              </span>
            </p>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;