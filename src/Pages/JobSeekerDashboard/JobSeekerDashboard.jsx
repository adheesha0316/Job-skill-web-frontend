import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  useTheme,
  Container,
  Paper,
  Chip,
  Badge,
  Tooltip,
  alpha,
  Fade,
  Zoom,
  Button,
  CircularProgress
} from "@mui/material";
import {
  Menu as MenuIcon,
  PersonAdd,
  AccountCircle,
  Work,
  School,
  Logout,
  Dashboard,
  Notifications,
  Search,
  TrendingUp,
  BookmarkBorder,
  Assessment
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder";

import JobSeekerRegisterForm from "../../Component/SeekerComp/JobSeekerRegisterForm";
import JobSeekerProfileCard from "../../Component/SeekerComp/JobSeekerProfileCard";
import JobPostList from "../../Component/SeekerComp/JobPostList";
import CourseList from "../../Component/SeekerComp/CourseList";

const JobSeekerDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "User";

  const fetchJobSeeker = async () => {
    try {
      const res = await axiosInstance.get(`/seeker/user/${userId}`);
      setJobSeeker(res.data);
    } catch (err) {
      setJobSeeker(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSeeker();
  }, [userId]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Ready to Leave?',
      text: 'Are you sure you want to logout from your job seeker dashboard?',
      icon: 'question',
      iconColor: '#1976d2',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Stay Here',
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#1976d2',
      background: '#ffffff',
      backdrop: `rgba(0,0,0,0.4)`,
      reverseButtons: false,
      focusCancel: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      buttonsStyling: true,
      width: '400px',
      padding: '2rem',
      customClass: {
        popup: 'jobseeker-logout-popup',
        title: 'jobseeker-logout-title',
        htmlContainer: 'jobseeker-logout-text',
        confirmButton: 'jobseeker-logout-confirm',
        cancelButton: 'jobseeker-logout-cancel',
        actions: 'jobseeker-logout-actions'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logging Out...',
          text: 'Please wait while we securely log you out.',
          icon: 'info',
          iconColor: '#1976d2',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          width: '350px',
          padding: '2rem',
          customClass: {
            popup: 'jobseeker-loading-popup'
          },
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(() => {
          Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            iconColor: '#4caf50',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            width: '350px',
            padding: '2rem',
            customClass: {
              popup: 'jobseeker-success-popup'
            }
          }).then(() => {
            localStorage.clear();
            window.location.href = "/";
          });
        }, 1000);
      }
    }).catch((error) => {
      console.error('Logout dialog error:', error);
      localStorage.clear();
      window.location.href = "/";
    });
  };

  const handleMenuClick = (view) => {
    setActiveView(view);
    setDrawerOpen(false);
  };

  const getMenuItems = () => {
    const baseItems = [
      { 
        label: "Dashboard", 
        view: "dashboard", 
        icon: <Dashboard />, 
        color: "#1976d2" 
      }
    ];

    if (jobSeeker) {
      return [
        ...baseItems,
        { 
          label: "My Profile", 
          view: "profile", 
          icon: <AccountCircle />, 
          color: "#4caf50" 
        },
        { 
          label: "Job Search", 
          view: "jobs", 
          icon: <Work />, 
          color: "#ff9800",
          badge: 12
        },
        { 
          label: "Courses", 
          view: "courses", 
          icon: <School />, 
          color: "#9c27b0" 
        },
        { 
          label: "Saved Jobs", 
          view: "saved", 
          icon: <BookmarkBorder />, 
          color: "#607d8b",
          badge: 5
        }
      ];
    } else {
      return [
        ...baseItems,
        { 
          label: "Register Now", 
          view: "register", 
          icon: <PersonAdd />, 
          color: "#2196f3" 
        },
        { 
          label: "Browse Jobs", 
          view: "jobs", 
          icon: <Work />, 
          color: "#ff9800" 
        },
        { 
          label: "Courses", 
          view: "courses", 
          icon: <School />, 
          color: "#9c27b0" 
        }
      ];
    }
  };

  const getViewTitle = () => {
    const titles = {
      dashboard: "Dashboard Overview",
      profile: "My Profile",
      register: "Job Seeker Registration",
      jobs: "Job Opportunities",
      courses: "Available Courses",
      saved: "Saved Jobs"
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
              color: '#1976d2',
              mb: 2
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Box>
      );
    }

    if (!jobSeeker && activeView !== "register" && activeView !== "dashboard" && activeView !== "jobs" && activeView !== "courses") {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '2px dashed #2196f3',
            borderRadius: 3
          }}
        >
          <PersonAdd sx={{ fontSize: 64, color: '#2196f3', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary">
            Welcome to Job Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            You're not registered as a job seeker yet. Register now to start your career journey!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => setActiveView("register")}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196f3, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              }
            }}
          >
            Register Now
          </Button>
        </Paper>
      );
    }

    if (activeView === "dashboard") {
      return (
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {jobSeeker?.fullName || userName}! 🚀
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Your personalized job search dashboard with latest opportunities and insights.
          </Typography>
          
          {jobSeeker && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: '1px solid #1976d2'
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#1976d2">Job Applications</Typography>
                <Typography variant="h3" fontWeight={700} color="#0d47a1">8</Typography>
                <Typography variant="body2" color="#1976d2">+2 this week</Typography>
              </Paper>
              
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: '1px solid #4caf50'
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#4caf50">Profile Views</Typography>
                <Typography variant="h3" fontWeight={700} color="#2e7d32">45</Typography>
                <Typography variant="body2" color="#4caf50">+12 this week</Typography>
              </Paper>
              
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
                  border: '1px solid #ff9800'
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#f57c00">Saved Jobs</Typography>
                <Typography variant="h3" fontWeight={700} color="#ef6c00">12</Typography>
                <Typography variant="body2" color="#f57c00">5 new matches</Typography>
              </Paper>
              
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  border: '1px solid #9c27b0'
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#9c27b0">Course Progress</Typography>
                <Typography variant="h3" fontWeight={700} color="#7b1fa2">3</Typography>
                <Typography variant="body2" color="#9c27b0">2 completed</Typography>
              </Paper>
            </Box>
          )}
          
          {jobSeeker ? (
            <JobSeekerProfileCard seeker={jobSeeker} />
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                border: '2px dashed #9c27b0',
                borderRadius: 3
              }}
            >
              <AccountCircle sx={{ fontSize: 64, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Start Your Journey
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Create your professional profile and unlock thousands of job opportunities!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                onClick={() => setActiveView("register")}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b1fa2, #9c27b0)',
                  }
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
        return <JobSeekerProfileCard seeker={jobSeeker} />;
      case "register":
        return <JobSeekerRegisterForm userId={userId} onSuccess={fetchJobSeeker} />;
      case "jobs":
        return <JobPostList seekerId={jobSeeker?.seekerId} />;
      case "courses":
        return <CourseList seekerId={jobSeeker?.seekerId} />;
      case "saved":
        return (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>Saved Jobs</Typography>
            <Typography color="text.secondary">Your bookmarked job opportunities will appear here.</Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: '#f8f9fa' }}>
      {/* Enhanced AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{
                mr: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{
                background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Job Portal
            </Typography>
            <Chip
              label="Job Seeker"
              size="small"
              sx={{
                ml: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={5} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Search Jobs">
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
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={600}>
                  {userName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {jobSeeker ? 'Registered Job Seeker' : 'Guest User'}
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Logout">
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  ml: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
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
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 280,
            backgroundColor: '#fff',
            borderRight: '1px solid #e0e0e0',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ width: 280 }}>
          <Toolbar />
          
          <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Navigation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your career dashboard
            </Typography>
          </Box>
          
          <List sx={{ p: 1 }}>
            {menuItems.map(({ label, view, icon, color, badge }, index) => (
              <Fade in={true} timeout={300 * (index + 1)} key={view}>
                <ListItem
                  button
                  selected={activeView === view}
                  onClick={() => handleMenuClick(view)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    mx: 1,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      backgroundColor: alpha(color, 0.15),
                      borderLeft: `4px solid ${color}`,
                      '&:hover': {
                        backgroundColor: alpha(color, 0.2),
                      }
                    },
                    '&:hover': {
                      backgroundColor: alpha(color, 0.08),
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: activeView === view ? alpha(color, 0.2) : 'transparent',
                        color: activeView === view ? color : 'text.secondary',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {badge ? (
                        <Badge badgeContent={badge} color="error">
                          {icon}
                        </Badge>
                      ) : icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: activeView === view ? 600 : 500,
                      color: activeView === view ? color : 'text.primary'
                    }}
                  />
                </ListItem>
              </Fade>
            ))}
          </List>

          {jobSeeker && (
            <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #e0e0e0' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  💼 Career Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Keep building your profile
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Breadcrumb Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
              border: '1px solid #e3f2fd'
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {getViewTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeView === "dashboard" && "Your personalized job search overview and career insights"}
              {activeView === "profile" && "Manage your professional profile and career details"}
              {activeView === "register" && "Complete your job seeker registration to get started"}
              {activeView === "jobs" && "Discover and apply for job opportunities that match your skills"}
              {activeView === "courses" && "Enhance your skills with professional development courses"}
              {activeView === "saved" && "View and manage your bookmarked job opportunities"}
            </Typography>
          </Paper>

          {/* Dynamic Content */}
          <Zoom in={true} timeout={500}>
            <Box>
              {renderView()}
            </Box>
          </Zoom>
        </Container>
      </Box>

      {/* Enhanced SweetAlert2 Styles */}
      <style jsx global>{`
        /* Main logout popup styling */
        .jobseeker-logout-popup {
          border-radius: 20px !important;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
          border: none !important;
        }
        
        .jobseeker-logout-title {
          color: #1976d2 !important;
          font-weight: 700 !important;
          font-size: 1.75rem !important;
          margin-bottom: 0.75rem !important;
          line-height: 1.3 !important;
        }
        
        .jobseeker-logout-text {
          color: #555 !important;
          font-size: 1rem !important;
          line-height: 1.6 !important;
          margin-bottom: 2rem !important;
          font-weight: 400 !important;
        }
        
        /* Button container */
        .jobseeker-logout-actions {
          margin-top: 2rem !important;
          display: flex !important;
          justify-content: center !important;
          gap: 16px !important;
          flex-wrap: nowrap !important;
        }
        
        /* Confirm button (Logout) */
        .jobseeker-logout-confirm {
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%) !important;
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
        
        .jobseeker-logout-confirm:hover {
          background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4) !important;
        }
        
        .jobseeker-logout-confirm:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
        }
        
        /* Cancel button (Stay) */
        .jobseeker-logout-cancel {
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
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
        
        .jobseeker-logout-cancel:hover {
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(25, 118, 210, 0.4) !important;
        }
        
        .jobseeker-logout-cancel:active {
          transform: translateY(0) !important;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
        }
        
        /* Loading popup */
        .jobseeker-loading-popup {
          border-radius: 20px !important;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
        }
        
        /* Success popup */
        .jobseeker-success-popup {
          border-radius: 20px !important;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif !important;
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
          .jobseeker-logout-actions {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .jobseeker-logout-confirm,
          .jobseeker-logout-cancel {
            width: 100% !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default JobSeekerDashboard;