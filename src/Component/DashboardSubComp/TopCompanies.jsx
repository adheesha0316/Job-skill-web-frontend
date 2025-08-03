import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  Chip,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Skeleton
} from '@mui/material';
import { 
  Business, 
  WorkOutline, 
  Star,
  TrendingUp,
  ArrowForward
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCompanyCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  height: '100%',
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
  },
  
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    
    '&::before': {
      transform: 'translateX(0)',
    },
    
    '& .company-logo': {
      transform: 'scale(1.1)',
    },
    
    '& .view-jobs-btn': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}));

const CompanyLogo = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(0.5),
  border: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: -2,
    borderRadius: theme.spacing(1.5),
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  
  '&:hover::after': {
    opacity: 1,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
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

const ViewJobsButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  minWidth: 'auto',
  padding: theme.spacing(0.5, 1),
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease',
  fontSize: '0.7rem',
  fontWeight: 600,
}));

const TopCompanies = ({ companies = [], loading = false, showViewAll = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [viewAll, setViewAll] = React.useState(false);
  
  const displayedCompanies = viewAll ? companies : companies.slice(0, 8);
  
  const handleCompanyClick = (company) => {
    // Handle company click - could navigate to company page
    console.log('Company clicked:', company);
  };

  const CompanyCardSkeleton = () => (
    <Grid item xs={6} sm={4} md={3}>
      <Card sx={{ p: 2.5, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={56} height={56} sx={{ mr: 2, borderRadius: 1.5 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </Grid>
      </Container>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No companies available at the moment.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <SectionTitle variant="h4" component="h2">
              Top Companies
            </SectionTitle>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Explore opportunities at leading organizations
            </Typography>
          </Box>
          
          {showViewAll && companies.length > 8 && (
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => setViewAll(!viewAll)}
              sx={{ mt: 1 }}
            >
              {viewAll ? 'Show Less' : 'View All'}
            </Button>
          )}
        </Stack>
      </Box>
      
      <Grid container spacing={3}>
        {displayedCompanies.map((company, index) => (
          <Grid item xs={6} sm={4} md={3} key={company.id || index}>
            <StyledCompanyCard onClick={() => handleCompanyClick(company)}>
              <ViewJobsButton
                className="view-jobs-btn"
                variant="contained"
                size="small"
                endIcon={<ArrowForward fontSize="small" />}
              >
                View Jobs
              </ViewJobsButton>
              
              {/* Company Logo */}
              <CompanyLogo className="company-logo">
                {company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    width={48} 
                    height={48}
                    style={{ 
                      objectFit: 'contain',
                      borderRadius: '8px',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                    <Business />
                  </Avatar>
                )}
              </CompanyLogo>
              
              {/* Company Info */}
              <CardContent sx={{ 
                p: 0, 
                flex: 1,
                minWidth: 0,
                '&:last-child': { pb: 0 }
              }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={600}
                  sx={{ 
                    mb: 0.5,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'text.primary'
                  }}
                >
                  {company.name}
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <WorkOutline fontSize="small" color="action" />
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {company.jobPosts} {company.jobPosts === 1 ? 'Job' : 'Jobs'}
                  </Typography>
                </Stack>
                
                {/* Additional Info */}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {company.featured && (
                    <Chip 
                      label="Featured" 
                      size="small" 
                      color="primary"
                      variant="filled"
                      sx={{ 
                        height: 18, 
                        fontSize: '0.6rem',
                        fontWeight: 600
                      }}
                    />
                  )}
                  
                  {company.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 12, color: 'warning.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {company.rating}
                      </Typography>
                    </Box>
                  )}
                  
                  {company.trending && (
                    <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                  )}
                </Stack>
              </CardContent>
            </StyledCompanyCard>
          </Grid>
        ))}
      </Grid>
      
      {/* Stats Section */}
      {companies.length > 0 && (
        <Box sx={{ 
          mt: 6, 
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {companies.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Companies
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {companies.reduce((sum, company) => sum + (company.jobPosts || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Jobs
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {companies.filter(c => c.featured).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Featured
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {companies.filter(c => c.trending).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trending
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default TopCompanies;