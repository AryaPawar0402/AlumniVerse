import api from "../config/api";

// Get logged-in student's profile
export const getProfile = async () => {
  try {
    console.log("🔄 profileService: Fetching profile...");
    const res = await api.get("/student/profile");
    console.log("✅ profileService: Profile fetched successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ profileService: Error fetching profile", error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (data) => {
  try {
    console.log("🔄 profileService: Updating profile...", data);
    const res = await api.put("/student/profile", data);
    console.log("✅ profileService: Profile updated successfully", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ profileService: Error updating profile", error);
    throw error;
  }
};
