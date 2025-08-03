// TrainerRegisterForm.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Divider,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOder";

const TrainerRegisterForm = ({ onRegisterSuccess = () => {} }) => {
  const [form, setForm] = useState({
    qualification: "",
    contactNumber: "",
    experience: "",
    courseCategory: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Course categories for dropdown
  const courseCategories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "UI/UX Design",
    "Digital Marketing",
    "Project Management",
    "Software Testing",
    "DevOps",
    "Blockchain",
    "Other",
  ];

  const experienceLevels = [
    "0-1 years",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!form.qualification.trim()) newErrors.qualification = "Qualification is required";
    if (!form.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    else if (!/^\+?[\d\s-()]{10,}$/.test(form.contactNumber))
      newErrors.contactNumber = "Please enter a valid phone number";
    if (!form.experience) newErrors.experience = "Experience is required";
    if (!form.courseCategory) newErrors.courseCategory = "Course category is required";
    if (!form.profileImage) newErrors.profileImage = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, profileImage: null }));
    setImagePreview(null);
    if (errors.profileImage) setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "Image size should be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, profileImage: "Please select a valid image file" }));
        return;
      }
      setForm((prev) => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        icon: "warning",
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User not logged in");

      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      formData.append("userId", userId);

      const res = await axiosInstance.post("/trainer/profile/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        title: "Success!",
        html: `<div style="text-align: center;"><div style="font-size: 60px; margin-bottom: 20px;">🎉</div><h3>Welcome to our trainer community!</h3><p>Your registration has been submitted successfully.</p></div>`,
        icon: "success",
        confirmButtonColor: "#1976d2",
        confirmButtonText: "Continue",
        timer: 3000,
        timerProgressBar: true,
      });

      onRegisterSuccess(res.data);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const errorMessage = err?.response?.data?.message || (err.message === "User not logged in" ? "Please log in to continue registration." : "Failed to register trainer. Please try again.");
      Swal.fire({
        title: "Registration Failed",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            bgcolor: "rgba(255,255,255,0.2)",
          }}
        >
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Become a Trainer
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Join our community and share your expertise with students worldwide
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              {/* Profile Image Upload */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PhotoCameraIcon color="primary" />
                  Profile Picture
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {imagePreview ? (
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={imagePreview}
                        sx={{
                          width: 120,
                          height: 120,
                          border: "4px solid",
                          borderColor: "primary.light",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Avatar
                      sx={{ width: 120, height: 120, bgcolor: "grey.200" }}
                    >
                      <PhotoCameraIcon
                        sx={{ fontSize: 40, color: "grey.400" }}
                      />
                    </Avatar>
                  )}

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    {imagePreview ? "Change Picture" : "Upload Picture"}
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleChange}
                      hidden
                    />
                  </Button>

                  {errors.profileImage && (
                    <Alert severity="error" sx={{ width: "100%" }}>
                      {errors.profileImage}
                    </Alert>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    Upload a professional photo (Max 5MB, JPG/PNG)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <SchoolIcon color="primary" />
                  Professional Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="qualification"
                  label="Qualification"
                  placeholder="e.g., Master's in Computer Science, PhD in Data Science"
                  fullWidth
                  value={form.qualification}
                  onChange={handleChange}
                  error={!!errors.qualification}
                  helperText={
                    errors.qualification || "Enter your highest qualification"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.courseCategory}>
                  <InputLabel>Course Category</InputLabel>
                  <Select
                    name="courseCategory"
                    value={form.courseCategory}
                    label="Course Category"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {courseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Chip
                          label={category}
                          size="small"
                          variant="outlined"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.courseCategory && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, ml: 2 }}
                    >
                      {errors.courseCategory}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.experience}>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experience"
                    value={form.experience}
                    label="Experience Level"
                    onChange={handleChange}
                    sx={{ borderRadius: 2 }}
                    startAdornment={
                      <InputAdornment position="start">
                        <WorkIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {experienceLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.experience && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, ml: 2 }}
                    >
                      {errors.experience}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="+1 (555) 123-4567"
                  fullWidth
                  value={form.contactNumber}
                  onChange={handleChange}
                  error={!!errors.contactNumber}
                  helperText={
                    errors.contactNumber ||
                    "Include country code if international"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <InfoIcon color="info" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    All information will be verified before approval. Please
                    ensure accuracy.
                  </Typography>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ position: "relative" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      background:
                        "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                      },
                    }}
                  >
                    {loading
                      ? "Submitting Application..."
                      : "Submit Trainer Application"}
                  </Button>
                  {loading && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: "0 0 8px 8px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          What happens next?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "primary.light", mx: "auto", mb: 1 }}>
                1
              </Avatar>
              <Typography variant="subtitle2">Application Review</Typography>
              <Typography variant="body2" color="text.secondary">
                We'll review your application within 2-3 business days
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "primary.light", mx: "auto", mb: 1 }}>
                2
              </Avatar>
              <Typography variant="subtitle2">Verification</Typography>
              <Typography variant="body2" color="text.secondary">
                We may contact you for additional verification
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "primary.light", mx: "auto", mb: 1 }}>
                3
              </Avatar>
              <Typography variant="subtitle2">Welcome!</Typography>
              <Typography variant="body2" color="text.secondary">
                Start creating courses and teaching students
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TrainerRegisterForm;
