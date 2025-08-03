import React, { useState, useEffect } from "react";
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
import axiosInstance from "../../Service/axiosOder"; 

const JobEditForm = ({ open, onClose, job, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    salary: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        jobType: job.jobType || "",
        salary: job.salary || "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("jobType", formData.jobType);
      form.append("salary", formData.salary);

      if (logoFile) {
        form.append("logoFile", logoFile);
      }

      await axiosInstance.put(`/job/update/${job.jobId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Updated!",
        text: "Job updated successfully.",
        icon: "success",
        confirmButtonColor: "#4caf50",
        timer: 2000,
        timerProgressBar: true,
      });

      onClose();
      if (onSuccess) onSuccess(); // Optionally refresh job list
    } catch (error) {
      console.error("Error updating job:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update job. Please try again.",
        icon: "error",
        confirmButtonColor: "#f44336",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Job Type"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Upload Logo
            <input
              type="file"
              hidden
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobEditForm;
