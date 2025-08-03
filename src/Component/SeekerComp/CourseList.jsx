// CourseList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Container,
  Fade,
  Paper,
  Divider,
} from "@mui/material";
import {
  School,
  Schedule,
  MenuBook, // Changed from BookOpen to MenuBook
  CheckCircle,
} from "@mui/icons-material";
import axiosInstance from "../../Service/axiosOder";
import Swal from "sweetalert2";

const CourseList = ({ seekerId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        setLoading(true);
        const [coursesResponse, enrolledIdsResponse] = await Promise.all([
          axiosInstance.get("/course/getAll"),
          axiosInstance.get(`/seeker/enrolled-course-ids/${seekerId}`), // backend endpoint
        ]);
        setCourses(coursesResponse.data);
        setEnrolledCourseIds(new Set(enrolledIdsResponse.data)); // Set for quick lookup
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Data",
          text: "Unable to fetch courses or enrollments. Please try again later.",
          confirmButtonColor: "#1976d2",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [seekerId]);

  const handleEnroll = async (courseId, courseTitle) => {
    // Show confirmation dialog with custom styling
    const result = await Swal.fire({
      title: "Confirm Enrollment",
      text: `Are you sure you want to enroll in "${courseTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Enroll!",
      cancelButtonText: "Cancel",
      background: "#fff",
      customClass: {
        popup: "swal-popup-custom",
        title: "swal-title-custom",
        content: "swal-content-custom",
      },
    });

    if (result.isConfirmed) {
      try {
        setEnrolling((prev) => ({ ...prev, [courseId]: true }));

        await axiosInstance.post(`/seeker/enroll/${seekerId}/${courseId}`);

        // Add the course to enrolled courses
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));

        // Success animation
        await Swal.fire({
          icon: "success",
          title: "Enrollment Successful!",
          text: `You have successfully enrolled in "${courseTitle}".`,
          confirmButtonColor: "#1976d2",
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      } catch (err) {
        // Error handling with detailed message
        const errorMessage =
          err.response?.data?.message || "Enrollment failed. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Enrollment Failed",
          text: errorMessage,
          confirmButtonColor: "#1976d2",
          footer:
            '<p style="color: #666; font-size: 12px;">If the problem persists, please contact support.</p>',
        });
      } finally {
        setEnrolling((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={20}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={36}
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <School sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Available Courses
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Discover and enroll in courses to enhance your skills and advance your
          career
        </Typography>
        <Chip
          label={`${courses.length} Courses Available`}
          sx={{
            mt: 2,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Paper>

      {/* No courses message */}
      {courses.length === 0 && !loading ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <MenuBook sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No courses available at the moment
          </Typography>
          <Typography color="text.secondary">
            Please check back later for new course offerings
          </Typography>
        </Paper>
      ) : (
        /* Course Grid */
        <Grid container spacing={3}>
          {courses.map((course, index) => {
            const isEnrolled = enrolledCourseIds.has(course.courseId);
            const isEnrolling = enrolling[course.courseId];
            
            return (
              <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {/* Course Header */}
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${
                          index % 3 === 0
                            ? "#e3f2fd, #bbdefb"
                            : index % 3 === 1
                            ? "#f3e5f5, #e1bee7"
                            : "#e8f5e8, #c8e6c9"
                        })`,
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        fontWeight="bold"
                        color="primary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.title}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Course Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {course.description}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Course Duration */}
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Schedule color="primary" sx={{ fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="medium">
                          Duration: {course.duration}
                        </Typography>
                      </Box>

                      {/* Enroll Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() =>
                          handleEnroll(course.courseId, course.title)
                        }
                        disabled={isEnrolling || isEnrolled}
                        startIcon={
                          isEnrolling ? null : <CheckCircle />
                        }
                        sx={{
                          py: 1.5,
                          fontWeight: "bold",
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          background: isEnrolled
                            ? "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)"
                            : isEnrolling
                            ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                            : "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                          "&:hover": {
                            background: isEnrolled
                              ? "linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)"
                              : isEnrolling
                              ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                              : "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                            transform: isEnrolled || isEnrolling ? "none" : "translateY(-2px)",
                            boxShadow: isEnrolled || isEnrolling 
                              ? "none" 
                              : "0 4px 12px rgba(25,118,210,0.4)",
                          },
                          "&:disabled": {
                            color: "white",
                            opacity: isEnrolled ? 1 : 0.6,
                          },
                        }}
                      >
                        {isEnrolled
                          ? "Enrolled"
                          : isEnrolling
                          ? "Enrolling..."
                          : "Enroll Now"}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal-popup-custom {
          border-radius: 16px !important;
        }
        .swal-title-custom {
          color: #1976d2 !important;
          font-weight: bold !important;
        }
        .swal-content-custom {
          color: #666 !important;
        }
      `}</style>
    </Container>
  );
};

export default CourseList;