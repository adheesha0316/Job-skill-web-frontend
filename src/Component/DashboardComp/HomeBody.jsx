import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import SearchBar from "../DashboardSubComp/SearchBar";
import FeaturedJobs from "../DashboardSubComp/FeaturedJobs";
import TopCompanies from "../DashboardSubComp/TopCompanies";

const HomeBody = () => {
  // Mock data for demonstration; replace with real data as needed
  const [resultsCount] = useState(247);

  const jobs = [
    { title: "AC Technician", company: "Powernet", location: "Colombo", logo: "logo1.png" },
    { title: "Sales Executive", company: "Quantum", location: "Colombo", logo: "logo2.png" },
    { title: "Software Engineer", company: "Virtusa", location: "Colombo", logo: "logo3.png" },
    { title: "Graphic Designer", company: "CreativeX", location: "Kandy", logo: "logo4.png" },
    { title: "Marketing Manager", company: "Nestle", location: "Galle", logo: "logo5.png" },
    { title: "HR Assistant", company: "Dialog", location: "Colombo", logo: "logo6.png" },
    { title: "Business Analyst", company: "MAS Holdings", location: "Colombo", logo: "logo7.png" },
    { title: "Customer Support", company: "Hemas", location: "Jaffna", logo: "logo8.png" },
    { title: "Network Engineer", company: "SLT", location: "Colombo", logo: "logo9.png" },
    { title: "Content Writer", company: "Wijeya Newspapers", location: "Colombo", logo: "logo10.png" },
    { title: "Finance Executive", company: "Sampath Bank", location: "Matara", logo: "logo11.png" },
    { title: "QA Engineer", company: "IFS", location: "Colombo", logo: "logo12.png" },
  ];

  const companies = [
    { name: "Hemas Pharmaceutical", jobPosts: 35, logo: "hemas.png" },
    { name: "Dialog Axiata", jobPosts: 25, logo: "dialog.png" },
    { name: "Virtusa", jobPosts: 40, logo: "virtusa.png" },
    { name: "MAS Holdings", jobPosts: 30, logo: "mas.png" },
    { name: "Nestle Lanka", jobPosts: 18, logo: "nestle.png" },
    { name: "SLT", jobPosts: 22, logo: "slt.png" },
    { name: "Sampath Bank", jobPosts: 15, logo: "sampath.png" },
    { name: "IFS", jobPosts: 12, logo: "ifs.png" },
    { name: "CreativeX", jobPosts: 10, logo: "creativex.png" },
    { name: "Wijeya Newspapers", jobPosts: 8, logo: "wijeya.png" },
    { name: "Quantum", jobPosts: 14, logo: "quantum.png" },
    { name: "Powernet", jobPosts: 9, logo: "powernet.png" },
  ];

  return (
    <Box>
      <Box sx={{ textAlign: "center", mt: 4, mb: 6 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          Find Your Job
        </Typography>
      </Box>
      {/* Search Bar Section */}
      <Box sx={{ mt: 4 }}>
        <Container maxWidth="md">
          <SearchBar resultsCount={resultsCount} />
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Box sx={{ mt: 6, px: { xs: 2, md: 0 } }}>
        <FeaturedJobs jobs={jobs} />
      </Box>

      {/* Top Companies Section */}
      <Box sx={{ mt: 8, px: { xs: 2, md: 0 } }}>
        <TopCompanies companies={companies} />
      </Box>
    </Box>
  );
};

export default HomeBody;
