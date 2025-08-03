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

const TrainerEditForm = ({ open, onClose, trainer }) => {
  const [formData, setFormData] = React.useState({ ...trainer });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // file input
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("qualification", formData.qualification || "");
      form.append("contactNumber", formData.contactNumber || "");
      form.append("experience", formData.experience || "");
      form.append("courseCategory", formData.courseCategory || "");

      if (formData.profileImage && formData.profileImage instanceof File) {
        form.append("profileImage", formData.profileImage);
      }

      const response = await axiosInstance.put(
        `/trainer/profile/update/${formData.trainerId}`,
        form,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Trainer updated successfully:", response.data);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Trainer details updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update Trainer:", error.response || error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the trainer.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Trainer</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Qualification"
            name="qualification"
            fullWidth
            value={formData.qualification || ""}
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
            label="Experience"
            name="experience"
            fullWidth
            value={formData.experience || ""}
            onChange={handleChange}
          />
          <TextField
            label="Course Category"
            name="courseCategory"
            fullWidth
            value={formData.courseCategory || ""}
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

          <input
            accept="image/*"
            type="file"
            name="profileImage"
            onChange={handleChange}
            style={{ marginTop: 16 }}
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

export default TrainerEditForm;
