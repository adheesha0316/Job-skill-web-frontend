import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
  Badge,
  Divider,
  Container,
  Paper,
  Skeleton,
  Fade,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  Button,
} from "@mui/material";
import {
  Business,
  Email,
  LocationOn,
  Phone,
  VerifiedUser,
  Edit,
  Share,
  Download,
  BusinessCenter,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOder";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 48px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.15)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const VerifiedBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: `1px solid ${theme.palette.success.main}`,
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
  },
  "& .MuiChip-icon": {
    fontSize: "1.1rem",
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease",
}));

const CompanyTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
  letterSpacing: "-0.5px",
}));

const LoadingSkeleton = () => (
  <StyledCard>
    <StyledCardContent>
      <Box display="flex" alignItems="center" gap={3} mb={3}>
        <Skeleton variant="circular" width={120} height={120} />
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ mt: 1, borderRadius: 2 }}
          />
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={150}
            height={32}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </StyledCardContent>
  </StyledCard>
);

const EmployerProfileCard = () => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const userId = localStorage.getItem("userId");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: "",
    contactNumber: "",
    address: "",
    profileImage: null,
  });

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setEditForm((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper function to get profile image URL
  const getProfileImageUrl = (path) => {
    if (!path) return undefined;
    return `http://localhost:8080/${path.replace(/^uploads\//, "")}`;
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: theme.palette.primary.main,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: theme.palette.error.main,
      confirmButtonText: "Try Again",
    });
  };

  const showInfoAlert = (title, text) => {
    Swal.fire({
      icon: "info",
      title,
      text,
      confirmButtonColor: theme.palette.info.main,
    });
  };

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        setLoading(true);

        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        const res = await axiosInstance.get(`/employer/byUserId/${userId}`);

        setEmployer(res.data);

        showSuccessAlert(
          "Profile Loaded",
          "Employer profile loaded successfully!"
        );
      } catch (err) {
        console.error("Failed to load employer", err.response || err);
        showErrorAlert(
          "Failed to Load Profile",
          "Unable to fetch employer profile. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEmployer();
    } else {
      setLoading(false);
      showErrorAlert(
        "Authentication Error",
        "User ID not found. Please log in again."
      );
    }
  }, [userId]);

  const handleSubmitUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("companyName", editForm.companyName);
    formData.append("contactNumber", editForm.contactNumber);
    formData.append("address", editForm.address);

    if (editForm.profileImage) {
      formData.append("profileImageFile", editForm.profileImage);
    }

    try {
      const res = await axiosInstance.put(
        `/employer/updateWithImage/${employer.employerId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEmployer(res.data);
      showSuccessAlert(
        "Profile Updated",
        "Employer profile updated successfully."
      );
      setOpenEditDialog(false);
    } catch (err) {
      console.error("Update failed", err.response || err);
      showErrorAlert("Update Failed", "Could not update employer profile.");
    }
  };

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${employer.companyName} - Employer Profile`,
          text: `Check out ${employer.companyName}'s employer profile`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccessAlert("Link Copied", "Profile link copied to clipboard!");
      }
    } catch (err) {
      showErrorAlert(
        "Share Failed",
        "Unable to share profile. Please try again."
      );
    }
  };

  const handleDownloadProfile = () => {
    showInfoAlert(
      "Download Profile",
      "Profile download functionality coming soon!"
    );
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (!employer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: alpha(theme.palette.error.main, 0.04),
            border: `1px dashed ${theme.palette.error.main}`,
            borderRadius: 2,
          }}
        >
          <BusinessCenter
            sx={{
              fontSize: 64,
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          />
          <Typography variant="h5" color="text.primary" gutterBottom>
            No Employer Profile Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Unable to find an employer profile for this user.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <StyledCard>
          <StyledCardContent>
            {/* Header Section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={3}
            >
              <Box display="flex" alignItems="center" gap={3} flex={1}>
                <VerifiedBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Tooltip title="Verified Employer">
                      <VerifiedUser />
                    </Tooltip>
                  }
                >
                  <ProfileAvatar
                    src={getProfileImageUrl(employer.profileImage)}
                    alt={`${employer.companyName} Logo`}
                  >
                    {!employer.profileImage && employer.companyName?.[0]}
                  </ProfileAvatar>
                </VerifiedBadge>

                <Box flex={1}>
                  <CompanyTitle variant="h4" gutterBottom>
                    {employer.companyName}
                  </CompanyTitle>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontFamily: "monospace",
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: "inline-block",
                      mb: 1,
                    }}
                  >
                    ID: {employer.employerId}
                  </Typography>

                  <Box>
                    <StyledChip
                      icon={<Business />}
                      label={employer.user?.userName || "N/A"}
                      variant="filled"
                      color="primary"
                      size="medium"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box display="flex" flexDirection="column" gap={1}>
                <Tooltip title="Edit Profile">
                  <ActionButton
                    size="small"
                    onClick={() => {
                      setEditForm({
                        companyName: employer.companyName,
                        contactNumber: employer.contactNumber,
                        address: employer.address,
                        profileImage: null,
                      });
                      setOpenEditDialog(true);
                    }}
                  >
                    <Edit fontSize="small" />
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Share Profile">
                  <ActionButton size="small" onClick={handleShareProfile}>
                    <Share fontSize="small" />
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Download Profile">
                  <ActionButton size="small" onClick={handleDownloadProfile}>
                    <Download fontSize="small" />
                  </ActionButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            {/* Contact Information */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Contact Information
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {employer.contactNumber && (
                <StyledChip
                  icon={<Phone />}
                  label={employer.contactNumber}
                  variant="outlined"
                  color="info"
                  clickable
                  onClick={() => window.open(`tel:${employer.contactNumber}`)}
                />
              )}

              {employer.user?.email && (
                <StyledChip
                  icon={<Email />}
                  label={employer.user.email}
                  variant="outlined"
                  color="success"
                  clickable
                  onClick={() => window.open(`mailto:${employer.user.email}`)}
                />
              )}

              {employer.address && (
                <StyledChip
                  icon={<LocationOn />}
                  label={employer.address}
                  variant="outlined"
                  color="warning"
                  clickable
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(
                        employer.address
                      )}`
                    )
                  }
                />
              )}
            </Box>

            {/* Additional Info Section */}
            {employer.description && (
              <>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  About Company
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  }}
                >
                  {employer.description}
                </Typography>
              </>
            )}
          </StyledCardContent>
        </StyledCard>
      </Fade>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Employer Profile</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Company Name"
            name="companyName"
            value={editForm.companyName}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={editForm.contactNumber}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={editForm.address}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            name="profileImage"
            onChange={handleEditChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployerProfileCard;
