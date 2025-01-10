import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PACKAGE_BY_ID } from "../../graphql/queries";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../../graphql/mutations";
import { GET_USER_WISHLIST } from "../../graphql/queries";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  CardMedia,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Loading from "../common/Loading";
import Error from "../common/Error";
import BookingForm from "../bookings/BookingForm";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const UNSPLASH_ACCESS_KEY = "0zmau8I1GLU2Y_YYkW0CM92beDeHNLGNXcFdu8i7aSc";

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
  card: {
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    marginBottom: "1.5rem",
    color: "primary.main",
    fontWeight: 600,
  },
  imageContainer: {
    marginBottom: "2rem",
    borderRadius: "8px",
    overflow: "hidden",
    height: "500px",
    width: "100%",
  },
  cardMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
  },
  detailsBox: {
    backgroundColor: "background.paper",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: 1,
    marginBottom: "2rem",
  },
  bookingCard: {
    marginTop: "2rem",
    width: "100%",
  },
  wishlistButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
};

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [openBookingForm, setOpenBookingForm] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [priceInUSD, setPriceInUSD] = useState(0);

  const {
    loading: packageLoading,
    error,
    data,
    refetch,
  } = useQuery(GET_PACKAGE_BY_ID, {
    variables: { id, currency },
    fetchPolicy: "network-only",
  });

  const { data: wishlistData } = useQuery(GET_USER_WISHLIST, {
    variables: { userId },
    skip: !userId,
  });

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  useEffect(() => {
    if (data?.getPackageById) {
      setPriceInUSD(data.getPackageById.price);
      const fetchImage = async () => {
        if (!data.getPackageById.destination) return;

        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${data.getPackageById.destination} tourism&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }

          const imageData = await response.json();

          if (imageData.results && imageData.results.length > 0) {
            setImage(imageData.results[0].urls.regular);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching image:", error);
          setLoading(false);
        }
      };

      fetchImage();
    }
  }, [data]);

  useEffect(() => {
    if (currency) {
      refetch({ id, currency });
    }
  }, [currency, refetch, id]);

  useEffect(() => {
    if (wishlistData?.getUserWishlist) {
      const isInWishlist = wishlistData.getUserWishlist.some(
        (item) => item.packageId.id === id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistData, id]);

  const handleBookingClick = () => {
    if (!userId) {
      setBookingError("Please login to book a package");
      return;
    }
    setOpenBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setOpenBookingForm(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleWishlistToggle = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      if (isWishlisted) {
        console.log("Removing from wishlist...");
        const result = await removeFromWishlist({
          variables: { userId, packageId: id },
          refetchQueries: [{ query: GET_USER_WISHLIST, variables: { userId } }],
        });
        console.log("Remove result:", result);
      } else {
        console.log("Adding to wishlist...");
        const result = await addToWishlist({
          variables: { userId, packageId: id },
          refetchQueries: [{ query: GET_USER_WISHLIST, variables: { userId } }],
        });
        console.log("Add result:", result);
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (packageLoading) return <Loading />;
  if (error) {
    console.error("Error fetching package:", error);
    return <Error message={error.message} />;
  }

  const pkg = data?.getPackageById;
  if (!pkg) return <Typography>Package not found</Typography>;

  console.log("userId:", userId);
  console.log("wishlistData:", wishlistData);
  console.log("isWishlisted:", isWishlisted);

  return (
    <Box sx={styles.container}>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h4" sx={styles.title}>
            {pkg.title}
          </Typography>

          <Box sx={styles.imageContainer} position="relative">
            {userId && (
              <IconButton
                onClick={handleWishlistToggle}
                sx={{
                  ...styles.wishlistButton,
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 2,
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
                aria-label="add to wishlist"
              >
                {isWishlisted ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "black" }} />
                )}
              </IconButton>
            )}
            <CardMedia
              component="img"
              image={image || ""}
              alt={`${pkg.destination} destination`}
              sx={styles.cardMedia}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                About this package
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: 4,
                  textAlign: "justify",
                  lineHeight: 1.8,
                  letterSpacing: "0.3px",
                }}
              >
                {pkg.description}
              </Typography>

              {/* Currency Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={currency}
                  label="Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                  {/* Add more currency options as needed */}
                </Select>
              </FormControl>

              {/* Package Details */}
              <Box sx={styles.detailsBox}>
                <Typography variant="h6" gutterBottom>
                  Package Details
                </Typography>
                <Typography>
                  <strong>Price:</strong> {pkg.price} {currency}
                </Typography>
                <Typography>
                  <strong>Duration:</strong> {pkg.duration}
                </Typography>
                <Typography>
                  <strong>Destination:</strong> {pkg.destination}
                </Typography>
                <Typography>
                  <strong>Category:</strong> {pkg.category}
                </Typography>
                <Typography>
                  <strong>Available Slots:</strong> {pkg.availability}
                </Typography>
              </Box>

              {/* Booking Section */}
              <Card variant="outlined" sx={styles.bookingCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Book This Package
                  </Typography>
                  {bookingError && (
                    <Typography color="error" sx={{ mb: 2 }}>
                      {bookingError}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={!userId ? handleLoginRedirect : handleBookingClick}
                    disabled={pkg.availability <= 0}
                    sx={{ py: 1.5 }}
                  >
                    {!userId
                      ? "Login to Book"
                      : pkg.availability <= 0
                      ? "Not Available"
                      : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <BookingForm
        open={openBookingForm}
        handleClose={handleCloseBookingForm}
        packageId={id}
        packageTitle={pkg.title}
        price={priceInUSD}
      />
    </Box>
  );
}

export default PackageDetail;
