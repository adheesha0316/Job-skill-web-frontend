// JobPostList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Skeleton,
  Container,
  Fade,
  Paper,
  Divider,
  Stack,
  IconButton,
  Input,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Work,
  LocationOn,
  Business,
  AttachFile,
  Send,
  Description,
  AccessTime,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import axiosInstance from "../../Service/axiosOrder"; // Adjust the path as necessary
import Swal from "sweetalert2";

const JobPostList = ({ seekerId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [selectedFile, setSelectedFile] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/job/getAll");
        setJobs(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Jobs",
          text: "Unable to fetch job listings. Please try again later.",
          confirmButtonColor: "#1976d2",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFileSelect = (jobId, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
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

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "Please select a resume file smaller than 5MB.",
          confirmButtonColor: "#1976d2",
        });
        return;
      }

      setSelectedFile(prev => ({ ...prev, [jobId]: file }));
    }
  };

  const removeSelectedFile = (jobId) => {
    setSelectedFile(prev => {
      const updated = { ...prev };
      delete updated[jobId];
      return updated;
    });
  };

  const handleApply = async (jobId, jobTitle, company) => {
    const file = selectedFile[jobId];
    
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Resume Required",
        text: "Please select your resume file before applying.",
        confirmButtonColor: "#1976d2",
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Job Application",
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Resume:</strong> ${file.name}</p>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Are you sure you want to apply for this position?
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Apply!",
      cancelButtonText: "Cancel",
      width: 450,
    });

    if (result.isConfirmed) {
      try {
        setApplying(prev => ({ ...prev, [jobId]: true }));

        const formData = new FormData();
        formData.append("resumeFile", file);

        await axiosInstance.post(
          `/seeker/apply/${seekerId}/${jobId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        

        // Clear selected file after successful application
        removeSelectedFile(jobId);

        // Success notification
        await Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          html: `
            <div style="text-align: center; margin: 20px 0;">
              <p>Your application for <strong>${jobTitle}</strong> has been successfully submitted.</p>
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                The employer will review your application and contact you if selected.
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
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Application failed. Please try again.";
        
        Swal.fire({
          icon: "error",
          title: "Application Failed",
          text: errorMessage,
          confirmButtonColor: "#1976d2",
          footer: '<p style="color: #666; font-size: 12px;">If the problem persists, please contact support.</p>',
        });
      } finally {
        setApplying(prev => ({ ...prev, [jobId]: false }));
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
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 1 }} />
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
          background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
          color: "white",
          p: 4,
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Work sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Available Job Posts
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Find your next career opportunity and apply with your resume
        </Typography>
        <Chip
          label={`${jobs.length} Jobs Available`}
          sx={{
            mt: 2,
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Paper>

      {/* No jobs message */}
      {jobs.length === 0 && !loading ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Work sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No job postings available at the moment
          </Typography>
          <Typography color="text.secondary">
            Please check back later for new opportunities
          </Typography>
        </Paper>
      ) : (
        /* Jobs Grid */
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={6} key={job.jobId}>
              <Fade in={true} timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    },
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {/* Job Header */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${
                        index % 4 === 0
                          ? "#e8f5e8, #c8e6c9"
                          : index % 4 === 1
                          ? "#fff3e0, #ffcc02"
                          : index % 4 === 2
                          ? "#e3f2fd, #bbdefb"
                          : "#fce4ec, #f8bbd9"
                      })`,
                      p: 3,
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
                      {job.title}
                    </Typography>
                    
                    {job.company && (
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Business color="primary" sx={{ fontSize: 18 }} />
                        <Typography variant="body2" fontWeight="medium" color="text.primary">
                          {job.company}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Job Description */}
                    <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                      <Description color="action" sx={{ fontSize: 20, mt: 0.2 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {job.description}
                      </Typography>
                    </Box>

                    {/* Location */}
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <LocationOn color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight="medium">
                        {job.location || "Location not specified"}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* File Upload Section */}
                    <Box mb={2}>
                      <Typography variant="subtitle2" color="text.primary" mb={1}>
                        Upload Resume:
                      </Typography>
                      
                      {selectedFile[job.jobId] ? (
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
                              <CheckCircle color="success" sx={{ fontSize: 20 }} />
                              <Typography variant="body2" color="success.dark">
                                {selectedFile[job.jobId].name}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => removeSelectedFile(job.jobId)}
                              sx={{ color: "error.main" }}
                            >
                              <Cancel />
                            </IconButton>
                          </Stack>
                        </Paper>
                      ) : (
                        <Box>
                          <input
                            type="file"
                            id={`resume-${job.jobId}`}
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileSelect(job.jobId, e)}
                            style={{ display: "none" }}
                          />
                          <Button
                            component="label"
                            htmlFor={`resume-${job.jobId}`}
                            variant="outlined"
                            startIcon={<AttachFile />}
                            fullWidth
                            sx={{
                              py: 1.2,
                              borderStyle: "dashed",
                              borderWidth: 2,
                              "&:hover": {
                                borderStyle: "dashed",
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            Choose Resume File (PDF, DOC, DOCX)
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {/* Apply Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => handleApply(job.jobId, job.title, job.company)}
                      disabled={applying[job.jobId] || !selectedFile[job.jobId]}
                      startIcon={
                        applying[job.jobId] ? <AccessTime /> : <Send />
                      }
                      sx={{
                        py: 1.5,
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        background: applying[job.jobId] || !selectedFile[job.jobId]
                          ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                          : "linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)",
                        "&:hover": {
                          background: applying[job.jobId] || !selectedFile[job.jobId]
                            ? "linear-gradient(45deg, #ccc 30%, #ddd 90%)"
                            : "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)",
                          transform: !applying[job.jobId] && selectedFile[job.jobId] ? "translateY(-2px)" : "none",
                          boxShadow: !applying[job.jobId] && selectedFile[job.jobId] ? "0 6px 16px rgba(46,125,50,0.4)" : "none",
                        },
                      }}
                    >
                      {applying[job.jobId] 
                        ? "Submitting Application..." 
                        : !selectedFile[job.jobId]
                        ? "Select Resume to Apply"
                        : "Apply Now"
                      }
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

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
        }
        .swal2-confirm {
          border-radius: 8px !important;
          font-weight: bold !important;
        }
        .swal2-cancel {
          border-radius: 8px !important;
          font-weight: bold !important;
        }
      `}</style>
    </Container>
  );
};

export default JobPostList;