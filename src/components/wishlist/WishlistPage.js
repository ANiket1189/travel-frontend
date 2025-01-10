import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_WISHLIST } from "../../graphql/queries";
import { REMOVE_FROM_WISHLIST } from "../../graphql/mutations";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import Error from "../common/Error";

const styles = {
  container: {
    marginTop: "6rem",
    marginBottom: "2rem",
    minHeight: "calc(100vh - 8rem)",
    display: "flex",
    flexDirection: "column",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  cardMedia: {
    height: 200,
  },
  deleteButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
  wishlistTitle: {
    color: "orange",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  emptyMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    fontSize: "x-large",
    textAlign: "center",
  },
  exploreButton: {
    mt: 2,
    fontSize: "large",
    padding: "12px 24px",
  },
  footer: {
    marginTop: "auto",
  },
};

const UNSPLASH_ACCESS_KEY = "0zmau8I1GLU2Y_YYkW0CM92beDeHNLGNXcFdu8i7aSc";

function WishlistPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [packageImages, setPackageImages] = useState({});

  const { loading, error, data } = useQuery(GET_USER_WISHLIST, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const fetchImages = async () => {
      if (data?.getUserWishlist) {
        const images = {};
        for (const item of data.getUserWishlist) {
          try {
            const response = await fetch(
              `https://api.unsplash.com/search/photos?query=${item.packageId.destination} tours&travel&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
            );
            const imageData = await response.json();
            if (imageData.results && imageData.results.length > 0) {
              images[item.packageId.id] = imageData.results[0].urls.regular;
            }
          } catch (error) {
            console.error("Error fetching image:", error);
          }
        }
        setPackageImages(images);
      }
    };

    fetchImages();
  }, [data]);

  console.log("WishlistPage data:", data);

  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  if (!userId) {
    navigate("/login");
    return null;
  }

  if (loading) return <Loading />;
  if (error) {
    console.error("Wishlist error:", error);
    return <Error message={error.message} />;
  }

  const handleRemoveFromWishlist = async (packageId) => {
    try {
      await removeFromWishlist({
        variables: { userId, packageId },
        refetchQueries: [{ query: GET_USER_WISHLIST, variables: { userId } }],
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <Container sx={styles.container}>
      <Typography variant="h4" sx={styles.wishlistTitle}>
        My Wishlist
      </Typography>

      <Grid container spacing={3}>
        {data?.getUserWishlist?.length === 0 ? (
          <Grid item xs={12} sx={styles.emptyMessage}>
            <Typography variant="h6" sx={{ fontSize: "x-large" }}>
              Your wishlist is empty. Start exploring packages to add some!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={styles.exploreButton}
              onClick={() => navigate("/packages")}
            >
              Explore Packages
            </Button>
          </Grid>
        ) : (
          data?.getUserWishlist?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={styles.card}>
                <CardMedia
                  component="img"
                  sx={styles.cardMedia}
                  image={
                    packageImages[item.packageId.id] ||
                    `https://source.unsplash.com/random?${item.packageId.destination}`
                  }
                  alt={item.packageId.title}
                />
                <IconButton
                  sx={styles.deleteButton}
                  onClick={() => handleRemoveFromWishlist(item.packageId.id)}
                >
                  <DeleteIcon sx={{ color: "black" }} />
                </IconButton>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.packageId.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.packageId.destination}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${item.packageId.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/packages/${item.packageId.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={styles.footer}>{/* Footer content here */}</Box>
    </Container>
  );
}

export default WishlistPage;
