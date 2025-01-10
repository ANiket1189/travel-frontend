import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_ANALYTICS } from "../../graphql/queries";
import { Box, Typography, CircularProgress, Grid, Paper } from "@mui/material";
import Error from "../common/Error";

function AdminAnalytics() {
  const { loading, error, data } = useQuery(GET_ADMIN_ANALYTICS);

  if (loading) return <CircularProgress />;
  if (error) return <Error message={error.message} />;

  const {
    totalRevenue,
    totalBookings,
    confirmedBookingsCount,
    cancelledBookingsCount,
    mostPopularPackages,
  } = data.getAdminAnalytics;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ marginBottom: "2rem", color: "orange", fontWeight: "600" }}>
        Admin Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem" }}>
            <Typography variant="h4" sx={{color: "orange"}}>Total Revenue</Typography>
            <Typography variant="h5" sx={{marginTop: "1rem"}}>${totalRevenue.toFixed(2)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem" }}>
            <Typography variant="h4" sx={{color: "orange"}}>Total Bookings: {totalBookings} </Typography>
              <Typography variant="h6" sx={{ marginTop: "1rem" }}>
              Confirmed: {confirmedBookingsCount}
            </Typography>
            <Typography variant="h6">
              Cancelled: {cancelledBookingsCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: "1rem" }}>
            <Typography variant="h4" sx={{color: "orange"}}>Most Popular Packages:</Typography>
            {mostPopularPackages.map((pkg) => (
              <Typography key={pkg.id} variant="body1"sx={{marginTop: "1rem"}}>
                {pkg.title} - ${pkg.price} ({pkg.destination})
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminAnalytics;
