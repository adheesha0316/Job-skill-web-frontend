// CourseManager.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CardActions,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Alert,
  Fade,
  CardMedia,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOder";

const CourseManager = ({ trainerId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }
    fetchCourses();
  }, [trainerId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/course/by-trainer/${trainerId}`
      );
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Not authorized. Please log in.", "error");
        return;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        status: formData.status,
        trainerId,
      };

      console.log("Sending payload:", payload);

      if (editingCourse) {
        await axiosInstance.put(`/course/update/${editingCourse.courseId}`, payload, {

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Success", "Course updated", "success");
      } else {
        await axiosInstance.post("/course/add", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        Swal.fire("Success", "Course added", "success");
      }

      setOpenModal(false);
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        duration: "",
        status: "ACTIVE",
      });
      fetchCourses();
    } catch (err) {
      console.error("API error:", err.response || err.message || err);
      Swal.fire("Error", "Failed to save course", "error");
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Delete Course?",
      html: `Are you sure you want to delete <strong>"${title}"</strong>?<br><small>This action cannot be undone.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#1976d2",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "animated fadeInDown faster",
      },
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/course/delete/${id}`);

        await Swal.fire({
          title: "Deleted!",
          text: "Course has been removed successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "animated fadeInUp faster",
          },
        });

        setCourses((prev) => prev.filter((c) => c.courseId !== id));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the course. Please try again.",
          icon: "error",
          confirmButtonColor: "#1976d2",
        });
      }
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: "100%" }}>
            <Skeleton variant="rectangular" width="100%" height={140} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Your Courses
        </Typography>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Your Courses
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchCourses} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <BookIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Course Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Manage and organize your training courses
              </Typography>
            </Box>
          </Box>

          {/* Create New Course Button */}
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              backgroundColor: "#ffffff20",
              color: "white",
              "&:hover": { backgroundColor: "#ffffff40" },
            }}
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                title: "",
                description: "",
                duration: "",
                status: "ACTIVE",
              });
              setOpenModal(true);
            }}
          >
            Create New Course
          </Button>
        </Box>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {courses.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Courses
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography
              variant="h3"
              color="success.main"
              sx={{ fontWeight: 700 }}
            >
              {courses.filter((c) => c.status?.toLowerCase() === "active")
                .length || courses.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Courses
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
              {courses.reduce(
                (acc, course) => acc + (course.enrollments || 0),
                0
              ) || "0"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Enrollments
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
          <BookIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Courses Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start creating your first course to engage with students
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Fade in={true} timeout={300 + index * 100} key={course.courseId}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                >
                  {/* Course Image/Header */}
                  <CardMedia
                    sx={{
                      height: 120,
                      background: `linear-gradient(45deg, 
                        ${
                          [
                            "#FF6B6B",
                            "#4ECDC4",
                            "#45B7D1",
                            "#96CEB4",
                            "#FFEAA7",
                            "#DDA0DD",
                          ][index % 6]
                        } 0%, 
                        ${
                          [
                            "#FF8E8E",
                            "#6ED5D0",
                            "#67C5E5",
                            "#A8D5BA",
                            "#FFE69C",
                            "#E6B3E6",
                          ][index % 6]
                        } 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <BookIcon
                      sx={{ fontSize: 40, color: "white", opacity: 0.9 }}
                    />
                    {course.status && (
                      <Chip
                        label={course.status}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    )}
                  </CardMedia>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "60px",
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Duration: {course.duration}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      size="small"
                      sx={{ flex: 1, borderRadius: 1.5 }}
                      onClick={() => {
                        setEditingCourse(course);
                        setFormData({
                          title: course.title,
                          description: course.description,
                          duration: course.duration,
                          status: course.status,
                        });
                        setOpenModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(course.courseId, course.title)
                      }
                      sx={{
                        border: "1px solid",
                        borderColor: "error.main",
                        borderRadius: 1.5,
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "white",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            </Fade>
          ))}
        </Grid>
      )}

      {/* Add/Edit Course Dialog */}
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCourse(null);
          setFormData({
            title: "",
            description: "",
            duration: "",
            status: "ACTIVE",
          });
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingCourse ? "Edit Course" : "Add New Course"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            label="Duration"
            fullWidth
            margin="normal"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
          <TextField
            label="Status"
            select
            fullWidth
            margin="normal"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="PENDING_REVIEW">Pending Review</MenuItem>
            <MenuItem value="UPCOMING">Upcoming</MenuItem>
            <MenuItem value="FULL">Full</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="ON_HOLD">On Hold</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
            <MenuItem value="DRAFT">Draft</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setEditingCourse(null);
              setFormData({
                title: "",
                description: "",
                duration: "",
                status: "ACTIVE",
              });
            }}
            color="error"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
          >
            {editingCourse ? "Update Course" : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManager;
