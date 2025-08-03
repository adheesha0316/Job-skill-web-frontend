// JobSeekerRegisterForm.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  Paper,
  Container,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import {
  Person,
  Phone,
  Work,
  CloudUpload,
  Delete,
  CheckCircle,
  PhotoCamera,
  Description,
  PersonAdd,
  Visibility,
  Edit,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOder";

const JobSeekerRegisterForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    experience: "",
    resume: null,
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Contact number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = "Please enter a valid number of years";
    }

    // Resume validation
    if (!formData.resume) {
      newErrors.resume = "Resume file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      
      if (name === "resume") {
        // Validate resume file
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          Swal.fire({
            icon: "warning",
            title: "Invalid File Type",
            text: "Please select a PDF or Word document for your resume.",
            confirmButtonColor: "#1976d2",
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "warning",
            title: "File Too Large",
            text: "Resume file must be smaller than 5MB.",
            confirmButtonColor: "#1976d2",
          });
          return;
        }
      }

      if (name === "profileImage") {
        // Validate image file
        if (!file.type.startsWith('image/')) {
          Swal.fire({
            icon: "warning",
            title: "Invalid File Type",
            text: "Please select a valid image file.",
            confirmButtonColor: "#1976d2",
          });
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          Swal.fire({
            icon: "warning",
            title: "File Too Large",
            text: "Image file must be smaller than 2MB.",
            confirmButtonColor: "#1976d2",
          });
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      }

      setFormData({ ...formData, [name]: file });
      // Clear error for this field
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      // Clear error for this field
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  const removeFile = (fieldName) => {
    setFormData({ ...formData, [fieldName]: null });
    if (fieldName === "profileImage") {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors below and try again.",
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Registration",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Contact Number:</strong> ${formData.contactNumber}</p>
          <p><strong>Experience:</strong> ${formData.experience} years</p>
          <p><strong>Resume:</strong> ${formData.resume?.name || 'Not selected'}</p>
          <p><strong>Profile Image:</strong> ${formData.profileImage?.name || 'Not selected'}</p>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Are you sure you want to register with this information?
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Register!",
      cancelButtonText: "Cancel",
      width: 500,
    });

    if (result.isConfirmed) {
      setLoading(true);
      
      const data = new FormData();
      data.append("contactNumber", formData.contactNumber);
      data.append("experience", formData.experience);
      data.append("resumeFile", formData.resume);
      data.append("profileImageFile", formData.profileImage);
      data.append("userId", userId);

      try {
        const res = await axiosInstance.post("/seeker/register", data);
        
        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          html: `
            <div style="text-align: center; margin: 20px 0;">
              <p>Your job seeker profile has been created successfully!</p>
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                You can now start applying for jobs and enrolling in courses.
              </p>
            </div>
          `,
          confirmButtonColor: "#1976d2",
          timer: 4000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        
        onSuccess();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
        
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: errorMessage,
          confirmButtonColor: "#1976d2",
          footer: '<p style="color: #666; font-size: 12px;">If the problem persists, please contact support.</p>',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getExperienceLevel = (years) => {
    const exp = parseInt(years);
    if (isNaN(exp) || exp < 0) return { level: "", color: "default" };
    if (exp === 0) return { level: "Fresh Graduate", color: "success" };
    if (exp <= 2) return { level: "Junior Level", color: "info" };
    if (exp <= 5) return { level: "Mid Level", color: "warning" };
    return { level: "Senior Level", color: "error" };
  };

  const experienceLevel = getExperienceLevel(formData.experience);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 4,
              textAlign: "center",
            }}
          >
            <PersonAdd sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Register as Job Seeker
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Complete your profile to start your job search journey
            </Typography>
          </Box>

          {/* Loading Progress */}
          {loading && (
            <LinearProgress 
              sx={{ 
                height: 3,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                }
              }} 
            />
          )}

          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Profile Image Section */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  Profile Picture
                </Typography>
                <Box display="flex" alignItems="center" gap={3}>
                  <Avatar
                    src={previewImage}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.100",
                      border: "3px dashed",
                      borderColor: previewImage ? "success.main" : "primary.300",
                    }}
                  >
                    {!previewImage && <PhotoCamera sx={{ fontSize: 40, color: "primary.main" }} />}
                  </Avatar>
                  
                  <Box flexGrow={1}>
                    {!formData.profileImage ? (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          borderStyle: "dashed",
                          borderWidth: 2,
                          "&:hover": {
                            borderStyle: "dashed",
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        Upload Profile Image
                        <input
                          type="file"
                          name="profileImage"
                          hidden
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </Button>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: "success.50",
                          border: "1px solid",
                          borderColor: "success.200",
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircle color="success" />
                            <Typography variant="body2" color="success.dark">
                              {formData.profileImage.name}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeFile("profileImage")}
                            sx={{ color: "error.main" }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Paper>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      Recommended: Square image, max 2MB (JPG, PNG)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Personal Information */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  Contact Information
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    name="contactNumber"
                    label="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Professional Information */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  Professional Information
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <TextField
                      name="experience"
                      label="Years of Experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      fullWidth
                      error={!!errors.experience}
                      helperText={errors.experience || "Enter 0 if you're a fresh graduate"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="primary" />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, max: 50 }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    {formData.experience && experienceLevel.level && (
                      <Box mt={1}>
                        <Chip
                          label={experienceLevel.level}
                          color={experienceLevel.color}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Resume Upload */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  Resume
                </Typography>
                {!formData.resume ? (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Description />}
                    fullWidth
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderStyle: "dashed",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    Upload Resume (PDF, DOC, DOCX)
                    <input
                      type="file"
                      name="resume"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                    />
                  </Button>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      bgcolor: "success.50",
                      border: "2px solid",
                      borderColor: "success.200",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <CheckCircle color="success" sx={{ fontSize: 28 }} />
                        <Box>
                          <Typography variant="body1" fontWeight="bold" color="success.dark">
                            Resume Uploaded
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formData.resume.name}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        onClick={() => removeFile("resume")}
                        sx={{ 
                          color: "error.main",
                          bgcolor: "error.50",
                          "&:hover": { bgcolor: "error.100" }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Paper>
                )}
                {errors.resume && (
                  <FormHelperText error sx={{ mt: 1, fontSize: "0.875rem" }}>
                    {errors.resume}
                  </FormHelperText>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Supported formats: PDF, DOC, DOCX (max 5MB)
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? null : <PersonAdd />}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  background: loading 
                    ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                    : "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  "&:hover": {
                    background: loading
                      ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                      : "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
                    transform: loading ? "none" : "translateY(-2px)",
                    boxShadow: loading ? "none" : "0 6px 20px rgba(102,126,234,0.4)",
                  },
                }}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>

      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal2-popup {
          border-radius: 16px !important;
        }
        .swal2-title {
          color: #1976d2 !important;
          font-weight: bold !important;
        }
        .swal2-html-container {
          color: #333 !important;
          line-height: 1.6 !important;
        }
        .swal2-confirm, .swal2-cancel {
          border-radius: 8px !important;
          font-weight: bold !important;
          padding: 12px 24px !important;
        }
      `}</style>
    </Container>
  );
};

export default JobSeekerRegisterForm;