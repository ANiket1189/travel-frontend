import { useMutation } from '@apollo/client';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { ADD_TRAVEL_PACKAGE } from '../../graphql/mutations';
import { GET_PACKAGES } from '../../graphql/queries';

function AddPackageForm() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    destination: '',
    category: '',
    availability: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [addPackage, { loading }] = useMutation(ADD_TRAVEL_PACKAGE, {
    onCompleted: () => {
      setSuccess('Package added successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        destination: '',
        category: '',
        availability: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    },
    refetchQueries: [{ query: GET_PACKAGES }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPackage({
      variables: {
        ...formData,
        price: parseFloat(formData.price),
        availability: parseInt(formData.availability)
      }
    });
  };

  const categories = ['Adventure', 'Romantic', 'Family', 'Cultural', 'Other'];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, mb: 3 ,fontWeight: "600"}}>
        Add New Travel Package
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Package Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="duration"
              label="Duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., 5 days"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="destination"
              label="Destination"
              value={formData.destination}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="availability"
              label="Availability"
              type="number"
              value={formData.availability}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {loading ? 'Adding...' : 'Add Package'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default AddPackageForm; 