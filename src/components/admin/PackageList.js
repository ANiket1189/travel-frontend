import { useMutation, useQuery } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  DELETE_TRAVEL_PACKAGE,
  EDIT_TRAVEL_PACKAGE,
} from "../../graphql/mutations";
import { GET_PACKAGES } from "../../graphql/queries";
import { useNavigate } from "react-router-dom";

function PackageList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({});
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const { loading, error, data, refetch } = useQuery(GET_PACKAGES, {
    context: {
      headers: {
        "x-admin": isAdmin ? "true" : "false",
      },
    },
  });

  const [deletePackage] = useMutation(DELETE_TRAVEL_PACKAGE, {
    context: { headers: { "x-admin": isAdmin ? "true" : "false" } },
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: "Package deleted successfully",
        severity: "success",
      });
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    },
  });

  const [editPackage] = useMutation(EDIT_TRAVEL_PACKAGE, {
    context: { headers: { "x-admin": isAdmin ? "true" : "false" } },
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: "Package updated successfully",
        severity: "success",
      });
      setEditModalOpen(false);
      refetch();
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    },
  });

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  const handleDeleteClick = (pkg) => {
    setSelectedPackage(pkg);
    setOpenDialog(true);
  };

  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      destination: pkg.destination,
      category: pkg.category,
      availability: pkg.availability.toString(),
    });
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deletePackage({ variables: { packageId: selectedPackage.id } });
  };

  const handleEditSubmit = async () => {
    await editPackage({
      variables: {
        packageId: selectedPackage.id,
        ...formData,
        price: parseFloat(formData.price),
        availability: parseInt(formData.availability, 10),
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "availability") {
      if (value === "" || (!isNaN(value) && parseInt(value, 10) >= 0)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const packages = data?.getPackages || [];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 12,
        mx: "auto",
        maxWidth: "95%",
        minHeight: "calc(100vh - 120px)",
        backgroundColor: "#121212",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        color: "#FFFFFF",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#FFA500",
          mb: 4,
          fontWeight: "bold",
        }}
      >
        Manage Travel Packages
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(255, 165, 0, 0.1)" }}>
              <TableCell>Title</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 165, 0, 0.05)",
                  },
                }}
              >
                <TableCell>{pkg.title}</TableCell>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>${pkg.price}</TableCell>
                <TableCell>{pkg.duration}</TableCell>
                <TableCell>{pkg.category}</TableCell>
                <TableCell>{pkg.availability}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(pkg)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(pkg)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            color: "#FFFFFF",
          },
        }}
      >
        <DialogTitle>Delete Package</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedPackage?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            color: "#FFFFFF",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FFA500" }}>Edit Package</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#FFFFFF",
              },
              "& .MuiInputBase-input": {
                color: "#FFFFFF",
              },
            }}
            label="Availability"
            name="availability"
            type="number"
            value={formData.availability}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default PackageList;
