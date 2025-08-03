import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  IconButton,
  Container,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowForwardIos, 
  ArrowBackIos, 
  LocationOn,
  Business,
  Schedule
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-8px)',
    borderColor: theme.palette.primary.main,
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  width: 48,
  height: 48,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'scale(1.1)',
  },
  '&:disabled': {
    opacity: 0.4,
    transform: 'none',
  },
  transition: 'all 0.2s ease-in-out',
}));

const CompanyLogo = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  objectFit: 'contain',
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.5),
  backgroundColor: theme.palette.background.paper,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  color: theme.palette.text.primary,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const FeaturedJobs = ({ jobs = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [startIndex, setStartIndex] = React.useState(0);
  
  // Determine how many jobs to show based on screen size
  const getJobsPerPage = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  };
  
  const jobsPerPage = getJobsPerPage();
  const visibleJobs = jobs.slice(startIndex, startIndex + jobsPerPage);
  
  const handlePrevious = () => {
    setStartIndex(Math.max(startIndex - jobsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex(Math.min(startIndex + jobsPerPage, jobs.length - jobsPerPage));
  };

  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex + jobsPerPage < jobs.length;

  if (!jobs || jobs.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No featured jobs available at the moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <SectionTitle variant="h4" component="h2">
          Featured Jobs
        </SectionTitle>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Discover exciting opportunities from top companies
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 3,
        position: 'relative',
        minHeight: 280
      }}>
        {/* Previous Button */}
        <NavigationButton
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label="Previous jobs"
        >
          <ArrowBackIos />
        </NavigationButton>

        {/* Jobs Grid */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid container spacing={3}>
            {visibleJobs.map((job, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={jobsPerPage === 2 ? 6 : 3}
                key={job.id || index}
              >
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    {/* Company Logo and Info */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: 2,
                      mb: 2 
                    }}>
                      <CompanyLogo 
                        src={job.logo} 
                        alt={`${job.company} logo`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mb: 0.5
                          }}
                        >
                          <Business fontSize="small" />
                          {job.company}
                        </Typography>
                        {job.type && (
                          <Chip 
                            label={job.type} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    {/* Job Title */}
                    <Typography 
                      variant="h6" 
                      fontWeight={600}
                      sx={{ 
                        mb: 2,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '2.6em',
                        color: 'text.primary'
                      }}
                    >
                      {job.title}
                    </Typography>
                    
                    {/* Job Details */}
                    <Stack spacing={1}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <LocationOn fontSize="small" />
                        {job.location}
                      </Typography>
                      
                      {job.salary && (
                        <Typography 
                          variant="body2" 
                          color="primary.main"
                          fontWeight={600}
                        >
                          {job.salary}
                        </Typography>
                      )}
                      
                      {job.posted && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Schedule fontSize="small" />
                          Posted {job.posted}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Next Button */}
        <NavigationButton
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next jobs"
        >
          <ArrowForwardIos />
        </NavigationButton>
      </Box>
      
      {/* Pagination Dots */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 3,
        gap: 1
      }}>
        {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: Math.floor(startIndex / jobsPerPage) === index 
                ? 'primary.main' 
                : 'action.disabled',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                transform: 'scale(1.2)',
              }
            }}
            onClick={() => setStartIndex(index * jobsPerPage)}
          />
        ))}
      </Box>
    </Container>
  );
};

export default FeaturedJobs;