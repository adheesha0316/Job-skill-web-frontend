import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
  Divider,
  Stack,
  Rating,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
} from "@mui/material";
import {
  Email,
  Verified,
  WorkOutline,
  SchoolOutlined,
  CategoryOutlined,
  MessageOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder"; 

const TrainerProfileCard = ({ trainer }) => {
  const [imageError, setImageError] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [trainerData, setTrainerData] = useState(null);
  const [formData, setFormData] = useState({
    qualification: "",
    experience: "",
    contactNumber: "",
    courseCategory: "",
    profileImage: null,
  });

  // When trainer prop changes, update local state + form data
  useEffect(() => {
    if (trainer) {
      setTrainerData(trainer);
      setImageError(false); // Reset error if trainer changes
      setFormData({
        qualification: trainer.qualification || "",
        experience: trainer.experience || "",
        contactNumber: trainer.contactNumber || "",
        courseCategory: trainer.courseCategory || "",
        profileImage: null,
      });
    }
  }, [trainer]);

  // Open Edit Modal and prepare form
  const handleOpenEdit = () => {
    setOpenEditModal(true);
  };

  // Close modal
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File input change handler
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name = "") => {
    const names = name.trim().split(" ");
    return names
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Submit updated data
  const handleSubmit = async () => {
    if (!trainerData) return;

    const form = new FormData();
    form.append("qualification", formData.qualification);
    form.append("experience", formData.experience);
    form.append("contactNumber", formData.contactNumber);
    form.append("courseCategory", formData.courseCategory);
    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axiosInstance.put(
        `/trainer/profile/update/${trainerData.trainerId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire("Success", "Trainer profile updated successfully!", "success");

      // Update local trainer data with returned updated data (if any)
      setTrainerData(response.data);
      setOpenEditModal(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update trainer profile", "error");
    }
  };

  // Other handlers (contact, view details) same as before
  const handleContact = () => {
    Swal.fire({
      title: "Contact Trainer",
      html: `
      <div style="text-align: left;">
        <p><strong>Name:</strong> ${trainerData?.userName || "N/A"}</p>
        <p><strong>Email:</strong> ${trainerData?.email || "N/A"}</p>

        <p><strong>Specialization:</strong> ${
          trainer.courseCategory || "N/A"
        }</p>
        <p><strong>Contact Number:</strong> ${
          trainer.contactNumber || "N/A"
        }</p>
      </div>
    `,

      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Send Email",
      cancelButtonText: "Close",
      confirmButtonColor: "#1976d2",
      customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `mailto:${trainer.user?.email}?subject=Inquiry about ${trainer.courseCategory} Training`;
      }
    });
  };

  const handleViewDetails = () => {
    Swal.fire({
      title: `${trainer.user?.userName}'s Profile`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1976d2; margin-bottom: 5px;">📚 Qualification</h4>
            <p style="margin: 0; padding-left: 10px;">${trainer.qualification}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1976d2; margin-bottom: 5px;">🎯 Category</h4>
            <p style="margin: 0; padding-left: 10px;">${trainer.courseCategory}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1976d2; margin-bottom: 5px;">💼 Experience</h4>
            <p style="margin: 0; padding-left: 10px;">${trainer.experience}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1976d2; margin-bottom: 5px;">📧 Contact</h4>
            <p style="margin: 0; padding-left: 10px;">${trainer.user?.email}</p>
          </div>
        </div>
      `,
      width: 500,
      confirmButtonText: "Close",
      confirmButtonColor: "#1976d2",
      customClass: {
        popup: "swal-custom-popup",
      },
    });
  };

  return (
    <>
      <Card
        elevation={4}
        sx={{
          p: 0,
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
          border: "1px solid rgba(25, 118, 210, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(25, 118, 210, 0.15)",
            "& .trainer-avatar": {
              transform: "scale(1.05)",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)",
            backgroundSize: "200% 100%",
            animation: "gradient 3s ease infinite",
          },
          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        {/* Header Section */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={trainerData?.profileImage}
                onError={handleImageError}
                className="trainer-avatar"
                sx={{
                  width: 90,
                  height: 90,
                  border: "4px solid #fff",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.2)",
                  transition: "transform 0.3s ease",
                  bgcolor: imageError ? "#90caf9" : "transparent",
                  color: imageError ? "#0d47a1" : "inherit",
                  fontWeight: 700,
                }}
              >
                {imageError && getInitials(trainerData?.user?.userName || "")}
              </Avatar>

              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid white",
                }}
              >
                <Verified sx={{ fontSize: 14, color: "white" }} />
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 0.5,
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {trainerData?.user?.userName}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Chip
                  icon={<Verified sx={{ fontSize: 16 }} />}
                  label="Verified Trainer"
                  color="primary"
                  size="small"
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </Stack>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Rating
                  value={4.5}
                  precision={0.5}
                  size="small"
                  readOnly
                  sx={{ "& .MuiRating-iconFilled": { color: "#ffa726" } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  4.5 (28 reviews)
                </Typography>
              </Box>
            </Box>

            <Tooltip title="More Info">
              <IconButton
                size="small"
                onClick={handleViewDetails}
                sx={{
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.2)" },
                }}
              >
                <InfoOutlined sx={{ color: "#1976d2" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Divider sx={{ mx: 2, opacity: 0.6 }} />

        {/* Content Section */}
        <CardContent sx={{ p: 3, pt: 2 }}>
          <Stack spacing={2}>
            {/* Info Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1.5 }}>
              {/* Qualification */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    height: 40,
                  }}
                >
                  <SchoolOutlined sx={{ color: "#1976d2", fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Qualification
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    noWrap
                    title={trainerData?.qualification}
                  >
                    {trainerData?.qualification}
                  </Typography>
                </Box>
              </Box>

              {/* Category */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    height: 40,
                  }}
                >
                  <CategoryOutlined sx={{ color: "#4caf50", fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Category
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    noWrap
                    title={trainerData?.courseCategory}
                  >
                    {trainerData?.courseCategory}
                  </Typography>
                </Box>
              </Box>

              {/* Experience */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 152, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    height: 40,
                  }}
                >
                  <WorkOutline sx={{ color: "#ff9800", fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Experience
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    noWrap
                    title={trainerData?.experience}
                  >
                    {trainerData?.experience}
                  </Typography>
                </Box>
              </Box>

              {/* Email */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(233, 30, 99, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    height: 40,
                  }}
                >
                  <Email sx={{ color: "#e91e63", fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    noWrap
                    title={trainerData?.user?.email}
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                    onClick={() =>
                      (window.location.href = `mailto:${trainerData?.user?.email}`)
                    }
                  >
                    {trainerData?.user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<MessageOutlined />}
              onClick={handleContact}
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1976d2)",
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Contact Trainer
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleOpenEdit}
              sx={{
                mt: 1,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              Edit Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Trainer Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Course Category"
              name="courseCategory"
              value={formData.courseCategory}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />

            <Box>
              <InputLabel>Profile Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: 8 }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEdit}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerProfileCard;
