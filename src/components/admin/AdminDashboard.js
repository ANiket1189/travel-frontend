import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import AddPackageForm from "./AddPackageForm";
import BookingsList from "./BookingsList";
import PackageList from "./PackageList";
import UsersList from "./UsersList";
import AdminAnalytics from "./AdminAnalytics";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    title: {
      color: (theme) => theme.palette.primary.main,
      fontWeight: 600,
      marginBottom: "2rem",
    },
    tabs: {
      borderBottom: 1,
      borderColor: "divider",
      marginBottom: "1rem",
    },
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Typography variant="h4" sx={styles.title}>
          Admin Dashboard
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={styles.tabs}>
          <Tab label="Add Package" />
          <Tab label="Manage Packages" />
          <Tab label="Users" />
          <Tab label="Bookings" />
          <Tab label="Analytics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AddPackageForm />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PackageList />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UsersList />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <BookingsList />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <AdminAnalytics />
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default AdminDashboard;
