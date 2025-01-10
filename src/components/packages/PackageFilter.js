import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Slider,
  Typography,
  Paper,
  Divider,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputAdornment from '@mui/material/InputAdornment';

const PackageFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    category: '',
    availability: 0
  });

  const categories = ['Adventure', 'Romantic', 'Family', 'Cultural', 'Other'];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const styles = {
    filterContainer: {
      p: 3,
      mb: 3,
      backgroundColor: '#121212',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255, 165, 0, 0.1)',
      position: 'sticky',
      top: '20px',
    },
    title: {
      fontWeight: 600,
      color: '#FFA500',
      mb: 2
    },
    section: {
      mb: 3
    },
    formControl: {
      width: '100%',
      mb: 2,
      '& .MuiOutlinedInput-root': {
        color: '#FFFFFF',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FFA500',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#FFFFFF',
      },
      '& .MuiSelect-icon': {
        color: '#FFA500',
      },
    },
    slider: {
      mt: 2,
      mb: 1,
      color: '#FFA500',
      '& .MuiSlider-rail': {
        opacity: 0.3,
      },
    },
    searchField: {
      mb: 3,
      '& .MuiOutlinedInput-root': {
        color: '#FFFFFF',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FFA500',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#FFFFFF',
      },
      '& .MuiInputAdornment-root': {
        color: '#FFA500',
      },
    },
    priceDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      mt: 1,
      mb: 3,
      color: '#FFFFFF'
    },
    divider: {
      my: 2,
      backgroundColor: 'rgba(255, 165, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#FFFFFF',
      mb: 1
    },
    applyButton: {
      width: '100%',
      mt: 2,
      backgroundColor: '#FFA500',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#FFB733',
      }
    }
  };

  return (
    <Paper sx={styles.filterContainer}>
      <Typography variant="h6" sx={styles.title}>
        Filter Packages
      </Typography>

      <Box component="form">
        <Box sx={styles.section}>
          <TextField
            fullWidth
            placeholder="Search destinations or packages"
            name="search"
            value={filters.search}
            onChange={handleChange}
            sx={styles.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={styles.divider} />

        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            Price Range ($)
          </Typography>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            sx={styles.slider}
          />
          <Box sx={styles.priceDisplay}>
            <Typography variant="body2">
              ${filters.minPrice}
            </Typography>
            <Typography variant="body2">
              ${filters.maxPrice}
            </Typography>
          </Box>
        </Box>

        <Divider sx={styles.divider} />

        <Box sx={styles.section}>
          <FormControl sx={styles.formControl}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={styles.divider} />

        <Box sx={styles.section}>
          <FormControl sx={styles.formControl}>
            <TextField
              type="number"
              label="Minimum Availability"
              name="availability"
              value={filters.availability}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<FilterAltIcon />}
          onClick={handleApplyFilters}
          sx={styles.applyButton}
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default PackageFilter; 