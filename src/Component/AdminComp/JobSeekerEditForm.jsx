import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOrder"; // Adjust the path as necessary

const JobSeekerEditForm = ({ open, onClose, seeker }) => {
  const [formData, setFormData] = React.useState({ ...seeker });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("contactNumber", formData.contactNumber);
    form.append("experience", formData.experience);

    if (formData.resumeFile) {
      form.append("resumeFile", formData.resumeFile);
    }
    if (formData.profileImageFile) {
      form.append("profileImageFile", formData.profileImageFile);
    }

    try {
      const response = await axiosInstance.put(
        `/seeker/update/${formData.seekerId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 👈 Add token here
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Job Seeker details updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update JobSeeker:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the job seeker.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Job Seeker</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Contact Number"
            name="contactNumber"
            fullWidth
            value={formData.contactNumber || ""}
            onChange={handleChange}
          />
          <TextField
            label="Experience"
            name="experience"
            fullWidth
            value={formData.experience || ""}
            onChange={handleChange}
          />

          {/* Read-only Fields */}
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formData.email || ""}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="User Name"
            name="userName"
            fullWidth
            value={formData.userName || ""}
            InputProps={{ readOnly: true }}
          />

          {/* Optional File Uploads */}
          <label>Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            name="resumeFile"
            onChange={handleFileChange}
          />

          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            name="profileImageFile"
            onChange={handleFileChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobSeekerEditForm;
