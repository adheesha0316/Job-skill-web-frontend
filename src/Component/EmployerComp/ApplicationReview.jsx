import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Box,
  Chip,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Link,
} from "@mui/material";
import {
  Person,
  Work,
  CheckCircle,
  Cancel,
  Email,
  Phone,
  Description,
  CalendarToday,
  Refresh,
} from "@mui/icons-material";
import axiosInstance from "../../Service/axiosOrder";
import Swal from "sweetalert2";

const ApplicationReview = ({ employerId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchScores, setMatchScores] = useState({});

  useEffect(() => {
    if (applications.length > 0) {
      const fetchAllScores = async () => {
        const scores = await Promise.all(
          applications.map(async (app) => {
            if (app.resumeUrl && app.job?.jobId) {
              const score = await fetchCVMatchScore(
                app.resumeUrl,
                app.job.jobId
              );
              return { id: app.applicationId, score };
            }
            return { id: app.applicationId, score: null };
          })
        );

        const scoresMap = {};
        scores.forEach(({ id, score }) => {
          scoresMap[id] = score;
        });

        setMatchScores(scoresMap);
      };

      fetchAllScores();
    }
  }, [applications]);

  const baseResumeUrl = "http://localhost:8080/cvs/";

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/employer/applications/${employerId}`
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appId,
    status,
    applicantName = "Application"
  ) => {
    const result = await Swal.fire({
      title: `${status === "APPROVED" ? "Approve" : "Reject"} Application?`,
      text: `Are you sure you want to ${status.toLowerCase()} this application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "APPROVED" ? "#4caf50" : "#f44336",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${status.toLowerCase()}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/application/status/${appId}`, { status });
        await Swal.fire({
          title: "Success!",
          text: `Application has been ${status.toLowerCase()}`,
          icon: "success",
          confirmButtonColor: "#4caf50",
          timer: 2000,
          timerProgressBar: true,
        });
        fetchApplications();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to update application status",
          icon: "error",
          confirmButtonColor: "#f44336",
        });
      }
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const fetchCVMatchScore = async (resumeUrl, jobId) => {
    try {
      const fileName = getFileNameFromUrl(resumeUrl);
      const response = await axiosInstance.post("/application/match", {
        resumeUrl: fileName,
        jobId,
      });
      console.log("CV Match Score API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching CV match score:", error);
      return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle fontSize="small" />;
      case "REJECTED":
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (employerId) fetchApplications();
  }, [employerId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress size={40} />
        <Typography variant="body1" ml={2}>
          Loading applications...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={fetchApplications}>
            Try Again
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: "100%", margin: "0 auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Work fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="600">
                Job Applications
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {applications.length} application
                {applications.length !== 1 ? "s" : ""} to review
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Refresh Applications">
            <IconButton
              onClick={fetchApplications}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Work sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Applications Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Applications for your job postings will appear here
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {applications.map(
            (app) => (
              console.log("Full Resume URL:", baseResumeUrl + app.resumeUrl),
              (
                <Card
                  key={app.applicationId}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      elevation: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            mb={2}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 56,
                                height: 56,
                              }}
                            >
                              <Person fontSize="large" />
                            </Avatar>
                            <Box flex={1}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                mb={1}
                              >
                                <Typography variant="h6" fontWeight="600">
                                  {app.job?.title || "Untitled Job"}
                                </Typography>
                                <Chip
                                  label={app.status}
                                  color={getStatusColor(app.status)}
                                  size="small"
                                  icon={getStatusIcon(app.status)}
                                  sx={{ fontWeight: 500 }}
                                />
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Application ID: {app.applicationId}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack spacing={1} sx={{ mb: 2 }}>
                            {app.seeker?.seekerId && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Seeker ID:</strong>{" "}
                                  {app.seeker.seekerId}
                                </Typography>
                              </Box>
                            )}
                            {app.seeker?.email && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Email:</strong> {app.seeker.email}
                                </Typography>
                              </Box>
                            )}
                            {app.seeker?.phone && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Phone:</strong> {app.seeker.phone}
                                </Typography>
                              </Box>
                            )}
                            {app.seeker?.experience && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Work fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Experience:</strong>{" "}
                                  {app.seeker.experience}
                                </Typography>
                              </Box>
                            )}
                            {app.resumeUrl && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Description fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Resume:</strong>{" "}
                                  <Link
                                    href={baseResumeUrl + app.resumeUrl}
                                    target="_blank"
                                    rel="noopener"
                                    underline="hover"
                                  >
                                    View Resume
                                  </Link>
                                </Typography>
                              </Box>
                            )}
                            {matchScores[app.applicationId] != null ? (
                              <Box
                                mt={1}
                                sx={{ marginTop: "8px", padding: "4px 0" }}
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight="600"
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    color:
                                      matchScores[app.applicationId] >= 0.75
                                        ? "#2e7d32"
                                        : "#d32f2f", // Green if >= 75%, red otherwise
                                    backgroundColor:
                                      matchScores[app.applicationId] >= 0.75
                                        ? "#e8f5e9"
                                        : "#ffebee", // Light green or light red
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    display: "inline-block",
                                    border:
                                      matchScores[app.applicationId] >= 0.75
                                        ? "1px solid #c8e6c9"
                                        : "1px solid #ffcdd2", // Green or red border
                                  }}
                                >
                                  CV Match Score:{" "}
                                  {(
                                    matchScores[app.applicationId] * 100
                                  ).toFixed(1)}
                                  %
                                </Typography>
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                              >
                                CV Match Score: Not available
                              </Typography>
                            )}

                            {app.coverLetter && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                gap={0.5}
                              >
                                <Typography variant="body2" fontWeight={600}>
                                  Cover Letter:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {app.coverLetter}
                                </Typography>
                              </Box>
                            )}
                            {app.appliedDate && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday
                                  fontSize="small"
                                  color="action"
                                />
                                <Typography variant="body2">
                                  <strong>Applied:</strong>{" "}
                                  {new Date(
                                    app.appliedDate
                                  ).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: { xs: "stretch", md: "flex-end" },
                            }}
                          >
                            {app.status === "PENDING" ? (
                              <Stack
                                spacing={2}
                                width={{ xs: "100%", md: "auto" }}
                              >
                                <Button
                                  onClick={() =>
                                    handleStatusChange(
                                      app.applicationId,
                                      "APPROVED",
                                      app.seeker?.name
                                    )
                                  }
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircle />}
                                  size="large"
                                  sx={{
                                    minWidth: 140,
                                    fontWeight: 600,
                                    textTransform: "none",
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleStatusChange(
                                      app.applicationId,
                                      "REJECTED",
                                      app.seeker?.name
                                    )
                                  }
                                  variant="outlined"
                                  color="error"
                                  startIcon={<Cancel />}
                                  size="large"
                                  sx={{
                                    minWidth: 140,
                                    fontWeight: 600,
                                    textTransform: "none",
                                  }}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            ) : (
                              <Chip
                                label={`${app.status.charAt(0)}${app.status
                                  .slice(1)
                                  .toLowerCase()}`}
                                color={getStatusColor(app.status)}
                                icon={getStatusIcon(app.status)}
                                variant="outlined"
                                size="large"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  height: 40,
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ px: 3, py: 2, backgroundColor: "grey.50" }}>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date().toLocaleDateString()} •
                        Application #{app.applicationId}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )
            )
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ApplicationReview;
