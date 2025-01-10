import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BOOKINGS } from "../../graphql/queries";
import { CANCEL_BOOKING } from "../../graphql/mutations";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import Loading from "../common/Loading";
import Error from "../common/Error";
import { useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "80vh",
    marginBottom: "2rem",
    marginTop: "6rem",
    padding: "0 2rem",
  },
  title: {
    fontWeight: 600,
    color: "primary.main",
    marginBottom: "2rem",
  },
  noBookingsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    gap: "1rem",
    marginTop: "2rem",
  },
  noBookingsText: {
    color: "#FFA500",
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
};

function BookingList() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_BOOKINGS, {
    variables: { userId },
    fetchPolicy: "network-only",
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [cancelBooking] = useMutation(CANCEL_BOOKING, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    update(cache, { data: { cancelBooking } }) {
      try {
        const existingBookings = cache.readQuery({
          query: GET_BOOKINGS,
          variables: { userId },
        });

        if (existingBookings) {
          cache.writeQuery({
            query: GET_BOOKINGS,
            variables: { userId },
            data: {
              getBookings: existingBookings.getBookings.map((booking) =>
                booking.id === cancelBooking.id ? cancelBooking : booking
              ),
            },
          });
        }
      } catch (err) {
        console.error("Cache update error:", err);
      }
    },
    onCompleted: (data) => {
      if (data.cancelBooking) {
        setSnackbar({
          open: true,
          message: "Booking cancelled successfully",
          severity: "success",
        });
        refetch(); // Refetch to ensure data consistency
      }
      setConfirmDialog(false);
    },
    onError: (error) => {
      console.error("Cancel booking error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Error cancelling booking",
        severity: "error",
      });
      setConfirmDialog(false);
    },
  });

  if (!userId) {
    return (
      <Box sx={styles.container}>
        <Typography sx={styles.noBookingsText}>
          Please login to view your bookings.
        </Typography>
      </Box>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  if (!data?.getBookings || data.getBookings.length === 0) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.noBookingsContainer}>
          <Typography sx={styles.noBookingsText}>
            You Have Made No Bookings Yet 😔
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExploreIcon />}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/packages")}
            sx={{
              backgroundColor: "#FFA500",
              color: "#ffffff",
              px: 4,
              py: 1.5,
              mt: 3,
              fontSize: "1.1rem",
              fontWeight: 500,
              borderRadius: "4px",
              textTransform: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "#FFA500",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Explore Available Packages
          </Button>
        </Box>
      </Box>
    );
  }

  const bookings = data?.getBookings || [];

  const handleCancelClick = (booking) => {
    if (!booking || !booking.id) {
      setSnackbar({
        open: true,
        message: "Invalid booking data",
        severity: "error",
      });
      return;
    }
    setSelectedBooking(booking);
    setConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking?.id || !userId) {
      setSnackbar({
        open: true,
        message: "Missing booking information",
        severity: "error",
      });
      return;
    }

    try {
      await cancelBooking({
        variables: {
          bookingId: selectedBooking.id,
          userId: userId,
        },
        optimisticResponse: {
          cancelBooking: {
            __typename: "Booking",
            id: selectedBooking.id,
            userId: userId,
            packageId: {
              __typename: "TravelPackage",
              id: selectedBooking.packageId.id,
              title: selectedBooking.packageId.title,
              description: selectedBooking.packageId.description,
              price: selectedBooking.packageId.price,
              duration: selectedBooking.packageId.duration,
              destination: selectedBooking.packageId.destination,
              category: selectedBooking.packageId.category,
              availability: selectedBooking.packageId.availability,
              createdAt: selectedBooking.packageId.createdAt,
            },
            date: selectedBooking.date,
            status: "CANCELLED",
            createdAt: selectedBooking.createdAt,
          },
        },
      });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setSnackbar({
        open: true,
        message: err.message || "Error cancelling booking",
        severity: "error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { color: "#1b5e20", bgcolor: "#e8f5e9", borderColor: "#1b5e20" };
      case "CANCELLED":
        return { color: "#d32f2f", bgcolor: "#ffebee", borderColor: "#d32f2f" };
      case "PENDING":
        return { color: "#ed6c02", bgcolor: "#fff3e0", borderColor: "#ed6c02" };
      default:
        return {
          color: "grey.700",
          bgcolor: "grey.100",
          borderColor: "grey.400",
        };
    }
  };

  // Sort bookings by date (newest first) and status (CONFIRMED first)
  const sortedBookings = [...(data?.getBookings || [])].sort((a, b) => {
    // First sort by status (CONFIRMED first)
    if (a.status === "CONFIRMED" && b.status !== "CONFIRMED") return -1;
    if (a.status !== "CONFIRMED" && b.status === "CONFIRMED") return 1;

    // Then sort by date (newest first)
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        My Bookings
      </Typography>
      <Grid container spacing={3}>
        {sortedBookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card
              sx={{
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    >
                      Booking ID: {booking.id}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        "& .MuiTypography-root": {
                          fontSize: "1rem",
                          color: "text.secondary",
                        },
                      }}
                    >
                      <Typography
                        sx={{ color: "text.primary", fontWeight: 500 }}
                      >
                        <strong>Username:</strong> {booking.username}
                      </Typography>
                      {booking.packageId && (
                        <>
                          <Typography
                            sx={{ color: "text.primary", fontWeight: 500 }}
                          >
                            <strong>Package:</strong> {booking.packageId.title}
                          </Typography>
                          <Typography>
                            <strong>Date:</strong>{" "}
                            {new Date(booking.date).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={booking.status}
                              sx={{
                                ...getStatusColor(booking.status),
                                fontWeight: 500,
                                px: 1,
                              }}
                              variant="outlined"
                            />
                          </Box>
                          <Typography>
                            <strong>Destination:</strong>{" "}
                            {booking.packageId.destination}
                          </Typography>
                          <Typography>
                            <strong>Duration:</strong>{" "}
                            {booking.packageId.duration}
                          </Typography>
                          <Typography
                            sx={{
                              color: "primary.main",
                              fontWeight: 500,
                              fontSize: "1.1rem",
                            }}
                          >
                            <strong>Price:</strong> ${booking.packageId.price}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      sx={{ mt: { xs: 2, md: 0 } }}
                    >
                      {booking.status === "CONFIRMED" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancelClick(booking)}
                          sx={{
                            px: 3,
                            py: 1,
                            fontWeight: 500,
                            "&:hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        PaperProps={{
          sx: { width: "100%", maxWidth: 500 },
        }}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && selectedBooking.packageId ? (
            <Typography>
              Are you sure you want to cancel this booking?
              <Box mt={2}>
                <strong>Package:</strong> {selectedBooking.packageId.title}
                <br />
                <strong>Date:</strong>{" "}
                {new Date(selectedBooking.date).toLocaleDateString()}
                <br />
                <strong>Price:</strong> ${selectedBooking.packageId.price}
                <br />
                <strong>Destination:</strong>{" "}
                {selectedBooking.packageId.destination}
              </Box>
              <Typography color="error" sx={{ mt: 2 }}>
                This action cannot be undone.
              </Typography>
            </Typography>
          ) : (
            <Typography color="error">
              Error: Booking information not available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Keep Booking</Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={!selectedBooking || !selectedBooking.packageId}
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BookingList;
