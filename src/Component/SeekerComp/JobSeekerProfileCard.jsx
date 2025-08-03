import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Chip,
  IconButton,
  Paper,
  Divider,
  Button,
  Fade,
  Tooltip,
  Badge,
  useTheme,
  alpha,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Person,
  Phone,
  Work,
  Description,
  Download,
  Edit,
  Verified,
  Email,
  LocationOn,
  CalendarToday,
  School,
  Star,
  TrendingUp,
  AccountCircle,
  Badge as BadgeIcon,
  Close,
  CloudUpload,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder"; // Adjust the path as necessary
// Assuming axiosInstance is defined elsewhere and imported,
// or you'll need to define it or import axios.
// For example:
// import axios from 'axios';
// const axiosInstance = axios.create({ baseURL: 'http://localhost:8080' });

const JobSeekerProfileCard = ({ seeker }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    contactNumber: "",
    experience: "",
    resumeFile: null,
    profileImageFile: null,
  });

  // Handler for all form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    if (editModalOpen && seeker) {
      setFormData({
        contactNumber: seeker.contactNumber || "",
        experience: seeker.experience?.toString() || "",
        resumeFile: null, // Always null when opening the modal, to re-upload if needed
        profileImageFile: null, // Always null when opening the modal, to re-upload if needed
      });
    }
  }, [editModalOpen, seeker]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleResumeDownload = async () => {
    if (!seeker.resumePath) {
      Swal.fire({
        icon: "info",
        title: "No Resume Available",
        text: "No resume file has been uploaded yet.",
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Download Resume",
        text: `Download resume for ${seeker.name || "this job seeker"}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#1976d2",
        cancelButtonColor: "#d33",
        confirmButtonText: "Download",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Resume download started",
        });

        // Actual download implementation
        window.open(
          `http://localhost:8080/resumes/${seeker.resumePath}`,
          "_blank"
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Unable to download resume. Please try again later.",
        confirmButtonColor: "#1976d2",
      });
    }
  };

  const handleEditProfile = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    // Reset form fields to their initial state or seeker's current data
    setFormData({
      contactNumber: seeker.contactNumber || "",
      experience: seeker.experience?.toString() || "",
      resumeFile: null,
      profileImageFile: null,
    });
  };

  const handleProfileUpdate = async () => {
    const dataToSend = new FormData();
    dataToSend.append("contactNumber", formData.contactNumber);
    dataToSend.append("experience", formData.experience);
    if (formData.resumeFile)
      dataToSend.append("resumeFile", formData.resumeFile);
    if (formData.profileImageFile)
      dataToSend.append("profileImageFile", formData.profileImageFile);

    try {
      // Make sure axiosInstance is imported and configured correctly
      // For demonstration, assuming it's available.
      const response = await axiosInstance.put(
        `/seeker/update/${seeker.seekerId}`,
        dataToSend
      );

      await Swal.fire({
        title: "Updated!",
        text: "Your profile was updated successfully",
        icon: "success",
        confirmButtonColor: "#4caf50", // Optional: Adds a nice green button
        timer: 3000, // Optional: Auto-closes after 3 seconds
        timerProgressBar: true, // Optional: Shows a progress bar for the timer
        showConfirmButton: false, // Optional: Hides the "OK" button
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // Close modal and reload profile data
      setEditModalOpen(false);
      window.location.reload(); // Or call a parent function to refresh seeker
    } catch (error) {
      console.error(error);
      await Swal.fire({
      title: "Error",
      text: "Failed to update profile",
      icon: "error",
      confirmButtonText: "OK",
    });
    }
  };

  const getInitials = (name) => {
    if (!name) return "JS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatExperience = (experience) => {
    if (!experience) return "Not specified";
    const years = parseInt(experience);
    if (isNaN(years)) return experience;
    return years === 1 ? "1 year" : `${years} years`;
  };

  const getExperienceLevel = (experience) => {
    const years = parseInt(experience);
    if (isNaN(years))
      return { level: "Unknown", color: "default", icon: Person };
    if (years === 0)
      return { level: "Fresh Graduate", color: "success", icon: Star };
    if (years <= 2) return { level: "Junior", color: "info", icon: TrendingUp };
    if (years <= 5) return { level: "Mid-Level", color: "warning", icon: Work };
    return { level: "Senior", color: "error", icon: Verified };
  };

  const experienceLevel = getExperienceLevel(seeker.experience);

  // Information items based on JobSeekerDto
  const informationItems = [
    {
      field: seeker.seekerId,
      label: "Seeker ID",
      value: `#${seeker.seekerId}`,
      icon: BadgeIcon,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
      show: seeker.seekerId,
    },
    {
      field: seeker.contactNumber,
      label: "Contact Number",
      value: seeker.contactNumber,
      icon: Phone,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      show: seeker.contactNumber,
    },
    {
      field: seeker.experience,
      label: "Experience",
      value: formatExperience(seeker.experience),
      icon: Work,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
      show: seeker.experience !== undefined && seeker.experience !== null,
    },
    {
      field: seeker.userId,
      label: "User ID",
      value: `User #${seeker.userId}`,
      icon: AccountCircle,
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
      show: seeker.userId,
    },
  ].filter((item) => item.show);

  return (
    <>
      <Fade in={true} timeout={600}>
        <Card
          sx={{
            maxWidth: 650,
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            },
          }}
        >
          {/* Enhanced Header Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 4,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.8) 0%, rgba(118,75,162,0.8) 100%)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 2,
              }}
            >
              <Tooltip title="Edit Profile" arrow>
                <IconButton
                  onClick={handleEditProfile}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.25)",
                      transform: "rotate(15deg) scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Box>

            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Badge
                badgeContent={<Verified sx={{ fontSize: 18 }} />}
                color="success"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: alpha(theme.palette.success.main, 0.9),
                    border: "2px solid white",
                  },
                }}
              >
                <Avatar
                  src={
                    !imageError && seeker.profileImage
                      ? seeker.profileImage.startsWith("http")
                        ? seeker.profileImage
                        : `http://localhost:8080/${
                            seeker.profileImage.startsWith("profiles/")
                              ? seeker.profileImage
                              : "profiles/" + seeker.profileImage
                          }`
                      : undefined
                  }
                  onError={handleImageError}
                  sx={{
                    width: 140,
                    height: 140,
                    fontSize: "3rem",
                    fontWeight: "bold",
                    bgcolor: "rgba(255,255,255,0.15)",
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {getInitials(seeker.name)}
                </Avatar>
              </Badge>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {seeker.name || "Job Seeker"}
                </Typography>

                {seeker.title && (
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.95,
                      mb: 3,
                      fontWeight: 500,
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    {seeker.title}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={React.createElement(experienceLevel.icon, {
                      sx: { fontSize: 18 },
                    })}
                    label={experienceLevel.level}
                    size="medium"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                    }}
                  />
                  {seeker.status && (
                    <Chip
                      label={seeker.status}
                      size="medium"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: "bold",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Enhanced Information Section */}
            {informationItems.length > 0 && (
              <Box sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Person sx={{ fontSize: 28 }} />
                  Profile Information
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 3,
                  }}
                >
                  {informationItems.map((item, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: alpha(item.color, 0.2),
                        bgcolor: item.bgColor,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 25px ${alpha(item.color, 0.15)}`,
                          borderColor: alpha(item.color, 0.3),
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(item.color, 0.1),
                            border: `1px solid ${alpha(item.color, 0.2)}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {React.createElement(item.icon, {
                            sx: { fontSize: 24, color: item.color },
                          })}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha(theme.palette.text.primary, 0.7),
                              fontWeight: 500,
                              mb: 0.5,
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: theme.palette.text.primary,
                              wordBreak: "break-word",
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            {/* Enhanced Resume Section */}
            {seeker.resumePath && (
              <>
                <Divider sx={{ mx: 4 }} />
                <Box sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Description sx={{ fontSize: 28 }} />
                    Resume Document
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Box display="flex" alignItems="center" gap={3}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Description
                            sx={{
                              fontSize: 32,
                              color: theme.palette.primary.main,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mb: 0.5 }}
                          >
                            Resume Document
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha(theme.palette.text.primary, 0.7),
                              wordBreak: "break-all",
                            }}
                          >
                            {seeker.resumePath}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Download />}
                        onClick={handleResumeDownload}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 4,
                          py: 1.5,
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 8px 20px ${alpha(
                              theme.palette.primary.main,
                              0.4
                            )}`,
                          },
                        }}
                      >
                        Download
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              </>
            )}

            {/* No Information Available Message */}
            {informationItems.length === 0 && !seeker.resumePath && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Person
                  sx={{
                    fontSize: 64,
                    color: alpha(theme.palette.text.primary, 0.3),
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary">
                  No additional information available
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Complete your profile to show more details
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Edit Profile Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Edit sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Edit Profile
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.25)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 4,
            pt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Text Fields Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: 2,
              gap: 3,
              width: "100%",
              maxWidth: "600px",
              mb: 4,
            }}
          >
            <TextField
              label="Contact Number"
              name="contactNumber" // Add name attribute
              value={formData.contactNumber}
              onChange={handleChange} // Use the unified handleChange
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
              }}
            />

            <TextField
              label="Experience (years)"
              name="experience" // Add name attribute
              value={formData.experience}
              onChange={handleChange} // Use the unified handleChange
              fullWidth
              variant="outlined"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
              }}
            />
          </Box>

          {/* Upload Sections */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              width: "100%",
              maxWidth: "600px",
              alignItems: "stretch",
              justifyContent: "center",
              mb: 4,
            }}
          >
            {/* Resume Upload */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, textAlign: "center" }}
              >
                Resume Document
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 180,
                }}
              >
                <CloudUpload
                  sx={{
                    fontSize: 28,
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                />
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Upload PDF, DOC, or DOCX
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<CloudUpload />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    mb: 1,
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    name="resumeFile" // Add name attribute
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange} // Use the unified handleChange
                    hidden
                  />
                </Button>
                {formData.resumeFile && (
                  <Typography variant="caption" color="primary" display="block">
                    {formData.resumeFile.name}
                  </Typography>
                )}
              </Paper>
            </Box>

            {/* Profile Image Upload */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, textAlign: "center" }}
              >
                Profile Image
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "2px dashed",
                  borderColor: alpha(theme.palette.secondary.main, 0.3),
                  bgcolor: alpha(theme.palette.secondary.main, 0.05),
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 180,
                }}
              >
                <AccountCircle
                  sx={{
                    fontSize: 28,
                    color: theme.palette.secondary.main,
                    mb: 1,
                  }}
                />
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Upload JPG, PNG, or GIF
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<CloudUpload />}
                  color="secondary"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    mb: 1,
                  }}
                >
                  Choose Image
                  <input
                    type="file"
                    name="profileImageFile" // Add name attribute
                    accept="image/*"
                    onChange={handleChange} // Use the unified handleChange
                    hidden
                  />
                </Button>
                {formData.profileImageFile && (
                  <Typography
                    variant="caption"
                    color="secondary"
                    display="block"
                  >
                    {formData.profileImageFile.name}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 4,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 4,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobSeekerProfileCard;
