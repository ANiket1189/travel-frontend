import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOKING } from "../../graphql/mutations";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Typography,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function BookingForm({ open, handleClose, packageId, packageTitle, price }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [createBooking] = useMutation(CREATE_BOOKING, {
    variables: {
      packageId,
      userId,
      date,
    },
    onCompleted: () => {
      setSnackbar({
        open: true,
        message: "Booking confirmed successfully!",
        severity: "success",
      });
      handleClose();
      setConfirmDialog(false);
      navigate("/bookings");
    },
    onError: (error) => {
      setError(error.message);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    },
  });

  const handleBookingConfirm = () => {
    if (!date) {
      setError("Please select a date");
      return;
    }
    setConfirmDialog(true);
  };

  const handleFinalConfirmation = async () => {
    try {
      await createBooking();
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  return (
    <>
      {/* Initial Booking Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Book Your Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">{packageTitle}</Typography>
            <Typography variant="subtitle1" color="primary">
              Price:{price}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Select Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleBookingConfirm}
            variant="contained"
            color="primary"
          >
            Proceed to Book
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to book this package?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography>
              <strong>Package:</strong> {packageTitle}
            </Typography>
            <Typography>
              <strong>Price:</strong> ${price}
            </Typography>
            <Typography>
              <strong>Date:</strong> {new Date(date).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
            Your booking will be confirmed immediately upon confirmation.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleFinalConfirmation}
            variant="contained"
            color="primary"
          >
            Confirm Booking
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
    </>
  );
}

export default BookingForm;
