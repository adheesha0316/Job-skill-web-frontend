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
import axiosInstance from "../../Service/axiosOrder"; // Adjust the path as necessary
import Swal from "sweetalert2";

const EmployerEditForm = ({ open, onClose, employer }) => {
  const [formData, setFormData] = React.useState({ ...employer });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append("companyName", formData.companyName || "");
      form.append("contactNumber", formData.contactNumber || "");
      form.append("address", formData.address || "");

      if (formData.profileImageFile) {
        form.append("profileImageFile", formData.profileImageFile);
      }

      if (formData.licenseFile) {
        form.append("licenseFile", formData.licenseFile);
      }

      const response = await axiosInstance.put(
        `/employer/updateWithImage/${formData.employerId}`,  // Make sure your backend URL matches this
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add if your API needs auth
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Employer details updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update employer:", error.response || error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the employer. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Employer</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Company Name"
            name="companyName"
            fullWidth
            value={formData.companyName || ""}
            onChange={handleChange}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            fullWidth
            value={formData.contactNumber || ""}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={formData.address || ""}
            onChange={handleChange}
          />
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

          <label>Profile Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            name="profileImageFile"
            onChange={handleChange}
          />

          <label>License File (optional)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            name="licenseFile"
            onChange={handleChange}
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

export default EmployerEditForm;
