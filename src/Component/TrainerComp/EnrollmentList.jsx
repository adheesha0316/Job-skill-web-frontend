// EnrollmentList.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Stack
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "../../Service/axiosOder";

const EnrollmentList = ({ trainerId }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const statusColors = {
    active: { color: 'success', icon: CheckCircleIcon },
    pending: { color: 'warning', icon: PendingIcon },
    cancelled: { color: 'error', icon: CancelIcon },
    completed: { color: 'info', icon: CheckCircleIcon }
  };

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }
    fetchEnrollments();
  }, [trainerId]);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, statusFilter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/trainer/enrollments/by-trainer/${trainerId}`);
      console.log(response.data);
      setEnrollments(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
      setError("Failed to load enrollments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Filter by search term - using flat properties
    if (searchTerm) {
      filtered = filtered.filter(enroll =>
        enroll.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.seekerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(enroll => 
        (enroll.status || 'active').toLowerCase() === statusFilter
      );
    }

    setFilteredEnrollments(filtered);
  };

  const handleMenuOpen = (event, enrollment) => {
    setAnchorEl(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEnrollment(null);
  };

  const handleContactStudent = async (enrollment) => {
    if (!enrollment) return;

    const result = await Swal.fire({
      title: `Contact ${enrollment.seekerName}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Student:</strong> ${enrollment.seekerName || 'Unknown'}</p>
          <p><strong>Course:</strong> ${enrollment.courseTitle || 'Unknown Course'}</p>
          <p><strong>Email:</strong> ${enrollment.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${enrollment.contactNumber || 'Not provided'}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Close',
      confirmButtonColor: '#1976d2'
    });

    if (result.isConfirmed && enrollment.email) {
      window.open(`mailto:${enrollment.email}?subject=Regarding ${enrollment.courseTitle} Course`);
    }
    handleMenuClose();
  };

  const getStats = () => {
    const total = enrollments.length;
    const active = enrollments.filter(e => (e.status || 'active') === 'active').length;
    const pending = enrollments.filter(e => (e.status || 'active') === 'pending').length;
    const completed = enrollments.filter(e => (e.status || 'active') === 'completed').length;

    return { total, active, pending, completed };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Box>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="70%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Student Enrollments
        </Typography>
        <LoadingSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Student Enrollments
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchEnrollments} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  const stats = getStats();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <GroupsIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Student Enrollments
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage and track your student enrollments
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Enrollments
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
              {stats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Approval
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search students or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Showing {filteredEnrollments.length} of {enrollments.length} enrollments
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Enrollments Grid */}
      {filteredEnrollments.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <GroupsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {searchTerm || statusFilter !== 'all' ? 'No Matching Enrollments' : 'No Enrollments Yet'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Students will appear here once they enroll in your courses'}
          </Typography>
          {(searchTerm || statusFilter !== 'all') && (
            <Button 
              variant="outlined" 
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              sx={{ borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredEnrollments.map((enrollment, index) => {
            const status = enrollment.status || 'active';
            const StatusIcon = statusColors[status]?.icon || CheckCircleIcon;
            
            return (
              <Fade in={true} timeout={300 + index * 100} key={enrollment.enrollmentId}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Student Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            bgcolor: 'primary.light', 
                            width: 48, 
                            height: 48,
                            mr: 2
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {enrollment.seekerName || 'Unknown Student'}
                          </Typography>
                          <Chip 
                            icon={<StatusIcon />}
                            label={status.charAt(0).toUpperCase() + status.slice(1)}
                            size="small"
                            color={statusColors[status]?.color || 'default'}
                            variant="outlined"
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, enrollment)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Course Info */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Course
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {enrollment.courseTitle || 'Course information not available'}
                        </Typography>
                      </Box>

                      {/* Enrollment Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Enrolled: {formatDate(enrollment.enrollmentDate)}
                        </Typography>
                      </Box>

                      {/* Progress or Duration */}
                      {enrollment.progress && (
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {enrollment.progress}%
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: '100%',
                              height: 4,
                              bgcolor: 'grey.200',
                              borderRadius: 2,
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                width: `${enrollment.progress}%`,
                                height: '100%',
                                bgcolor: 'primary.main',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Fade>
            );
          })}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => handleContactStudent(selectedEnrollment)}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Contact Student</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <TrendingUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Progress</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EnrollmentList;