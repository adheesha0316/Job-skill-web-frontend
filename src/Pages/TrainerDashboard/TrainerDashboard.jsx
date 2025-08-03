// TrainerDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Container,
  Button,
  Paper,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Logout,
  Person,
  Class,
  HowToReg,
  Dashboard,
  MenuBook,
  GroupAdd,
  Settings,
  Notifications,
  Search,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder";
import TrainerProfileCard from "../../Component/TrainerComp/TrainerProfileCard";
import TrainerRegisterForm from "../../Component/TrainerComp/TrainerRegisterForm";
import CourseManager from "../../Component/TrainerComp/CourseManager";
import EnrollmentList from "../../Component/TrainerComp/EnrollmentList";

const TrainerDashboard = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();
  const userName = localStorage.getItem("userName");


  const fetchTrainer = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User not logged in or missing token");
      setTrainer(null);
      setLoading(false);
      return;
    }

    setLoading(true); // start loading

    try {
      const res = await axiosInstance.get(`/trainer/profile/get/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrainer(res.data);
    } catch (err) {
      console.error("Trainer not found for userId", userId, err);
      setTrainer(null);
    } finally {
      setLoading(false); // end loading
    }
  };

  useEffect(() => {
    fetchTrainer();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Ready to Leave?",
      text: "Are you sure you want to logout from your trainer dashboard?",
      icon: "question",
      iconColor: "#1976d2",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Stay Here",
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#1976d2",
      background: "#ffffff",
      backdrop: `rgba(0,0,0,0.4)`,
      reverseButtons: false,
      focusCancel: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      buttonsStyling: true,
      width: "400px",
      padding: "2rem",
      customClass: {
        popup: "trainer-logout-popup",
        title: "trainer-logout-title",
        htmlContainer: "trainer-logout-text",
        confirmButton: "trainer-logout-confirm",
        cancelButton: "trainer-logout-cancel",
        actions: "trainer-logout-actions",
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          // Show loading state
          Swal.fire({
            title: "Logging Out...",
            text: "Please wait while we securely log you out.",
            icon: "info",
            iconColor: "#1976d2",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            width: "350px",
            padding: "2rem",
            customClass: {
              popup: "trainer-loading-popup",
            },
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Simulate logout process
          setTimeout(() => {
            Swal.fire({
              title: "Logged Out!",
              text: "You have been successfully logged out.",
              icon: "success",
              iconColor: "#4caf50",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              width: "350px",
              padding: "2rem",
              customClass: {
                popup: "trainer-success-popup",
              },
            }).then(() => {
              localStorage.clear();
              window.location.reload();
            });
          }, 1000);
        } else if (result.isDismissed) {
          console.log("User chose to stay");
        }
      })
      .catch((error) => {
        console.error("Logout dialog error:", error);
        // Fallback logout if there's an error
        localStorage.clear();
        window.location.reload();
      });
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        label: "Dashboard",
        view: "dashboard",
        icon: <Dashboard />,
        color: "#1976d2",
      },
    ];

    if (trainer) {
      return [
        ...baseItems,
        {
          label: "Profile",
          view: "profile",
          icon: <Person />,
          color: "#4caf50",
        },
        {
          label: "My Courses",
          view: "courses",
          icon: <MenuBook />,
          color: "#ff9800",
        },
        {
          label: "Enrollments",
          view: "enrollments",
          icon: <GroupAdd />,
          color: "#9c27b0",
          badge: 5,
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          label: "Register as Trainer",
          view: "register",
          icon: <HowToReg />,
          color: "#2196f3",
        },
        {
          label: "Browse Courses",
          view: "courses",
          icon: <Class />,
          color: "#607d8b",
        },
      ];
    }
  };

  const getViewTitle = () => {
    const titles = {
      dashboard: "Dashboard Overview",
      profile: "Trainer Profile",
      register: "Trainer Registration",
      courses: trainer ? "Course Management" : "Available Courses",
      enrollments: "Student Enrollments",
    };
    return titles[activeView] || "Dashboard";
  };

  const renderView = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          flexDirection="column"
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "#1976d2",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Box>
      );
    }

    if (!trainer && activeView !== "register" && activeView !== "dashboard") {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)",
            border: "2px dashed #ffb74d",
            borderRadius: 3,
          }}
        >
          <HowToReg sx={{ fontSize: 64, color: "#ff9800", mb: 2 }} />
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            color="text.primary"
          >
            Welcome to Trainer Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            You're not registered as a trainer yet. Register now to start
            creating courses and managing students!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<HowToReg />}
            onClick={() => setActiveView("register")}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #ff9800, #ffb74d)",
              "&:hover": {
                background: "linear-gradient(45deg, #f57c00, #ff9800)",
              },
            }}
          >
            Register as Trainer
          </Button>
        </Paper>
      );
    }

    if (activeView === "dashboard") {
      return (
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {userName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Here's what's happening with your training activities today.
          </Typography>

          {trainer && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 3,
                mb: 4,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  border: "1px solid #1976d2",
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#1976d2">
                  Total Courses
                </Typography>
                <Typography variant="h3" fontWeight={700} color="#0d47a1">
                  12
                </Typography>
              </Paper>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                  border: "1px solid #4caf50",
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#4caf50">
                  Active Students
                </Typography>
                <Typography variant="h3" fontWeight={700} color="#2e7d32">
                  156
                </Typography>
              </Paper>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
                  border: "1px solid #ff9800",
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#f57c00">
                  Completion Rate
                </Typography>
                <Typography variant="h3" fontWeight={700} color="#ef6c00">
                  84%
                </Typography>
              </Paper>
            </Box>
          )}

          {trainer ? (
            <TrainerProfileCard trainer={trainer} />
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                border: "2px dashed #9c27b0",
                borderRadius: 3,
              }}
            >
              <Person sx={{ fontSize: 64, color: "#9c27b0", mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Complete Your Registration
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Join our community of expert trainers and start sharing your
                knowledge!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<HowToReg />}
                onClick={() => setActiveView("register")}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(45deg, #9c27b0, #ba68c8)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #7b1fa2, #9c27b0)",
                  },
                }}
              >
                Get Started
              </Button>
            </Paper>
          )}
        </Box>
      );
    }

    switch (activeView) {
      case "profile":
        return <TrainerProfileCard trainer={trainer} />;
      case "register":
        return <TrainerRegisterForm reload={fetchTrainer} />;
      case "courses":
        return <CourseManager trainerId={trainer?.trainerId} />;
      case "enrollments":
        return <EnrollmentList trainerId={trainer?.trainerId} />;
      default:
        return null;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* Enhanced AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: "linear-gradient(45deg, #fff, #e3f2fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Skill Job Portal
            </Typography>
            <Chip
              label="Trainer"
              size="small"
              sx={{
                ml: 2,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Search">
              <IconButton color="inherit">
                <Search />
              </IconButton>
            </Tooltip>

            <Box display="flex" alignItems="center" gap={1} sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  color: "primary.main",
                  fontWeight: 700,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {userName?.charAt(0).toUpperCase() || "T"}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" fontWeight={600}>
                  {userName || "Trainer"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {trainer ? "Verified Trainer" : "Guest User"}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  ml: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          [`& .MuiDrawer-paper`]: {
            width: 280,
            top: 64,
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Navigation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your trainer profile
          </Typography>
        </Box>

        <List sx={{ p: 1 }}>
          {menuItems.map(({ label, view, icon, color, badge }, index) => (
            <Fade in={true} timeout={300 * (index + 1)} key={view}>
              <ListItem
                button
                selected={activeView === view}
                onClick={() => setActiveView(view)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  mx: 1,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    backgroundColor: alpha(color, 0.15),
                    borderLeft: `4px solid ${color}`,
                    "&:hover": {
                      backgroundColor: alpha(color, 0.2),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha(color, 0.08),
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor:
                        activeView === view ? alpha(color, 0.2) : "transparent",
                      color: activeView === view ? color : "text.secondary",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {badge ? (
                      <Badge badgeContent={badge} color="error">
                        {icon}
                      </Badge>
                    ) : (
                      icon
                    )}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: activeView === view ? 600 : 500,
                    color: activeView === view ? color : "text.primary",
                  }}
                />
              </ListItem>
            </Fade>
          ))}
        </List>

        {trainer && (
          <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #e0e0e0" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="text.primary">
                🎯 Quick Stats
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active since 2024
              </Typography>
            </Paper>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Breadcrumb Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #fff 0%, #f8f9ff 100%)",
              border: "1px solid #e3f2fd",
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {getViewTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeView === "dashboard" &&
                "Overview of your training activities and performance"}
              {activeView === "profile" &&
                "View and manage your trainer profile information"}
              {activeView === "register" &&
                "Complete your trainer registration to get started"}
              {activeView === "courses" &&
                "Create and manage your training courses"}
              {activeView === "enrollments" &&
                "Monitor student enrollments and progress"}
            </Typography>
          </Paper>

          {/* Dynamic Content */}
          <Zoom in={true} timeout={500}>
            <Box>{renderView()}</Box>
          </Zoom>
        </Container>
      </Box>

      {/* Enhanced SweetAlert2 Styles */}
      <style jsx global>{`
        /* Main logout popup styling */
        .trainer-logout-popup {
          border-radius: 20px !important;
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
          border: none !important;
        }

        .trainer-logout-title {
          color: #1976d2 !important;
          font-weight: 700 !important;
          font-size: 1.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.3 !important;
        }

        .trainer-logout-text {
          color: #555 !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          margin-bottom: 2rem !important;
          font-weight: 400 !important;
        }

        /* Button container */
        .trainer-logout-actions {
          margin-top: 2rem !important;
          display: flex !important;
          justify-content: center !important;
          gap: 16px !important;
          flex-wrap: nowrap !important;
        }

        /* Confirm button (Logout) */
        .trainer-logout-confirm {
          background: linear-gradient(
            135deg,
            #f44336 0%,
            #d32f2f 100%
          ) !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          padding: 14px 28px !important;
          font-size: 15px !important;
          min-width: 120px !important;
          color: white !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
          text-transform: none !important;
          letter-spacing: 0.5px !important;
        }

        .trainer-logout-confirm:hover {
          background: linear-gradient(
            135deg,
            #d32f2f 0%,
            #b71c1c 100%
          ) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4) !important;
        }

        .trainer-logout-confirm:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
        }

        /* Cancel button (Stay) */
        .trainer-logout-cancel {
          background: linear-gradient(
            135deg,
            #1976d2 0%,
            #1565c0 100%
          ) !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          padding: 14px 28px !important;
          font-size: 15px !important;
          min-width: 120px !important;
          color: white !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
          text-transform: none !important;
          letter-spacing: 0.5px !important;
        }

        .trainer-logout-cancel:hover {
          background: linear-gradient(
            135deg,
            #1565c0 0%,
            #0d47a1 100%
          ) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(25, 118, 210, 0.4) !important;
        }

        .trainer-logout-cancel:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
        }

        /* Loading popup */
        .trainer-loading-popup {
          border-radius: 20px !important;
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
        }

        /* Success popup */
        .trainer-success-popup {
          border-radius: 20px !important;
          font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
        }

        /* Icon styling */
        .swal2-icon {
          margin: 1.5rem auto 1rem !important;
          border: none !important;
        }

        .swal2-icon.swal2-question {
          border-color: #1976d2 !important;
          color: #1976d2 !important;
        }

        .swal2-icon.swal2-success {
          border-color: #4caf50 !important;
          color: #4caf50 !important;
        }

        .swal2-icon.swal2-info {
          border-color: #1976d2 !important;
          color: #1976d2 !important;
        }

        /* Timer progress bar */
        .swal2-timer-progress-bar {
          background: rgba(76, 175, 80, 0.8) !important;
          height: 3px !important;
        }

        /* Remove default focus outline */
        .swal2-styled:focus {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          outline: none !important;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .trainer-logout-actions {
            flex-direction: column !important;
            gap: 12px !important;
          }

          .trainer-logout-confirm,
          .trainer-logout-cancel {
            width: 100% !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default TrainerDashboard;
