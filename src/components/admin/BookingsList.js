import React from "react";
import { useQuery } from "@apollo/client";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { GET_ALL_BOOKINGS } from "../../graphql/queries";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "80vh",
    marginBottom: "2rem",
    marginTop: "4rem",
    padding: "0 2rem",
  },
  paper: {
    width: "100%",
    padding: "2rem",
    backgroundColor: (theme) => theme.palette.background.paper,
  },
  tableContainer: {
    marginTop: "1rem",
    boxShadow: "none",
    border: (theme) => `1px solid ${theme.palette.divider}`,
    borderRadius: 1,
  },
};

function BookingsList() {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { loading, error, data } = useQuery(GET_ALL_BOOKINGS, {
    pollInterval: 1000,
    fetchPolicy: "network-only",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          color: "#ffffff",
          backgroundColor: theme.palette.success.light,
        };
      case "PENDING":
        return {
          color: "#ffffff",
          backgroundColor: theme.palette.warning.light,
        };
      case "CANCELLED":
        return {
          color: "#ffffff",
          backgroundColor: theme.palette.error.light,
        };
      default:
        return {
          color: "#ffffff",
          backgroundColor: theme.palette.grey[200],
        };
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
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">
          Error loading bookings: {error.message}
        </Typography>
      </Box>
    );

  // Sort bookings by date (most recent first)
  const bookings = [...(data?.getAllBookings || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.primary.main, fontWeight: "600" }}
          gutterBottom
        >
          Manage Bookings
        </Typography>
        <TableContainer sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Package Details
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Travel Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Booking Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow
                    key={booking.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {booking.id.slice(-6)}
                        <Tooltip title={`Full ID: ${booking.id}`}>
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {booking.packageId.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {booking.packageId.destination}
                      </Typography>
                    </TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.username}</TableCell>
                    <TableCell>
                      {format(new Date(booking.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        size="small"
                        sx={{
                          ...getStatusColor(booking.status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        ${booking.packageId.price}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={bookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            ".MuiTablePagination-select": {
              minHeight: "auto",
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default BookingsList;
