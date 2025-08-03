// src/components/HomeFooter.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const HomeFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2c3e50',
        color: 'white',
        mt: 8,
        pt: 6,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{
                position: 'relative',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#3498db',
                },
              }}
            >
              About JobFinder
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                lineHeight: 1.6,
                opacity: 0.9,
                fontSize: '0.875rem',
                letterSpacing: '0.02em',
              }}
            >
              JobFinder connects talented job seekers with top employers in Sri Lanka. Discover your next opportunity and grow your career with ease and confidence.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{
                position: 'relative',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#3498db',
                },
              }}
            >
              Quick Links
            </Typography>
            <Box 
              display="flex" 
              flexDirection="column" 
              gap={1}
              sx={{
                '& a': {
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  padding: '4px 0',
                  position: 'relative',
                  '&:hover': {
                    paddingLeft: '8px',
                    opacity: 0.8,
                  },
                },
              }}
            >
              <Link href="/jobs" color="inherit" underline="hover">
                Browse Jobs
              </Link>
              <Link href="/companies" color="inherit" underline="hover">
                Companies
              </Link>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{
                position: 'relative',
                pb: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#3498db',
                },
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ '& p': { mb: 1, fontSize: '0.875rem', lineHeight: 1.6 } }}>
              <Typography variant="body2">123 Job Street, Colombo, Sri Lanka</Typography>
              <Typography variant="body2">Email: support@jobfinder.lk</Typography>
              <Typography variant="body2">Phone: +94 77 123 4567</Typography>
            </Box>
            
            {/* Social Icons */}
            <Box 
              mt={2}
              sx={{
                display: 'flex',
                gap: 1,
                '& .MuiIconButton-root': {
                  transition: 'all 0.3s ease',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                },
              }}
            >
              <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank" sx={{ color: '#fff' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#fff' }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider 
          sx={{ 
            my: 4, 
            borderColor: 'rgba(255,255,255,0.2)',
            '&::before': {
              borderTopStyle: 'solid',
              borderTopWidth: '1px',
            },
          }} 
        />
        
        <Typography 
          variant="body2" 
          align="center" 
          sx={{
            color: 'gray',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            fontWeight: 300,
            opacity: 0.8,
          }}
        >
          © {new Date().getFullYear()} JobFinder. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default HomeFooter;