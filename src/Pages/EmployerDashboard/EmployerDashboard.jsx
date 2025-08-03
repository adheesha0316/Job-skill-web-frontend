import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Paper,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Business,
  Assignment,
  Work,
  Logout,
  AddCircle,
  Dashboard,
  Person,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Notifications,
  Settings,
  Close,
  LocationOn,
  AttachMoney,
  CloudUpload,
  CheckCircle,
  TrendingUp,
  People,
  Visibility,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder";
import JobCard from "../../Component/EmployerComp/JobCard";
import RegisterEmployerForm from "../../Component/EmployerComp/RegisterEmployerForm";
import ApplicationReview from "../../Component/EmployerComp/ApplicationReview";
import EmployerProfileCard from "../../Component/EmployerComp/EmployerProfileCard";


const DRAWER_WIDTH = 280;

const EmployerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [selectedView, setSelectedView] = useState("dashboard");
  const [isRegistered, setIsRegistered] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [employerId, setEmployerId] = useState(null);
  const [employerData, setEmployerData] = useState(null);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedJobToEdit, setSelectedJobToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    recentViews: 0,
  });
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "full-time",
    salary: "",
    logoPath: null,
  });

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Dashboard />,
      description: "Overview & Analytics",
    },
    {
      id: "profile",
      label: isRegistered ? "Profile" : "Register",
      icon: isRegistered ? <BusinessIcon /> : <PersonAddIcon />,
      description: isRegistered
        ? "Manage company info"
        : "Complete registration",
      requiresRegistration: false,
    },
    {
      id: "jobPost",
      label: "Job Postings",
      icon: <Work />,
      description: "Manage your jobs",
      badge: jobs.length,
    },
    {
      id: "applicationReview",
      label: "Applications",
      icon: <Assignment />,
      description: "Review candidates",
      badge: stats.totalApplications,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <TrendingUp />,
      description: "Performance insights",
      requiresRegistration: true,
    },
  ];

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Employer");
    checkRegistration();
  }, []);

  const checkRegistration = async () => {
    setLoading(true);
    try {
      if (!userId) {
        console.warn("No user ID found in localStorage");
        setIsRegistered(false);
        setLoading(false);
        return;
      }
      console.log("Checking registration for user ID:", userId);

      const res = await axiosInstance.get(`/employer/byUserId/${userId}`);

      console.log("Registration check response:", res.data);
      if (res.data?.employerId) {
        setIsRegistered(true);
        setEmployerData(res.data);
        await fetchEmployerJobs(res.data.employerId);
        await fetchStats(res.data.employerId);
      } else {
        setIsRegistered(false);
        setEmployerData(null);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
      setIsRegistered(false);
      setEmployerData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployerJobs = async (employerId) => {
    try {
      const res = await axiosInstance.get(`/employer/${employerId}/jobs`);
      setJobs(res.data[0]?.jobs || []); // because backend returns a list
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  const fetchStats = async (employerId) => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axiosInstance.get(`/employer/${employerId}/jobs`),
        axiosInstance.get(`/employer/applications/${employerId}`),
      ]);
      const jobsData = jobsRes.data[0]?.jobs || []; // again: backend returns List<EmployerWithJobDto>
      const appsData = appsRes.data || [];

      setStats({
        totalJobs: jobsData.length,
        totalApplications: appsData.length,
        activeJobs: jobsData.filter((job) => job.status === "active").length,
        recentViews: jobsData.reduce((sum, job) => sum + (job.views || 0), 0),
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      await Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.reload();
    }
  };

  const handleJobFormSubmit = async () => {
    if (!newJob.title || !newJob.description || !newJob.location) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
      return;
    }

    if (!employerData || !employerData.employerId) {
      Swal.fire({
        title: "Employer Not Registered",
        text: "Please complete your company profile before posting a job.",
        icon: "warning",
        confirmButtonColor: "#f44336",
      });
      return;
    }

    const formData = new FormData();

    // Append fields except logoFile
    Object.entries(newJob).forEach(([key, value]) => {
      if (value && key !== "logoFile") {
        // convert salary to string if it's a number
        if (key === "salary" && typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      }
    });

    formData.append("employerId", employerData.employerId);

    // Append logoFile separately with correct key
    if (newJob.logoFile) {
      formData.append("logoFile", newJob.logoFile);
    }

    try {
      // Get token from localStorage (adjust if your token storage differs)
      const token = localStorage.getItem("token");

      await axiosInstance.post("/job/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        title: "Success!",
        text: "Job posted successfully!",
        icon: "success",
        confirmButtonColor: "#4caf50",
        timer: 2000,
        timerProgressBar: true,
      });

      setJobFormOpen(false);
      setNewJob({
        title: "",
        description: "",
        location: "",
        jobType: "full-time",
        salary: "",
        logoFile: null, // reset file
      });

      await checkRegistration();
    } catch (err) {
      console.error("Job creation error:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to post job. Please try again.",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    }
  };

  const handleMenuItemClick = (itemId) => {
    const item = menuItems.find((m) => m.id === itemId);

    if (item?.requiresRegistration && !isRegistered) {
      Swal.fire({
        title: "Registration Required",
        text: "Please complete your company registration first",
        icon: "info",
        confirmButtonColor: "#1976d2",
      });
      setSelectedView("profile");
    } else {
      setSelectedView(itemId);
    }

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h4" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Welcome back, {userName}!
      </Typography>

      {!isRegistered && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setSelectedView("profile")}
            >
              Register Now
            </Button>
          }
        >
          Complete your company registration to unlock all features
        </Alert>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Work sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
            <Typography variant="h3" fontWeight="600" color="primary">
              {stats.totalJobs}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Job Posts
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <People sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
            <Typography variant="h3" fontWeight="600" color="success.main">
              {stats.totalApplications}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Applications Received
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <CheckCircle sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
            <Typography variant="h3" fontWeight="600" color="info.main">
              {stats.activeJobs}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Jobs
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Visibility sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
            <Typography variant="h3" fontWeight="600" color="warning.main">
              {stats.recentViews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Views
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => {
              if (!isRegistered) {
                Swal.fire({
                  title: "Please Register",
                  text: "You must register your company before posting a job.",
                  icon: "info",
                  confirmButtonColor: "#1976d2",
                });
              } else {
                setJobFormOpen(true);
              }
            }}
            disabled={!isRegistered}
            sx={{ flex: 1 }}
          >
            Post New Job
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => setSelectedView("applicationReview")}
            disabled={!isRegistered}
            sx={{ flex: 1 }}
          >
            Review Applications
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => setSelectedView("analytics")}
            disabled={!isRegistered}
            sx={{ flex: 1 }}
          >
            View Analytics
          </Button>
        </Stack>
      </Paper>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Recent Job Postings
          </Typography>
          <Stack spacing={2}>
            {jobs.slice(0, 3).map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                onView={() => console.log("View job")}
                onEdit={() => console.log("Edit job")}
                onDelete={() => fetchEmployerJobs(employerData.employerId)}
                showApplicationCount={true}
              />
            ))}
          </Stack>
          {jobs.length > 3 && (
            <Box textAlign="center" mt={2}>
              <Button variant="text" onClick={() => setSelectedView("jobPost")}>
                View All Jobs ({jobs.length})
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={40} />
          <Typography variant="body1" ml={2}>
            Loading...
          </Typography>
        </Box>
      );
    }

    switch (selectedView) {
      case "dashboard":
        return renderDashboard();
      case "profile":
        return (
          <Box sx={{ p: 3 }}>
            {isRegistered ? (
              <EmployerProfileCard />
            ) : (
              <RegisterEmployerForm onSuccess={checkRegistration} />
            )}
          </Box>
        );
      case "jobPost":
        return (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h4" fontWeight="600">
                Job Postings
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircle />}
                onClick={() => setJobFormOpen(true)}
                disabled={!isRegistered}
              >
                Add New Job
              </Button>
            </Stack>
            <Stack spacing={2}>
              {jobs.map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  onView={(job) => console.log("View:", job)}
                  onEdit={(job) => {
                    setSelectedJobToEdit(job);
                    setEditDialogOpen(true);
                  }}
                  onDelete={async (jobId) => {
                    await fetchEmployerJobs(employerData.employerId);
                  }}
                  showApplicationCount={true}
                />
              ))}
              {jobs.length === 0 && (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                  <Work sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Job Postings Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Start by creating your first job posting
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddCircle />}
                    onClick={() => setJobFormOpen(true)}
                  >
                    Create First Job
                  </Button>
                </Paper>
              )}
            </Stack>
          </Box>
        );
      case "applicationReview":
        return <ApplicationReview employerId={employerData?.employerId} />;
      default:
        return renderDashboard();
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {userName[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="600">
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {isRegistered
                ? employerData?.companyName || "Employer Account"
                : "Setup Required"}
            </Typography>
          </Box>
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ px: 2, py: 1 }}>
          {!isRegistered && (
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleMenuItemClick("profile")}
                selected={selectedView === "profile"}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                    "&:hover": { bgcolor: "warning.main" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Complete Registration"
                  secondary="Required for full access"
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <Chip label="Required" size="small" color="warning" />
              </ListItemButton>
            </ListItem>
          )}

          {menuItems.map((item) => {
            if (item.requiresRegistration && !isRegistered) {
              return null;
            }

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <Tooltip title={item.description} placement="right" arrow>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.id)}
                    selected={selectedView === item.id}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                      {item.badge ? (
                        <Badge badgeContent={item.badge} color="error">
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      secondaryTypographyProps={{ fontSize: "0.75rem" }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { md: drawerOpen ? `${DRAWER_WIDTH}px` : 0 },
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { md: drawerOpen ? "none" : "block" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Employer Portal
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={stats.totalApplications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar sx={{ width: 32, height: 32 }}>{userName[0]}</Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "none",
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
          minHeight: "100vh",
          bgcolor: "grey.50",
          mt: 8,
        }}
      >
        {renderContent()}
      </Box>

      {/* Add Job Dialog */}
      <Dialog
        open={jobFormOpen}
        onClose={() => setJobFormOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AddCircle color="primary" />
            <Typography variant="h6" fontWeight="600">
              Create New Job Posting
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Job Title *"
              fullWidth
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
            />

            <TextField
              label="Job Description *"
              fullWidth
              multiline
              rows={4}
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Location *"
                fullWidth
                value={newJob.location}
                onChange={(e) =>
                  setNewJob({ ...newJob, location: e.target.value })
                }
                placeholder="e.g. New York, NY (Remote)"
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={newJob.jobType}
                  onChange={(e) =>
                    setNewJob({ ...newJob, jobType: e.target.value })
                  }
                  label="Job Type"
                >
                  <MenuItem value="full-time">Full Time</MenuItem>
                  <MenuItem value="part-time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="freelance">Freelance</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Salary"
              fullWidth
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              placeholder="e.g. Rs 80,000 per month"
              InputProps={{
                startAdornment: (
                  <AttachMoney sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ alignSelf: "flex-start" }}
            >
              Upload Company Logo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewJob({ ...newJob, logoPath: e.target.files[0] })
                }
              />
            </Button>
            {newJob.logoPath && (
              <Typography variant="caption" color="text.secondary">
                Selected: {newJob.logoPath.name}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setJobFormOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleJobFormSubmit}
            startIcon={<CheckCircle />}
            sx={{ minWidth: 120 }}
          >
            Post Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerDashboard;
