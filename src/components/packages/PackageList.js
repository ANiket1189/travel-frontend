import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PACKAGES } from '../../graphql/queries';
import { Grid, Container, Typography, Button, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PackageCard from './PackageCard';
import PackageFilter from './PackageFilter';
import Loading from '../common/Loading';
import Error from '../common/Error';

function PackageList() {
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    category: '',
    availability: 0
  });

  const { loading, error, data } = useQuery(GET_ALL_PACKAGES, {
    fetchPolicy: 'network-only'
  });

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleReset = () => {
    setActiveFilters({
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      category: '',
      availability: 0
    });
  };

  if (loading) return <Loading />;
  if (error) {
    console.error('Error fetching packages:', error);
    return <Error message="Error loading packages" />;
  }

  let packages = data?.getAllPackages || [];

  // Apply filters locally
  if (activeFilters.search) {
    const searchTerm = activeFilters.search.toLowerCase();
    packages = packages.filter(pkg => 
      pkg.title.toLowerCase().includes(searchTerm) ||
      pkg.destination.toLowerCase().includes(searchTerm)
    );
  }

  if (activeFilters.minPrice > 0) {
    packages = packages.filter(pkg => pkg.price >= activeFilters.minPrice);
  }

  if (activeFilters.maxPrice < 10000) {
    packages = packages.filter(pkg => pkg.price <= activeFilters.maxPrice);
  }

  if (activeFilters.category) {
    packages = packages.filter(pkg => pkg.category === activeFilters.category);
  }

  if (activeFilters.availability > 0) {
    packages = packages.filter(pkg => pkg.availability >= activeFilters.availability);
  }

  if (packages.length === 0) {
    return (
      <Container sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 'calc(100vh - 200px)', // Accounts for header and footer
        justifyContent: 'center',
        alignItems: 'center',
        py: 8 // Adds vertical padding
      }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 6 // Margin bottom for spacing between text and button
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              color: 'secondary.main',
              fontWeight: 500 
            }}
          >
            No packages match your filters.
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{
              backgroundColor: 'primary.main',
              color: '#ffffff',
              py: 1.5,
              px: 4,
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Show All Packages
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 200px)',
      pt: 6, // Top padding
      pb: 8, // Bottom padding
      px: { xs: 2, md: 4 }, // Responsive horizontal padding
    }}>
      <Grid container spacing={4} sx={{ width: '100%', margin: '0 auto' }}>
        <Grid item xs={12} md={3}>
          <PackageFilter 
            onFilterChange={handleFilterChange}
            initialFilters={activeFilters}
          />
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {packages.map((pkg) => (
              <Grid item key={pkg.id} xs={12} sm={6} md={4}>
                <PackageCard package={pkg} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PackageList; 