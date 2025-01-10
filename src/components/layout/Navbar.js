import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isHomePage = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > window.innerHeight * 0.7);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navStyles = {
    appBar: {
      backgroundColor: isHomePage
        ? isScrolled
          ? "#000000"
          : "transparent"
        : "#000000",
      boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
      transition: "all 0.3s ease",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 2rem",
    },
    logo: {
      color: "#FFFFFF",
      textDecoration: "none",
      fontSize: "2rem",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#FFA500",
      },
    },
    logoIcon: {
      fontSize: "2.5rem",
      color: "#FFA500",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#FFFFFF",
      },
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      "@media (max-width: 900px)": {
        display: "none",
      },
    },
    link: {
      color: "#FFFFFF",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      position: "relative",
      "&:hover": {
        color: "#FFA500",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        transform: "translateY(-2px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
    logoutButton: {
      backgroundColor: "#FFA500",
      color: "#FFFFFF",
      transition: "all 0.3s ease",
      fontWeight: "500",
      "&:hover": {
        backgroundColor: "#FF8C00",
      },
      "&:active": {
        backgroundColor: "#FFA500",
      },
    },
    activeLink: {
      color: "#FFA500",
      backgroundColor: "rgba(255, 165, 0, 0.1)",
    },
    menuButton: {
      display: "none",
      "@media (max-width: 900px)": {
        display: "block",
        color: "#FFFFFF",
        marginLeft: "auto",
      },
    },
    mobileMenu: {
      display: mobileMenuOpen ? "flex" : "none",
      "@media (max-width: 900px)": {
        position: "absolute",
        top: "64px",
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        flexDirection: "column",
        padding: "1rem",
        gap: "1rem",
        zIndex: 1000,
      },
    },
    mobileMenuItem: {
      width: "100%",
      textAlign: "center",
      padding: "0.8rem",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        color: "#FFA500",
      },
    },
  };

  const navItems = [
    {
      label: "Packages",
      path: "/packages",
      show: true,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
      show: userId,
    },
    {
      label: "My Bookings",
      path: "/bookings",
      show: userId || isAdmin,
    },
    {
      label: "Admin Dashboard",
      path: "/admin",
      show: isAdmin,
    },
    {
      label: "Profile",
      path: "/profile",
      show: userId,
    },
    {
      label: "Login",
      path: "/login",
      show: !userId,
    },
    {
      label: "Register",
      path: "/register",
      show: !userId,
    },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="fixed" sx={navStyles.appBar}>
      <Toolbar sx={navStyles.toolbar}>
        <Typography variant="h6" component={Link} to="/" sx={navStyles.logo}>
          <TravelExploreIcon sx={navStyles.logoIcon} />
          QuestTrails
        </Typography>

        <IconButton
          sx={navStyles.menuButton}
          aria-label="menu"
          onClick={handleMobileMenuToggle}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={navStyles.navLinks}>
          {navItems.map(
            (item) =>
              item.show && (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={navStyles.link}
                >
                  {item.label}
                </Button>
              )
          )}
          {userId && (
            <Button
              onClick={handleLogout}
              sx={navStyles.logoutButton}
              variant="contained"
            >
              Logout
            </Button>
          )}
        </Box>

        <Box sx={navStyles.mobileMenu}>
          {navItems.map(
            (item) =>
              item.show && (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={navStyles.mobileMenuItem}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              )
          )}
          {userId && (
            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              sx={{
                ...navStyles.logoutButton,
                width: "100%",
                margin: "0.5rem 0",
              }}
              variant="contained"
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
