import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, CardMedia } from '@mui/material';

const UNSPLASH_ACCESS_KEY = '0zmau8I1GLU2Y_YYkW0CM92beDeHNLGNXcFdu8i7aSc';

function PackageCard({ package: pkg }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (!pkg.destination) return;

      if (!UNSPLASH_ACCESS_KEY) {
        console.error('Unsplash Access Key is not set. Please check your environment variables.');
        return;
      }

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${pkg.destination} tours&travel&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setImage(data.results[0].urls.regular);
        }
      } catch (error) {
        console.error(`Error fetching image for ${pkg.destination}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [pkg.destination]);

  const handleViewDetails = () => {
    navigate(`/packages/${pkg.id}`);
  };

  const styles = {
    cardMedia: {
      height: '300px',
      width: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    },
    media: {
      paddingTop: '66.25%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      }
    }}>
      <CardMedia
        component="img"
        image={image}
        alt={pkg.title}
        sx={styles.cardMedia}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {pkg.title}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary" paragraph>
          {pkg.description}
        </Typography> */}
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Price:</strong> ${pkg.price}</Typography>
          <Typography><strong>Duration:</strong> {pkg.duration}</Typography>
          <Typography><strong>Destination:</strong> {pkg.destination}</Typography>
          <Typography><strong>Category:</strong> {pkg.category}</Typography>
          <Typography><strong>Available:</strong> {pkg.availability}</Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
}

console.log('Unsplash Access Key:', UNSPLASH_ACCESS_KEY);

export default PackageCard;
