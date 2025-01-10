import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import Loading from "../common/Loading";
import Error from "../common/Error";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "80vh",
    marginBottom: "2rem",
    marginTop: "6rem",
    padding: "0 2rem",
  },
  paper: {
    width: "100%",
    maxWidth: "500px",
    padding: "2rem",
    backgroundColor: "#1F1F1F",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontWeight: 600,
    color: "primary.main",
    marginBottom: "2rem",
    textAlign: "center",
  },
  form: {
    mt: 3,
    "& .MuiTextField-root": {
      mb: 2,
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    mt: 3,
  },
};

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const userId = localStorage.getItem("userId");

  const {
    loading: profileLoading,
    error: profileError,
    data,
  } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    onCompleted: (data) => {
      setFormData((prev) => ({
        ...prev,
        firstName: data.getUserProfile.firstName || "",
        lastName: data.getUserProfile.lastName || "",
        phoneNumber: data.getUserProfile.phoneNumber || "",
        email: data.getUserProfile.email || "",
      }));
    },
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(
    UPDATE_PROFILE,
    {
      onCompleted: (data) => {
        if (data.updateUserProfile.token) {
          localStorage.setItem("token", data.updateUserProfile.token);
        }
        setUpdateSuccess(true);
        setIsEditing(false);
        setTimeout(() => setUpdateSuccess(false), 3000);
      },
      onError: (error) => {
        setUpdateError(error.message);
        setTimeout(() => setUpdateError(null), 3000);
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccess(false); // Reset success message when entering edit mode
    setUpdateError(null); // Reset error message when entering edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateSuccess(false);
    setUpdateError(null);
    // Reset form data to original values
    if (data && data.getUserProfile) {
      setFormData((prev) => ({
        ...prev,
        firstName: data.getUserProfile.firstName || "",
        lastName: data.getUserProfile.lastName || "",
        phoneNumber: data.getUserProfile.phoneNumber || "",
        email: data.getUserProfile.email || "",
        password: "",
        confirmPassword: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some((key) => {
      if (key === "password" || key === "confirmPassword") {
        return formData[key] !== "";
      }
      return data.getUserProfile[key] !== formData[key];
    });

    if (!hasChanges) {
      setUpdateError("No changes were made");
      setTimeout(() => setUpdateError(null), 3000);
      return;
    }

    try {
      const updateInput = { ...formData };
      if (!updateInput.password) {
        delete updateInput.password;
        delete updateInput.confirmPassword;
      }

      await updateProfile({
        variables: {
          userId,
          updateInput,
        },
      });
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  if (profileLoading) return <Loading />;
  if (profileError) return <Error message={profileError.message} />;

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Typography variant="h4" sx={styles.title}>
          User Profile
        </Typography>

        {updateSuccess && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            Profile updated successfully!
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {updateError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!isEditing}
          />

          {isEditing && (
            <>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Leave blank to keep current password"
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Confirm new password"
              />
            </>
          )}

          <Box sx={styles.buttonContainer}>
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default UserProfile;
