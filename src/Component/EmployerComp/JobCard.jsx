import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Work,
  LocationOn,
  Schedule,
  AttachMoney,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  Business,
  CalendarToday,
  Person,
  Star,
  StarBorder,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import ImageIcon from "@mui/icons-material/Image";
import axiosInstance from "../../Service/axiosOrder";

const JobCard = ({
  job,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite = false,
  showApplicationCount = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    salary: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleMenuClose();

    const result = await Swal.fire({
      title: "Delete Job Posting?",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Job Title:</strong> ${job.title}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p style="color: #666; margin-top: 15px;">This action cannot be undone. All associated applications will also be affected.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await onDelete(job.jobId);
        Swal.fire({
          title: "Deleted!",
          text: "Job posting has been removed successfully",
          icon: "success",
          confirmButtonColor: "#4caf50",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete job posting. Please try again.",
          icon: "error",
          confirmButtonColor: "#f44336",
        });
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("jobType", formData.jobType);
      form.append("salary", formData.salary);

      if (logoFile) {
        form.append("logoFile", logoFile);
      }

      console.log("Sending form data for jobId:", selectedJob.jobId);
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }

      await axiosInstance.put(`/job/update/${selectedJob.jobId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          // remove content-type, let axios set it
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Job updated successfully!",
        icon: "success",
        confirmButtonColor: "#4caf50",
        timer: 2000,
        timerProgressBar: true,
      });

      setEditOpen(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Swal.fire({
        title: "Error!",
        text: "Failed to update job. Please try again.",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    }
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "success";
      case "part-time":
        return "info";
      case "contract":
        return "warning";
      case "freelance":
        return "secondary";
      case "internship":
        return "primary";
      default:
        return "default";
    }
  };

  const getJobTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return <Schedule fontSize="small" />;
      case "part-time":
        return <Schedule fontSize="small" />;
      case "contract":
        return <Business fontSize="small" />;
      case "freelance":
        return <Person fontSize="small" />;
      case "internship":
        return <Work fontSize="small" />;
      default:
        return <Work fontSize="small" />;
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently posted";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted yesterday";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Posted ${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      salary: job.salary,
    });
    setLogoFile(null);
    setEditOpen(true);
  };

  return (
    <Card
      elevation={isHovered ? 8 : 2}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        border: "1px solid",
        borderColor: isHovered ? "primary.main" : "divider",
        "&:hover": {
          "& .job-card-actions": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          height: 4,
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Show logo if present, else fallback avatar */}
            {job.logoPath ? (
              <Avatar
                src={
                  job.logoPath.startsWith("http")
                    ? job.logoPath
                    : `http://localhost:8080/${
                        job.logoPath.startsWith("logos/")
                          ? job.logoPath
                          : "logos/" + job.logoPath
                      }`
                }
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                variant="rounded"
              >
                <ImageIcon />
              </Avatar>
            ) : (
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Work />
              </Avatar>
            )}
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                color="text.primary"
                sx={{
                  mb: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {job.title}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {job.location}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            {onToggleFavorite && (
              <Tooltip
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <IconButton
                  onClick={() => onToggleFavorite(job.jobId)}
                  color={isFavorite ? "error" : "default"}
                  size="small"
                >
                  {isFavorite ? <Star /> : <StarBorder />}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="More options">
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{
                  opacity: isHovered ? 1 : 0.7,
                  transition: "opacity 0.2s",
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Job Details */}
        <Box mb={2}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {truncateText(job.description, 150)}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {job.location}
              </Typography>
            </Box>

            {job.salary && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <AttachMoney fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {job.salary}
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={job.jobType || "Full-time"}
              color={getJobTypeColor(job.jobType)}
              size="small"
              icon={getJobTypeIcon(job.jobType)}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={1}
          className="job-card-actions"
          sx={{
            opacity: { xs: 1, md: 0.8 },
            transform: { xs: "translateX(0)", md: "translateX(-10px)" },
            transition: "all 0.3s ease",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => onView && onView(job)}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              flex: 1,
            }}
          >
            View Details
          </Button>

          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => handleEdit(job)}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              flex: 1,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
              },
            }}
          >
            Edit
          </Button>

          <Tooltip title="Delete Job">
            <IconButton
              onClick={handleDelete}
              color="error"
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "error.main",
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Quick Stats Footer */}
        {(job.views || job.applicants) && (
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 1.5,
              backgroundColor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={3} justifyContent="center">
              {job.views && (
                <Box textAlign="center">
                  <Typography variant="h6" color="primary" fontWeight="600">
                    {job.views}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Views
                  </Typography>
                </Box>
              )}
              {job.applicants && (
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    color="success.main"
                    fontWeight="600"
                  >
                    {job.applicants}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Applicants
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
      </CardContent>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onView && onView(job);
          }}
        >
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit && onEdit(job);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Job</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Job</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Job Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Job Type"
              name="jobType"
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              fullWidth
            />
            <Button variant="outlined" component="label">
              Upload Logo
              <input
                type="file"
                hidden
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default JobCard;
