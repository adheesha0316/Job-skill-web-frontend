import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const UserRoleSelector = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [draggedFile, setDraggedFile] = useState(null);

  const handleOpenForm = (role) => {
    setSelectedRole(role);
    onSelectRole(role);
  };

  const handleClose = () => {
    setSelectedRole(null);
    setFormData({});
    setDraggedFile(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // file for input[type=file], else value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedFile(e.target.getAttribute('data-name'));
  };

  const handleDragLeave = () => {
    setDraggedFile(null);
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    setDraggedFile(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleRegister = () => {
    console.log("Form Submitted:", formData);

    // TODO: Send data using Axios & FormData for file uploads
    // const payload = new FormData();
    // for (let key in formData) {
    //   payload.append(key, formData[key]);
    // }
    // axios.post('/api/endpoint', payload)

    if (selectedRole === "JOBSEEKER") {
      window.location.href = "/jobseeker-dashboard";
    } else if (selectedRole === "EMPLOYER") {
      window.location.href = "/employer-dashboard";
    } else if (selectedRole === "TRAINER") {
      window.location.href = "/trainer-dashboard";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "JOBSEEKER":
        return "#2196F3";
      case "EMPLOYER":
        return "#FF6B6B";
      case "TRAINER":
        return "#4CAF50";
      default:
        return "#2196F3";
    }
  };

  const renderFileInput = (label, name) => {
    const roleColor = getRoleColor(selectedRole);
    const isFileSelected = formData[name];
    const isDragging = draggedFile === name;

    return (
      <Box mt={3}>
        <Typography variant="body2" fontWeight={600} mb={1.5} color="text.primary">
          {label}
        </Typography>
        <Box
          sx={{
            border: `2px dashed ${isDragging ? roleColor : '#e0e0e0'}`,
            borderRadius: 3,
            padding: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: isDragging ? `${roleColor}10` : isFileSelected ? `${roleColor}08` : '#fafafa',
            '&:hover': {
              borderColor: roleColor,
              backgroundColor: `${roleColor}08`,
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${roleColor}20`,
            },
            position: 'relative',
            overflow: 'hidden',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, name)}
        >
          <input
            name={name}
            type="file"
            accept="image/*,.pdf"
            onChange={handleChange}
            data-name={name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: `${roleColor}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: roleColor }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Box>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {isFileSelected ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: roleColor }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: roleColor }}>
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {formData[name].name}
                </Box>
              ) : (
                'Click to upload or drag and drop'
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {label.includes('PDF') ? 'PDF files or Images & file size <= 5mb' : 'Image files only & file size <= 5mb'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderFormFields = () => {
    const roleColor = getRoleColor(selectedRole);
    
    const textFieldStyles = {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 2px 8px ${roleColor}20`,
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${roleColor}20`,
        },
        '& fieldset': {
          borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
          borderColor: roleColor,
        },
        '&.Mui-focused fieldset': {
          borderColor: roleColor,
        },
      },
      '& .MuiInputLabel-root': {
        '&.Mui-focused': {
          color: roleColor,
        },
      },
    };

    switch (selectedRole) {
      case "JOBSEEKER":
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact_number"
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your contact number"
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Experience"
              name="experience"
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              placeholder="Describe your work experience..."
              sx={textFieldStyles}
            />
            {renderFileInput("Resume (PDF)", "resumePath")}
            {renderFileInput("Profile Image", "profileImage")}
          </Box>
        );
      case "EMPLOYER":
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your company name"
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              onChange={handleChange}
              margin="normal"
              placeholder="Enter contact number"
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Enter your company address..."
              sx={textFieldStyles}
            />
            {renderFileInput("Profile Image", "profileImage")}
          </Box>
        );
      case "TRAINER":
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your qualifications"
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your contact number"
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Experience"
              name="experience"
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              placeholder="Describe your teaching/training experience..."
              sx={textFieldStyles}
            />
            <TextField
              select
              fullWidth
              label="Course Category"
              name="courseCategory"
              onChange={handleChange}
              margin="normal"
              sx={textFieldStyles}
            >
              <MenuItem value="">Select a category</MenuItem>
              <MenuItem value="IT">IT & Technology</MenuItem>
              <MenuItem value="Marketing">Marketing & Sales</MenuItem>
              <MenuItem value="Finance">Finance & Accounting</MenuItem>
              <MenuItem value="Design">Design & Creative</MenuItem>
            </TextField>
            {renderFileInput("Profile Image", "profileImage")}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: 4,
          maxWidth: 400,
          opacity: 0.95,
          margin: "40px auto",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
          sx={{
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Choose Registration Type
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={4} sx={{ opacity: 0.8 }}>
          Select your role to get started with the platform
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            onClick={() => handleOpenForm("JOBSEEKER")}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            JobSeeker
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<BusinessIcon />}
            onClick={() => handleOpenForm("EMPLOYER")}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Employer
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<SchoolIcon />}
            onClick={() => handleOpenForm("TRAINER")}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Trainer
          </Button>
        </Box>
      </Paper>

      <Dialog 
        open={Boolean(selectedRole)} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(45deg, ${getRoleColor(selectedRole)} 30%, ${getRoleColor(selectedRole)}CC 90%)`,
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {selectedRole === "JOBSEEKER" && <PersonIcon />}
          {selectedRole === "EMPLOYER" && <BusinessIcon />}
          {selectedRole === "TRAINER" && <SchoolIcon />}
          Register as {selectedRole}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {renderFormFields()}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleRegister}
            sx={{
              background: `linear-gradient(45deg, ${getRoleColor(selectedRole)} 30%, ${getRoleColor(selectedRole)}CC 90%)`,
              fontWeight: 600,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                boxShadow: `0 4px 12px ${getRoleColor(selectedRole)}40`,
              }
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserRoleSelector;