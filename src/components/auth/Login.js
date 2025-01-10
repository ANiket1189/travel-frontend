import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN } from "../../graphql/mutations";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("userId", data.login.id);
      localStorage.setItem("isAdmin", data.login.username === "admin");
      navigate("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          username,
          password,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>
        <Typography
          component={Link}
          to="/register"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            color: "primary.main",
            textDecoration: "none",
            textTransform: "capitalize",
            transition: "all 0.3s ease",
            "&:hover": {
              textDecoration: "underline",
              transform: "scale(1.05)",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            },
          }}
        >
          Or Create A New Account
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
