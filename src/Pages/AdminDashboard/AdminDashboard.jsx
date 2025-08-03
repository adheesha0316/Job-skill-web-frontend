import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Grid,
  Avatar,
  TextField,
  Stack,
  Card,
  CardContent,
  Badge,
  Divider,
  InputAdornment,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Logout,
  Menu as MenuIcon,
  People,
  Business,
  School,
  Work,
  Class,
  PlaylistAddCheck,
  Edit,
  Delete,
  Visibility,
  Search,
  PersonAdd,
  BusinessCenter,
  SchoolOutlined,
  Phone,
  Email,
  LocationOn,
  Description,
  StarRate,
  AccountCircle,
  Assignment,
  Category,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Service/axiosOder";
import EmployerEditForm from "../../Component/AdminComp/EmployerEditForm";
import JobSeekerEditForm from "../../Component/AdminComp/JobSeekerEditForm";
import TrainerEditForm from "../../Component/AdminComp/TrainerEditForm";

// Helper: Get Authorization Header
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// API Functions
const API = {
  // Job Seeker APIs
  getAllJobSeekers: async () => {
    try {
      const res = await axiosInstance.get("/seeker/getAll", getAuthConfig());
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch job seekers:", err);
      return [];
    }
  },

  deleteJobSeeker: async (seekerId) => {
    try {
      const res = await axiosInstance.delete(
        `/seeker/delete/${seekerId}`,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      console.error("Failed to delete job seeker:", err);
      return null;
    }
  },

  // Employer APIs
  getAllEmployers: async () => {
    try {
      const res = await axiosInstance.get(
        "/employer/getAll/allWithImage",
        getAuthConfig()
      );
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch employers:", err);
      return [];
    }
  },

  deleteEmployer: async (employerId) => {
    try {
      const res = await axiosInstance.delete(
        `/employer/deleteWithImage/${employerId}`,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      console.error("Failed to delete employer:", err);
      return null;
    }
  },

  // Trainer APIs
  getAllTrainers: async () => {
    try {
      const res = await axiosInstance.get("/trainer/getAll", getAuthConfig());
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch trainers:", err);
      return [];
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const res = await axiosInstance.delete(
        `/trainer/delete/${trainerId}`,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      console.error("Failed to delete trainer:", err);
      return null;
    }
  },

  // Jobs and Courses
  getAllJobs: async () => {
    try {
      const res = await axiosInstance.get("/job/getAll", getAuthConfig());
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      return [];
    }
  },

  getAllCourses: async () => {
    try {
      const res = await axiosInstance.get("/seeker/courses", getAuthConfig());
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      return [];
    }
  },

  getAllApplications: async () => {
    try {
      const res = await axiosInstance.get(
        "/seeker/applications/getAll",
        getAuthConfig()
      );
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      return [];
    }
  },

  // Admin Stats
  getAdminStats: async () => {
    try {
      const [jobSeekers, employers, trainers, jobs, courses, applications] =
        await Promise.all([
          API.getAllJobSeekers(),
          API.getAllEmployers(),
          API.getAllTrainers(),
          API.getAllJobs(),
          API.getAllCourses(),
          API.getAllApplications(),
        ]);

      return {
        jobseekers: Array.isArray(jobSeekers) ? jobSeekers.length : 0,
        employers: Array.isArray(employers) ? employers.length : 0,
        trainers: Array.isArray(trainers) ? trainers.length : 0,
        totaljobs: Array.isArray(jobs) ? jobs.length : 0,
        totalcourses: Array.isArray(courses) ? courses.length : 0,
        totalapplications: Array.isArray(applications)
          ? applications.length
          : 0,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        jobseekers: 0,
        employers: 0,
        trainers: 0,
        totaljobs: 0,
        totalcourses: 0,
        totalapplications: 0,
      };
    }
  },
};

const menuItems = [
  { label: "Job Seekers", icon: <People />, color: "#1976d2" },
  { label: "Employers", icon: <Business />, color: "#388e3c" },
  { label: "Trainers", icon: <School />, color: "#f57c00" },
];

const AdminDashboard = ({ onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState({
    jobSeekers: [],
    employers: [],
    trainers: [],
    counts: {
      jobseekers: 0,
      employers: 0,
      trainers: 0,
      totaljobs: 0,
      totalcourses: 0,
      totalapplications: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editType, setEditType] = useState(""); // 'jobseeker', 'employer', 'trainer'

  const drawerWidth = 280;
  const collapsedDrawerWidth = 80;
  const navigate = useNavigate();

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [jobSeekers, employers, trainers, stats] = await Promise.all([
        API.getAllJobSeekers(),
        API.getAllEmployers(),
        API.getAllTrainers(),
        API.getAdminStats(),
      ]);

      setData({
        jobSeekers: Array.isArray(jobSeekers) ? jobSeekers : [],
        employers: Array.isArray(employers) ? employers : [],
        trainers: Array.isArray(trainers) ? trainers : [],
        counts: stats,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setError("Failed to load dashboard data. Please try again.");

      Swal.fire({
        title: "Error!",
        text: "Failed to load dashboard data. Please refresh the page.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will be redirected to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        if (onLogout) onLogout();
        navigate("/login");

        Swal.fire({
          title: "Logged out!",
          text: "See you soon!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    });
  };

  // Function to call when button clicked
  const handleRestrictedFeature = () => {
    Swal.fire({
      icon: "info",
      title: "Not Available",
      text: "This feature is not available here. Employers, Job Seekers, and Trainers must register through the login system.",
      confirmButtonText: "Got it!",
    });
  };

  // Handle delete action
  const handleDelete = async (type, id) => {
    const confirm = await Swal.fire({
      title: `Delete this ${type}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (confirm.isConfirmed) {
      try {
        switch (type) {
          case "jobseeker":
            await API.deleteJobSeeker(id);
            break;
          case "employer":
            await API.deleteEmployer(id);
            break;
          case "trainer":
            await API.deleteTrainer(id);
            break;
          default:
            throw new Error("Invalid type");
        }

        Swal.fire({
          title: "Deleted!",
          text: `${type} has been deleted successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchData();
      } catch (err) {
        console.error("Deletion failed:", err);
        Swal.fire(
          "Error!",
          `Failed to delete ${type}. ${
            err.response?.data?.message || "Please try again."
          }`,
          "error"
        );
      }
    }
  };

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  // Handle edit action
  const handleEdit = (type, data) => {
    setSelectedUser(data);
    setEditType(type);
    setEditModalOpen(true);
  };

  // Filter data based on search term
  const getFilteredData = () => {
    const currentData = [data.jobSeekers, data.employers, data.trainers][
      tabIndex
    ];

    if (!currentData || !Array.isArray(currentData)) {
      return [];
    }

    return currentData.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.companyName &&
          item.companyName.toLowerCase().includes(searchLower)) ||
        (item.email && item.email.toLowerCase().includes(searchLower)) ||
        (item.contactNumber &&
          item.contactNumber.toLowerCase().includes(searchLower)) ||
        (item.contact_number &&
          item.contact_number.toLowerCase().includes(searchLower))
      );
    });
  };

  // Render table headers based on tab
  const getTableHeaders = () => {
    switch (tabIndex) {
      case 0: // Job Seekers
        return ["Profile", "Contact", "Experience", "Status", "Actions"];
      case 1: // Employers
        return ["Company", "Contact", "Address", "Jobs", "Status", "Actions"];
      case 2: // Trainers
        return [
          "Profile",
          "Contact",
          "Qualification",
          "Experience",
          "Category",
          "Status",
          "Actions",
        ];
      default:
        return [];
    }
  };

  // Render job seeker row
  const renderJobSeekerRow = (row) => (
    <TableRow
      key={row.seekerId || row.id}
      hover
      sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={row.profileImage} sx={{ width: 40, height: 40 }}>
            {row.name ? row.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {row.name || "N/A"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.seekerId || row.id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2">
              {row.user?.email || row.email || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">
              {row.contactNumber || "N/A"}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Chip
          label={row.experience || "Not specified"}
          variant="outlined"
          size="small"
          icon={<StarRate />}
          sx={{ bgcolor: "#e3f2fd" }}
        />
      </TableCell>
      <TableCell>
        <Chip label="Active" color="success" size="small" variant="filled" />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewDetails(row)}
              sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleEdit("jobseeker", row)}
              sx={{ "&:hover": { bgcolor: "#fff3e0" } }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete("jobseeker", row.seekerId || row.id)}
              sx={{ "&:hover": { bgcolor: "#ffebee" } }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );

  // Render employer row
  const renderEmployerRow = (row) => (
    <TableRow
      key={row.employerId || row.id}
      hover
      sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={row.profileImage} sx={{ width: 40, height: 40 }}>
            {row.companyName ? row.companyName.charAt(0).toUpperCase() : "C"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {row.companyName || "N/A"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.employerId || row.id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2">
              {row.user?.email || row.email || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">
              {row.contactNumber || "N/A"}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
            {row.address || "N/A"}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {row.jobs && Array.isArray(row.jobs) ? (
            <>
              {row.jobs.slice(0, 2).map((job, index) => (
                <Chip
                  key={index}
                  label={job.title || job}
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: "#e8f5e8" }}
                />
              ))}
              {row.jobs.length > 2 && (
                <Chip
                  label={`+${row.jobs.length - 2} more`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </>
          ) : (
            <Chip label="No jobs" size="small" variant="outlined" />
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <Chip label="Active" color="success" size="small" variant="filled" />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewDetails(row)}
              sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleEdit("employer", row)}
              sx={{ "&:hover": { bgcolor: "#fff3e0" } }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete("employer", row.employerId || row.id)}
              sx={{ "&:hover": { bgcolor: "#ffebee" } }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );

  // Render trainer row
  const renderTrainerRow = (row) => (
    <TableRow
      key={row.trainerId || row.id}
      hover
      sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
    >
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={row.profileImage} sx={{ width: 40, height: 40 }}>
            {row.name ? row.name.charAt(0).toUpperCase() : "T"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {row.name || "N/A"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.trainerId || row.id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2">
              {row.user?.email || row.email || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">
              {row.contactNumber || "N/A"}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SchoolOutlined fontSize="small" color="action" />
          <Typography variant="body2">{row.qualification || "N/A"}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={row.experience || "Not specified"}
          variant="outlined"
          size="small"
          icon={<StarRate />}
          sx={{ bgcolor: "#e3f2fd" }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={row.courseCategory || "General"}
          size="small"
          variant="outlined"
          icon={<Category />}
          sx={{ bgcolor: "#fff3e0" }}
        />
      </TableCell>
      <TableCell>
        <Chip label="Active" color="success" size="small" variant="filled" />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewDetails(row)}
              sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="warning"
              size="small"
              onClick={() => handleEdit("trainer", row)}
              sx={{ "&:hover": { bgcolor: "#fff3e0" } }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete("trainer", row.trainerId || row.id)}
              sx={{ "&:hover": { bgcolor: "#ffebee" } }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );

  // Render table rows
  const renderTableRows = () => {
    const filteredData = getFilteredData();
    const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    if (loading) {
      return (
        <TableRow>
          <TableCell
            colSpan={getTableHeaders().length}
            align="center"
            sx={{ py: 4 }}
          >
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading data...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={getTableHeaders().length}
            align="center"
            sx={{ py: 4 }}
          >
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? "No results found"
                : `No ${menuItems[tabIndex].label.toLowerCase()} found`}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    switch (tabIndex) {
      case 0:
        return paginatedData.map(renderJobSeekerRow);
      case 1:
        return paginatedData.map(renderEmployerRow);
      case 2:
        return paginatedData.map(renderTrainerRow);
      default:
        return [];
    }
  };

  // Render details dialog
  const renderDetailsDialog = () => {
    if (!selectedItem) return null;

    return (
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={selectedItem.profileImage}
              sx={{ width: 50, height: 50 }}
            >
              {(selectedItem.name || selectedItem.companyName)
                ?.charAt(0)
                .toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedItem.name || selectedItem.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {menuItems[tabIndex].label} Details
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">
                      {selectedItem.user?.email || selectedItem.email || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">
                      {selectedItem.contactNumber || "N/A"}
                    </Typography>
                  </Box>
                  {selectedItem.address && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">
                        {selectedItem.address}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Additional Information
                </Typography>
                <Stack spacing={1}>
                  {selectedItem.experience && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StarRate fontSize="small" color="action" />
                      <Typography variant="body2">
                        Experience: {selectedItem.experience}
                      </Typography>
                    </Box>
                  )}
                  {selectedItem.qualification && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SchoolOutlined fontSize="small" color="action" />
                      <Typography variant="body2">
                        Qualification: {selectedItem.qualification}
                      </Typography>
                    </Box>
                  )}
                  {selectedItem.courseCategory && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category fontSize="small" color="action" />
                      <Typography variant="body2">
                        Category: {selectedItem.courseCategory}
                      </Typography>
                    </Box>
                  )}
                  {selectedItem.resumePath && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Description fontSize="small" color="action" />
                      <Typography variant="body2">Resume: Available</Typography>
                    </Box>
                  )}
                  {selectedItem.jobs && Array.isArray(selectedItem.jobs) && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Jobs:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mt: 1 }}
                      >
                        {selectedItem.jobs.map((job, index) => (
                          <Chip
                            key={index}
                            label={job.title || job}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Show loading state for initial load
  if (loading && data.jobSeekers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography variant="h6">Loading Dashboard...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          transition: "width 0.3s ease-in-out",
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
            bgcolor: "#1e293b",
            color: "white",
            borderRight: "none",
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar
          sx={{
            bgcolor: "#0f172a",
            justifyContent: drawerOpen ? "space-between" : "center",
          }}
        >
          {drawerOpen && (
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#38bdf8" }}
            >
              Admin Panel
            </Typography>
          )}
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: "#334155" }} />

        {/* User Profile Section */}
        <Box sx={{ p: drawerOpen ? 2 : 1, textAlign: "center" }}>
          <Avatar
            sx={{
              width: drawerOpen ? 60 : 40,
              height: drawerOpen ? 60 : 40,
              bgcolor: "#1976d2",
              mx: "auto",
              mb: drawerOpen ? 1 : 0,
              transition: "all 0.3s ease",
            }}
          >
            A
          </Avatar>
          {drawerOpen && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                Administrator
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                Super Admin
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ borderColor: "#334155" }} />

        <List sx={{ pt: 2, px: 1 }}>
          {menuItems.map((item, index) => (
            <Tooltip
              key={item.label}
              title={!drawerOpen ? item.label : ""}
              placement="right"
              arrow
            >
              <ListItem
                button
                selected={tabIndex === index}
                onClick={() => setTabIndex(index)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: drawerOpen ? 2 : 1,
                  "&.Mui-selected": {
                    bgcolor: item.color,
                    "&:hover": { bgcolor: item.color },
                  },
                  "&:hover": { bgcolor: "#334155" },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 0,
                    mr: drawerOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && (
                  <>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                    <Chip
                      label={
                        data.counts[
                          item.label.toLowerCase().replace(" ", "")
                        ] || 0
                      }
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        minWidth: 24,
                        height: 20,
                        fontSize: "0.75rem",
                      }}
                    />
                  </>
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>

        {/* Bottom Section */}
        <Box sx={{ mt: "auto", p: drawerOpen ? 2 : 1 }}>
          <Divider sx={{ borderColor: "#334155", mb: 2 }} />
          <Tooltip
            title={!drawerOpen ? "Settings" : ""}
            placement="right"
            arrow
          >
            <IconButton
              sx={{
                color: "white",
                width: "100%",
                justifyContent: drawerOpen ? "flex-start" : "center",
                px: drawerOpen ? 2 : 0,
              }}
            >
              <Assignment />
              {drawerOpen && (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Settings
                </Typography>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {/* Header */}
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Welcome Back, Admin
              </Typography>
              <Chip
                label={drawerOpen ? "Expanded" : "Collapsed"}
                size="small"
                variant="outlined"
                sx={{ ml: 2, borderRadius: 1 }}
              />
            </Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Badge badgeContent={4} color="error">
                <IconButton>
                  <People />
                </IconButton>
              </Badge>
              <Avatar sx={{ bgcolor: "#1976d2" }}>A</Avatar>
              <Button
                variant="contained"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, backgroundColor: "#e0f7fa" }}>
                <Typography variant="h6">Total Job Seekers</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.jobseekers || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, backgroundColor: "#fce4ec" }}>
                <Typography variant="h6">Total Employers</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.employers || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, backgroundColor: "#fff9c4" }}>
                <Typography variant="h6">Total Trainers</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.trainers || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Total Jobs</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.totaljobs || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Total Courses</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.totalcourses || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Total Applications</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.counts.totalapplications || 0}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Table Section */}
          <Card sx={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {menuItems[tabIndex].label} Management
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    placeholder="Search..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ minWidth: 250 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleRestrictedFeature}
                    startIcon={
                      tabIndex === 0 ? (
                        <PersonAdd />
                      ) : tabIndex === 1 ? (
                        <BusinessCenter />
                      ) : (
                        <SchoolOutlined />
                      )
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    Add New
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={fetchData}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading ? <CircularProgress size={20} /> : "Refresh"}
                  </Button>
                </Stack>
              </Stack>

              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #e2e8f0" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      {getTableHeaders().map((header) => (
                        <TableCell
                          key={header}
                          sx={{ fontWeight: "bold", color: "#374151" }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={getFilteredData().length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                sx={{ borderTop: "1px solid #e2e8f0", mt: 2 }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Dynamic Edit Form Rendering */}
        {editModalOpen && editType === "jobseeker" && (
          <JobSeekerEditForm
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            seeker={selectedUser}
            onUpdate={fetchData} // Pass fetchData to refresh after update
          />
        )}

        {editModalOpen && editType === "employer" && (
          <EmployerEditForm
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            employer={selectedUser}
            onUpdate={fetchData}
          />
        )}

        {editModalOpen && editType === "trainer" && (
          <TrainerEditForm
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            trainer={selectedUser}
            onUpdate={fetchData}
          />
        )}

        {renderDetailsDialog()}
      </Box>

      {/* Custom Styles */}
      <style jsx global>{`
        .swal-confirm-btn {
          background-color: #dc2626 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 20px !important;
          font-weight: 600 !important;
        }
        .swal-cancel-btn {
          background-color: #6b7280 !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 20px !important;
          font-weight: 600 !important;
        }
        .swal2-popup {
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
        .swal2-title {
          color: #374151 !important;
          font-weight: 600 !important;
        }
        .swal2-content {
          color: #6b7280 !important;
        }
        .swal2-icon.swal2-warning {
          border-color: #f59e0b !important;
          color: #f59e0b !important;
        }
        .swal2-icon.swal2-success {
          border-color: #10b981 !important;
          color: #10b981 !important;
        }
        .swal2-icon.swal2-error {
          border-color: #ef4444 !important;
          color: #ef4444 !important;
        }
      `}</style>
    </Box>
  );
};

export default AdminDashboard;
