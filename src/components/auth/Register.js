import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../../graphql/mutations";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.register.token);
      localStorage.setItem("userId", data.register.id);
      navigate("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        variables: {
          registerInput: formData,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      marginBottom: "2rem",
      marginTop: "4rem",
    },
    paper: {
      p: 4,
      mt: 4,
      width: "100%",
    },
  };

  return (
    <Container maxWidth="xs" sx={styles.container}>
      <Paper elevation={3} sx={styles.paper}>
        <Typography component="h1" variant="h5" align="center">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
