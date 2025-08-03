// src/pages/ChooseRole/ChooseRole.jsx

import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
} from "@mui/material";

const roles = ["EMPLOYER", "JOBSEEKER", "TRAINER", "GUEST"];

const ChooseRole = ({ onRoleChange }) => {
  const handleSelectRole = (role) => {
    localStorage.setItem("role", role); // Save role to localStorage
    onRoleChange(role); // Notify parent to update state
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Choose Your Role
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={4}>
          Select how you'd like to use the platform
        </Typography>

        <Stack spacing={2}>
          {roles.map((role) => (
            <Button
              key={role}
              variant="contained"
              fullWidth
              onClick={() => handleSelectRole(role)}
            >
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default ChooseRole;
