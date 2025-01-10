import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PACKAGES } from "../../graphql/queries";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Zoom,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import Error from "../common/Error";
import ExploreIcon from "@mui/icons-material/Explore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PackageCard from "../packages/PackageCard";

function Home() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ALL_PACKAGES);

  if (loading) return <Loading />;
  if (error) return <Error message="Error loading packages" />;

  const featuredPackages = data?.getAllPackages?.slice(0, 4) || [];

  const styles = {
    hero: {
      position: "relative",
      backgroundColor: "grey.800",
      color: "#fff",
      mb: 4,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: "url(https://wallpapercave.com/wp/wp1841861.jpg)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "-64px",
      paddingTop: "64px",
    },
    overlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      background: `linear-gradient(
        to bottom,
        rgba(0,0,0,0.6) 0%,
        rgba(0,0,0,0.6) 80%,
        rgba(0,0,0,0.9) 100%
      )`,
    },
    featuredSection: {
      py: 8,
      borderRadius: "16px",
      my: 4,
      px: 2,
    },
    exploreSection: {
      textAlign: "center",
      py: 10,
      px: 3,
      position: "relative",
      backgroundImage: "url(https://wallpapercave.com/wp/wp3558817.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          to bottom,
          rgba(0,0,0,0.4) 0%,
          rgba(0,0,0,0.4) 80%,
          rgba(0,0,0,0.7) 100%
        )`,
        zIndex: 1,
      },
      "& > *": {
        position: "relative",
        zIndex: 2,
      },
    },
    exploreIcon: {
      fontSize: "4rem",
      color: "#FFA500",
      marginBottom: "1rem",
    },
    exploreButton: {
      mt: 4,
      py: 2,
      px: 6,
      fontSize: "1.2rem",
      backgroundColor: "#FFA500",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#FFB733",
        transform: "scale(1.05)",
        boxShadow: "0 6px 8px rgba(0,0,0,0.2)",
      },
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    aboutSection: {
      position: "relative",
      backgroundImage: "url(https://wallpapercave.com/wp/wp3558817.jpg)", // Mountain landscape
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", // Parallax effect
      py: 12,
      px: 3,
      mt: 8,
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          to right,
          rgba(0,0,0,0.9) 0%,
          rgba(0,0,0,0.7) 50%,
          rgba(0,0,0,0.9) 100%
        )`,
        zIndex: 1,
      },
    },
    aboutContent: {
      position: "relative",
      zIndex: 2,
      textAlign: { xs: "center", md: "justify" },
      maxWidth: "1200px",
      margin: "0 auto",
      padding: { xs: "20px", md: "40px" },
    },
    aboutTitle: {
      color: "#FFA500",
      fontWeight: "bold",
      mb: 6,
      fontSize: { xs: "2.5rem", md: "3.5rem" },
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
      textAlign: { xs: "center", md: "left" },
      letterSpacing: "0.05em",
    },
    aboutText: {
      color: "#FFFFFF",
      fontSize: { xs: "1.1rem", md: "1.25rem" },
      lineHeight: 2,
      maxWidth: "900px",
      mb: 4,
      opacity: 0.9,
      textAlign: "justify",
      letterSpacing: "0.03em",
      wordSpacing: "0.1em",
      "& + &": {
        mt: 3,
      },
    },
  };

  return (
    <div>
      <Paper sx={styles.hero}>
        <Box sx={styles.overlay} />
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            textAlign: "left",
            alignSelf: "flex-start",
            mt: "120px",
            ml: { xs: "30px", md: "80px" },
            maxWidth: "800px !important",
          }}
        >
          <Fade in={true} timeout={1000}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "3rem",
                  sm: "4rem",
                  md: "5rem",
                },
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Discover Your Next Adventure
            </Typography>
          </Fade>
          <Fade in={true} timeout={1500}>
            <Typography
              variant="h5"
              color="inherit"
              paragraph
              sx={{
                mb: 4,
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                maxWidth: "600px",
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.8rem",
                  md: "2rem",
                },
                lineHeight: 1.3,
              }}
            >
              Explore our handpicked travel packages and create unforgettable
              memories
            </Typography>
          </Fade>
          <Fade in={true} timeout={2000}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/packages")}
              sx={{
                ...styles.exploreButton,
                alignSelf: "flex-start",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.4rem" },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 6 },
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "1.8rem" }} />}
            >
              View All Packages
            </Button>
          </Fade>
        </Container>
      </Paper>

      <Container sx={styles.featuredSection}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#FFA500",
          }}
        >
          Featured Packages
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{
            mb: 6,
            color: "#FFFFFF",
          }}
        >
          Check out our most popular travel destinations
        </Typography>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* First row - two packages */}
          {featuredPackages.slice(0, 2).map((pkg, index) => (
            <Grid item xs={12} md={6} key={pkg.id}>
              <Zoom in={true} timeout={500 + index * 250}>
                <Box
                  sx={{
                    "& .MuiPaper-root": {
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 12px 24px rgba(255, 165, 0, 0.2)",
                      },
                    },
                  }}
                >
                  <PackageCard package={pkg} data={data} />
                </Box>
              </Zoom>
            </Grid>
          ))}

          {/* Second row - two packages */}
          {featuredPackages.slice(2, 4).map((pkg, index) => (
            <Grid item xs={12} md={6} key={pkg.id}>
              <Zoom in={true} timeout={1000 + index * 250}>
                <Box
                  sx={{
                    "& .MuiPaper-root": {
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 12px 24px rgba(255, 165, 0, 0.2)",
                      },
                    },
                  }}
                >
                  <PackageCard package={pkg} data={data} />
                </Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Box sx={styles.aboutSection}>
          <Container sx={styles.aboutContent}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h2" sx={styles.aboutTitle}>
                  About QuestTrails
                </Typography>
                <Typography sx={styles.aboutText}>
                  Welcome to QuestTrails, where every journey becomes an
                  unforgettable adventure. We specialize in crafting exceptional
                  travel experiences that cater to your wanderlust and desire
                  for discovery. Our carefully curated packages combine
                  breathtaking destinations, comfortable accommodations, and
                  immersive activities to create the perfect getaway.
                </Typography>
                <Typography sx={styles.aboutText}>
                  With years of expertise in the travel industry, we understand
                  that each traveler is unique. That's why we offer a diverse
                  range of packages, from thrilling adventure tours to relaxing
                  beach retreats, ensuring there's something for everyone. Our
                  commitment to quality service, attention to detail, and
                  passion for travel makes us your ideal partner in exploring
                  the world.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/packages")}
                  sx={{
                    ...styles.exploreButton,
                    mt: 4,
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Your Adventure
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={styles.exploreSection}>
          <ExploreIcon sx={styles.exploreIcon} />
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#FFA500",
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              color: "#FFFFFF",
            }}
          >
            Browse all our available packages and find your perfect destination.
            Let us help you create memories that will last a lifetime.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/packages")}
            sx={styles.exploreButton}
            endIcon={<ArrowForwardIcon />}
          >
            Explore All Packages
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Home;
