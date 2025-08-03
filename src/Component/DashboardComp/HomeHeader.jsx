import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  TrendingUp as TrendingIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import DashboardNavbar from "../DashboardSubComp/DashboardNavbar";
import UserRoleSelector from "../UserRoleSelector/UserRoleSelector";

const HomeHeader = ({ username, onLogout }) => {
  const [resultsCount] = useState(247); // This would come from your job data

  const quickStats = [
    {
      label: "Total Jobs",
      value: "1,247",
      icon: <WorkIcon />,
      color: "#667eea",
    },
    {
      label: "New Today",
      value: "23",
      icon: <TrendingIcon />,
      color: "#4CAF50",
    },
    {
      label: "Companies",
      value: "156",
      icon: <PeopleIcon />,
      color: "#FF9800",
    },
    {
      label: "Applications",
      value: "89",
      icon: <StarIcon />,
      color: "#E91E63",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Box>
      <DashboardNavbar username={username} onLogout={onLogout} />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg,rgb(156, 174, 255) 0%,rgb(21, 161, 255) 100%)",
          color: "white",
          py: 6,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mb: 4,
              fontSize: { xs: "2rem", md: "3rem" },
              background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {getGreeting()}, {username}! 👋
          </Typography>

          {/* Main Flex Layout: CardContent + UserRoleSelector */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "stretch",
              justifyContent: "center",
              mt: 4,
            }}
          >
            {/* Left CardContent */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                p: 3,
                backgroundColor: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
                minWidth: 0,
              }}
              elevation={0}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.95,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    fontWeight: 400,
                    mb: 3,
                  }}
                >
                  Discover your next career move among thousands of exciting job
                  opportunities. Whether you're just starting out or looking to
                  advance, our platform connects you with top companies and
                  trending roles. Explore new positions, apply with ease, and
                  take the next step toward your professional goals.
                </Typography>

                {/* Quick Stats */}
                <Box>
                  <Typography variant="h4" fontWeight={600} sx={{ mb: 4 }}>
                    Quick Stats
                  </Typography>
                  <Grid container spacing={2}>
                    {quickStats.map((stat, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                          sx={{
                            textAlign: "center",
                            p: 4,
                            boxShadow: 6,
                            borderRadius: 2,
                            minHeight: 170,
                            minWidth: 160,
                            transition: "transform 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                            },
                          }}
                        >
                          <Box sx={{ color: stat.color, mb: 2, fontSize: 48 }}>
                            {stat.icon}
                          </Box>
                          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {stat.label}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Right UserRoleSelector as Card */}
            <Card
              sx={{
                width: { xs: "100%", md: 320 },
                borderRadius: 3,
                maxWidth: 750,
                p: 3,
                backgroundColor: "rgba(255,255,255,0.13)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              elevation={0}
            >
              <UserRoleSelector />
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeHeader;
