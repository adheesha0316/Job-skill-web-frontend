import React, { useState } from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import blueCatAnimation from "../../assets/animations/blueCat.json";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Google,
  LinkedIn,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import axiosInstance from "../../Service/axiosOrder.jsx"; // Adjust the import path as necessary
import "../../assets/style.css";

const LoginForm = (props) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();


  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRegisterData({ ...registerData, role: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axiosInstance.post("/user/login", loginData);

    const { token, role, email, userName } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    
    if (userName) {
      localStorage.setItem("userName", userName); // backend entity වලින් එන userName
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.jti || payload.sub;
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        console.warn("userId not found in token payload:", payload);
      }
    } catch (err) {
      console.error("Failed to decode JWT token for userId:", err);
    }

    console.log("Login success:", response.data);

    // Redirect based on role using SPA navigation
    switch (role) {
      case "ADMIN":
        navigate("/dashboard/admin");
        break;
      case "JOBSEEKER":
        navigate("/dashboard/jobseeker");
        break;
      case "EMPLOYER":
        navigate("/dashboard/employer");
        break;
      case "TRAINER":
        navigate("/dashboard/trainer");
        break;
      case "GUEST":
        navigate("/choose-role");
        break;
      default:
        alert("Unknown role");
        break;
    }

    if (props.onLogin) {
      props.onLogin(); // Notify parent (App.jsx)
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert("Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};

  const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  if (
    !registerData.userName ||
    !registerData.email ||
    !registerData.password ||
    !registerData.role
  ) {
    alert("All fields are required!");
    return;
  }
  setLoading(true);
  try {
    const response = await axiosInstance.post("/user/register", registerData);
    console.log("Register success:", response.data);
    alert("Registration successful! Please login.");
    setIsSignUpMode(false); // switch to sign in
  } catch (error) {
    console.error("Register failed:", error.response?.data || error.message);
    alert(
      error.response?.data?.message ||
        "Registration failed. Please check your input."
    );
  } finally {
    setLoading(false);
  }
};


  const socialButtonStyle = {
    width: 50,
    height: 50,
    margin: "0 10px",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      transform: "translateY(-2px)",
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.18)}`,
    },
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.08)}`,
      },
      "&.Mui-focused": {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.18)}`,
      },
    },
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In */}
          <form
            className="sign-in-form"
            onSubmit={handleLoginSubmit}
            style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}
          >
            <Typography
              variant="h5"
              className="title"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Sign in
            </Typography>

            <TextField
              label="Email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            <TextField
              label="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
            >
              Login
            </Button>

            <Typography
              variant="body2"
              className="social-text"
              sx={{ mt: 3, mb: 1, textAlign: "center" }}
            >
              Or Sign in with social platforms
            </Typography>

            <Box
              className="social-media"
              sx={{ display: "flex", justifyContent: "center", mb: 2 }}
            >
              <IconButton sx={socialButtonStyle}>
                <Facebook />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <Twitter />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <Google />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <LinkedIn />
              </IconButton>
            </Box>
          </form>

          {/* Sign Up */}
          <form
            className="sign-up-form"
            onSubmit={handleRegisterSubmit}
            style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}
          >
            <Typography
              variant="h5"
              className="title"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Sign up
            </Typography>

            <TextField
              label="Username"
              name="userName"
              value={registerData.userName}
              onChange={handleRegisterChange}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            <TextField
              label="Email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textFieldStyle}
            />

            <TextField
              label="Password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
                variant="outlined"
                label="Role"
                sx={textFieldStyle}
              >
                <MenuItem value="EMPLOYER">EMPLOYER</MenuItem>
                <MenuItem value="JOBSEEKER">JOBSEEKER</MenuItem>
                <MenuItem value="TRAINER">TRAINER</MenuItem>
                <MenuItem value="GUEST">GUEST</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
            >
              Sign up
            </Button>

            <Typography
              variant="body2"
              className="social-text"
              sx={{ mt: 3, mb: 1, textAlign: "center" }}
            >
              Or Sign up with social platforms
            </Typography>

            <Box
              className="social-media"
              sx={{ display: "flex", justifyContent: "center", mb: 2 }}
            >
              <IconButton sx={socialButtonStyle}>
                <Facebook />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <Twitter />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <Google />
              </IconButton>
              <IconButton sx={socialButtonStyle}>
                <LinkedIn />
              </IconButton>
            </Box>
          </form>
        </div>
      </div>

      {/* Panels */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <Typography variant="h6">New here?</Typography>
            <Typography variant="body2">
              Join us to access opportunities and grow!
            </Typography>
            <Button
              className="btn transparent"
              onClick={() => setIsSignUpMode(true)}
            >
              Sign up
            </Button>
          </div>
          <img src="/img/log.svg" className="image" alt="login" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <Typography variant="h6">One of us?</Typography>
            <Typography variant="body2">
              Sign in and continue your journey with us.
            </Typography>
            <Button
              className="btn transparent"
              onClick={() => setIsSignUpMode(false)}
            >
              Sign in
            </Button>
          </div>
          <img src="/img/register.svg" className="image" alt="register" />
        </div>
      </div>

      {/* Animation */}
      {loading && (
        <div
          style={{
            width: 450,
            height: 450,
            margin: "80px auto",
            marginTop: 100,
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9f9f9", // optional subtle bg for contrast
            zIndex: 1,
          }}
        >
          <Lottie
            animationData={blueCatAnimation}
            loop={true}
            style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 0 }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
