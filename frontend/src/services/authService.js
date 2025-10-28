import api from "../config/api";

// Register user
export const register = async (user) => {
  try {
    const response = await api.post("/auth/register", user);
    console.log("🔑 Register response:", response.data);
    return {
      message: response.data.message || "Registration successful",
    };
  } catch (error) {
    console.log("🚨 Register error:", error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    console.log("🔑 Full login response:", response);
    console.log("🔑 Login response data:", response.data);

    // Extract token from the response
    const token = response.data.token;
    console.log("🔑 Extracted token:", token);

    if (token) {
      localStorage.setItem("token", token);
      console.log("💾 Token saved to localStorage successfully");

      // Verify it was saved
      const savedToken = localStorage.getItem("token");
      console.log("✅ Token verified in localStorage:", savedToken ? "YES" : "NO");
      console.log("✅ Token length:", savedToken?.length);
    } else {
      console.log("❌ No token found in response!");
      console.log("❌ Available keys in response:", Object.keys(response.data));
    }

    return {
      token,
      role: response.data.role || "STUDENT",
      message: response.data.message || "Login successful",
    };
  } catch (error) {
    console.log("🚨 Login error:", error);
    throw error;
  }
};