import React from "react";
import { Box, Container, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";

function Footer() {
  // const location = useLocation();

  // // Update the non-scrollable pages list - only login and packages are non-scrollable
  // const isNonScrollablePage = ['/login', '/packages'].includes(location.pathname);

  const footerStyles = {
    footer: {
      backgroundColor: "#121212",
      padding: "1rem 0",
      width: "100%",
      borderTop: "1px solid rgba(255, 165, 0, 0.1)",
      marginTop: "auto",
    },
    content: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "center", md: "flex-start" },
      gap: "1rem",
      color: "#FFFFFF",
    },
    section: {
      textAlign: { xs: "center", md: "left" },
    },
    companyName: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#FFA500",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      "&:hover": {
        color: "#FFB733",
        transform: "translateY(-2px)",
        transition: "all 0.3s ease",
      },
    },
    contactInfo: {
      marginBottom: "0.5rem",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.25rem",
      color: "#FFFFFF",
      "&:hover": {
        color: "#FFA500",
        transform: "translateX(5px)",
        transition: "all 0.3s ease",
      },
    },
    icon: {
      color: "#FFA500",
      fontSize: "1rem",
    },
    copyright: {
      marginTop: "1rem",
      textAlign: "center",
      color: "#FFFFFF",
      opacity: 0.8,
      borderTop: "1px solid rgba(255, 165, 0, 0.1)",
      paddingTop: "0.5rem",
      width: "100%",
    },
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Box sx={footerStyles.footerSpacer} />
      <Box component="footer" sx={footerStyles.footer}>
        <Container>
          <Box sx={footerStyles.content}>
            <Box sx={footerStyles.section}>
              <Link
                to="/"
                onClick={scrollToTop}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  Quest Trails
                </Typography>
              </Link>
              <Typography
                variant="body2"
                sx={{ opacity: 0.8, maxWidth: "300px" }}
              >
                Your trusted partner in creating unforgettable travel
                experiences.
              </Typography>
            </Box>

            <Box sx={footerStyles.section}>
              <Typography
                variant="h6"
                sx={{ color: "#FFA500", marginBottom: "1rem" }}
              >
                Contact Us
              </Typography>
              <Box sx={footerStyles.contactInfo}>
                <Typography sx={footerStyles.contactItem}>
                  <EmailIcon sx={footerStyles.icon} />
                  info@questtrails.com
                </Typography>
                <Typography sx={footerStyles.contactItem}>
                  <PhoneIcon sx={footerStyles.icon} />
                  +91 6969420690
                </Typography>
                <Typography sx={footerStyles.contactItem}>
                  <LocationOnIcon sx={footerStyles.icon} />
                  Bhubaneswar, Odisha, India
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={footerStyles.copyright}>
            &copy; {new Date().getFullYear()}{" "}
            <span style={{ color: "#FFA500" }}>QuestTrails</span>. All rights
            reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
