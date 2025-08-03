import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Service/axiosOder';
import BlueCatLoader from '../../Component/BlueCatLoader';
import HomeHeader from '../../Component/DashboardComp/HomeHeader';
import HomeBody from '../../Component/DashboardComp/HomeBody';
import HomeFooter from '../../Component/DashboardComp/HomeFooter';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "User");

    axiosInstance
      .get('/jobs')
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '90px', alignItems: 'center', justifyContent: 'center' }}>
        <BlueCatLoader />
        <p style={{ marginTop: "16px", color: "#666", fontSize: "1.1rem" }}>
          Loading jobs for you...
        </p>
      </div>
    );
  }

  return (
    <div>
      <HomeHeader username={username} onLogout={handleLogout} />
      <HomeBody />
      <HomeFooter />
    </div>
  );
};

export default Dashboard;
