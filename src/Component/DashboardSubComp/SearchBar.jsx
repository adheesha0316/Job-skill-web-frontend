import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  Divider,
  Paper,
  Fade,
  Chip,
  InputBase,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import ClearIcon from "@mui/icons-material/Clear";

// Custom styled components
const StyledSearchContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 8px 32px rgba(15, 127, 255, 0.2)",
  border: "2px solid rgb(81, 177, 255)",
  borderRadius: "12px",
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  alignItems: "center",
  flexWrap: "wrap",
  minHeight: "70px",
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(15, 127, 255, 0.3)",
    borderColor: "rgb(62, 139, 255)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 2,
  minWidth: "250px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      backgroundColor: "white",
      boxShadow: "0 0 0 2px rgba(81, 177, 255, 0.1)",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      boxShadow: "0 0 0 2px rgba(81, 177, 255, 0.2)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    fontSize: "14px",
  },
}));

const StyledDropdownButton = styled(Button)(({ theme }) => ({
  minWidth: "150px",
  padding: "12px 16px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#4a5568",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "rgb(81, 177, 255)",
    backgroundColor: "#f8fafc",
    boxShadow: "0 2px 8px rgba(81, 177, 255, 0.1)",
  },
}));

const StyledLocationButton = styled(Button)(({ theme }) => ({
  minWidth: "130px",
  padding: "12px 16px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  backgroundColor: "white",
  color: "#4a5568",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "rgb(81, 177, 255)",
    backgroundColor: "#f8fafc",
    boxShadow: "0 2px 8px rgba(81, 177, 255, 0.1)",
  },
}));

const StyledSearchButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  padding: "12px 24px",
  minWidth: "160px",
  background: "linear-gradient(135deg,rgb(156, 174, 255) 0%,rgb(21, 161, 255) 100%)",
  borderRadius: "8px",
  fontSize: "14px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg,rgb(156, 174, 255) 0%,rgb(21, 161, 255) 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(21, 161, 255, 0.3)",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    marginTop: theme.spacing(1),
    minWidth: "250px",
    maxHeight: "400px",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 16px",
  fontSize: "14px",
  color: "#4a5568",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#f8fafc",
    color: "#2d3748",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: "2px",
  backgroundColor: "rgba(81, 177, 255, 0.1)",
  color: "rgb(62, 139, 255)",
  fontSize: "12px",
  height: "24px",
  "& .MuiChip-deleteIcon": {
    color: "rgb(62, 139, 255)",
    fontSize: "16px",
  },
}));

const jobCategories = [
  "Accountancy & Finance",
  "Administration / Secretarial",
  "Agriculture",
  "Apparel",
  "IT / Software",
  "Engineering",
  "Marketing",
  "Healthcare",
  "Education",
  "Construction",
];

const locations = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara", "Remote"];

const SearchBar = () => {
  const [anchorCat, setAnchorCat] = useState(null);
  const [anchorLoc, setAnchorLoc] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== categoryToRemove));
  };

  const handleClearAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleSearch = () => {
    console.log("Search:", {
      searchTerm,
      selectedCategories,
      selectedLocation,
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filteredCategories = jobCategories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const getCategoryButtonText = () => {
    if (selectedCategories.length === 0) return "Job Category";
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} Categories`;
  };

  return (
    <StyledSearchContainer>
      {/* Job Search Input */}
      <StyledTextField
        size="small"
        placeholder="I'm looking for... (Eg: Job title, Position, Company)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#718096", fontSize: "20px" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                sx={{ color: "#718096" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "300px" }}>
          {selectedCategories.slice(0, 3).map((category) => (
            <StyledChip
              key={category}
              label={category}
              size="small"
              onDelete={() => handleRemoveCategory(category)}
            />
          ))}
          {selectedCategories.length > 3 && (
            <StyledChip
              label={`+${selectedCategories.length - 3} more`}
              size="small"
              onClick={() => setAnchorCat(true)}
            />
          )}
        </Box>
      )}

      {/* Job Category Dropdown */}
      <StyledDropdownButton
        onClick={(e) => setAnchorCat(e.currentTarget)}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: "transform 0.2s ease",
              transform: anchorCat ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
        startIcon={<WorkIcon sx={{ fontSize: "18px" }} />}
      >
        {getCategoryButtonText()}
      </StyledDropdownButton>

      <StyledMenu
        anchorEl={anchorCat}
        open={Boolean(anchorCat)}
        onClose={() => setAnchorCat(null)}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        {/* Category Search */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#718096", fontSize: "18px" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "rgb(81, 177, 255)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgb(81, 177, 255)",
                },
              },
            }}
          />
        </Box>

        {/* Clear All Button */}
        {selectedCategories.length > 0 && (
          <Box sx={{ p: 1, borderBottom: "1px solid #e2e8f0" }}>
            <Button
              size="small"
              onClick={handleClearAllCategories}
              sx={{
                color: "rgb(62, 139, 255)",
                textTransform: "none",
                fontSize: "12px",
              }}
            >
              Clear All ({selectedCategories.length})
            </Button>
          </Box>
        )}

        {/* Category List */}
        <Box sx={{ maxHeight: "250px", overflowY: "auto" }}>
          {filteredCategories.map((cat) => (
            <StyledMenuItem key={cat} disableRipple>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    sx={{
                      color: "#cbd5e0",
                      "&.Mui-checked": {
                        color: "rgb(81, 177, 255)",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: "14px", color: "#4a5568" }}>
                    {cat}
                  </Typography>
                }
                sx={{ margin: 0, width: "100%" }}
              />
            </StyledMenuItem>
          ))}
        </Box>
      </StyledMenu>

      {/* Location Dropdown */}
      <StyledLocationButton
        onClick={(e) => setAnchorLoc(e.currentTarget)}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: "transform 0.2s ease",
              transform: anchorLoc ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
        startIcon={<LocationOnIcon sx={{ fontSize: "18px" }} />}
      >
        {selectedLocation || "Location"}
      </StyledLocationButton>

      <StyledMenu
        anchorEl={anchorLoc}
        open={Boolean(anchorLoc)}
        onClose={() => setAnchorLoc(null)}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        {locations.map((loc) => (
          <StyledMenuItem
            key={loc}
            onClick={() => {
              setSelectedLocation(loc);
              setAnchorLoc(null);
            }}
            selected={selectedLocation === loc}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(81, 177, 255, 0.1)",
                color: "rgb(62, 139, 255)",
                "&:hover": {
                  backgroundColor: "rgba(81, 177, 255, 0.15)",
                },
              },
            }}
          >
            <LocationOnIcon sx={{ mr: 1, fontSize: "16px", color: "#718096" }} />
            {loc}
          </StyledMenuItem>
        ))}
      </StyledMenu>

      {/* Search Button */}
      <StyledSearchButton
        variant="contained"
        onClick={handleSearch}
        startIcon={<SearchIcon />}
      >
        Search
      </StyledSearchButton>
    </StyledSearchContainer>
  );
};

export default SearchBar;