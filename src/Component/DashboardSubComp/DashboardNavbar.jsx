import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Work as JobsIcon,
  PostAdd as PostJobIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

const DashboardNavbar = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        if (onLogout) onLogout();
        navigate("/Login");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      }
    });
  };

  const navItems = [
    { label: "Home", path: "/dashboard", icon: <HomeIcon fontSize="small" /> },
    { label: "Jobs", path: "/jobs", icon: <JobsIcon fontSize="small" /> },
    {
      label: "Post a Job",
      path: "/post-job",
      icon: <PostJobIcon fontSize="small" />,
    },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(135deg,rgb(155, 170, 255) 0%,rgb(7, 114, 255) 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 70,
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            cursor: "pointer",
            background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.5px",
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.2s ease",
            },
          }}
          onClick={() => navigate("/")}
        >
          Job.lk
        </Typography>

        {/* Nav Links (hidden on small screens) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* User Info */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: "#ffffff",
                    color: "#667eea",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {username?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              }
              label={username || "User"}
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            />

            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                px: 2,
                py: 0.8,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.5)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Mobile Avatar */}
          <Avatar
            sx={{
              bgcolor: "#ffffff",
              color: "#667eea",
              fontWeight: 700,
              display: { xs: "flex", sm: "none" },
              width: 40,
              height: 40,
            }}
          >
            {username?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          {/* Hamburger menu on mobile */}
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "inherit",
              ml: 1,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.15)",
              },
            }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                minWidth: 200,
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              },
            }}
          >
            {/* User info in mobile menu */}
            <Box sx={{ px: 2, py: 1, display: { xs: "block", sm: "none" } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <PersonIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  {username || "User"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
            </Box>

            {navItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  handleMenuClose();
                }}
                sx={{
                  gap: 1.5,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                {item.icon}
                <Typography variant="body2" fontWeight={500}>
                  {item.label}
                </Typography>
              </MenuItem>
            ))}

            <Divider sx={{ mx: 1 }} />

            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
              sx={{
                gap: 1.5,
                py: 1.5,
                color: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              <LogoutIcon />
              <Typography variant="body2" fontWeight={500}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
