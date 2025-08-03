import React, { useState } from "react";
import {
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  Paper,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Business,
  Phone,
  LocationOn,
  CloudUpload,
  PhotoCamera,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder"; // Adjust the path as necessary

const RegisterEmployerForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactNumber: "",
    address: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\+?[\d\s-()]{8,15}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "Please select an image smaller than 5MB",
          icon: "warning",
          confirmButtonColor: "#1976d2",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Invalid File Type",
          text: "Please select a valid image file",
          icon: "warning",
          confirmButtonColor: "#1976d2",
        });
        return;
      }

      setFormData({
        ...formData,
        [name]: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Clear field-specific error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      profileImage: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the errors and try again",
        icon: "error",
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      Swal.fire({
        title: "Authentication Error",
        text: "Please login again to continue",
        icon: "error",
        confirmButtonColor: "#1976d2",
      });
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("companyName", formData.companyName);
    form.append("contactNumber", formData.contactNumber);
    form.append("address", formData.address);
    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }
    form.append("userId", Number(userId));

    try {
      await axiosInstance.post("/employer/addWithImage", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        title: "Registration Successful!",
        text: "Welcome to our employer platform",
        icon: "success",
        confirmButtonColor: "#4caf50",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      console.error(err);

      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = "An employer account already exists for this user.";
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check your information.";
      }

      Swal.fire({
        title: "Registration Failed",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          mb: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Business sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Register as Employer
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Join our platform and start hiring top talent
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Company Logo Upload Section */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  fontWeight="600"
                >
                  Employer ProfileImage
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Avatar
                      src={imagePreview}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "primary.light",
                        border: "3px dashed",
                        borderColor: "primary.main",
                      }}
                    >
                      <Business sx={{ fontSize: 40 }} />
                    </Avatar>
                  </Box>

                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: 160,
                      }}
                    >
                      Upload profile image
                      <input
                        type="file"
                        hidden
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </Button>

                    {imagePreview && (
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<Close />}
                        onClick={handleRemoveImage}
                        sx={{ textTransform: "none" }}
                      >
                        Remove
                      </Button>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      JPG, PNG or GIF (max 5MB)
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Company Information Section */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  fontWeight="600"
                >
                  Company Information
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.contactNumber}
                    helperText={
                      errors.contactNumber ||
                      "Include country code for international numbers"
                    }
                    placeholder="+1 (555) 123-4567"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Company Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={
                      errors.address ||
                      "Include street, city, state, and postal code"
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                          <LocationOn color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Submit Button */}
              <Box pt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircle />
                    )
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    background:
                      "linear-gradient(45deg, #4caf50 30%, #45a049 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #45a049 30%, #4caf50 90%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(0, 0, 0, 0.12)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? "Creating Account..." : "Complete Registration"}
                </Button>
              </Box>

              {/* Info Alert */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Next Steps:</strong> After registration, you'll be
                  able to post job listings, review applications, and manage
                  your hiring process.
                </Typography>
              </Alert>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterEmployerForm;
