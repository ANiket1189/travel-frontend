import { gql } from "@apollo/client";

//get packages query
export const GET_PACKAGES = gql`
  query GetPackages($search: String) {
    getPackages(search: $search) {
      id
      title
      description
      price
      duration
      destination
      category
      availability
      createdAt
    }
  }
`;

//get all packages query
export const GET_ALL_PACKAGES = gql`
  query GetAllPackages {
    getAllPackages {
      id
      title
      description
      price
      duration
      destination
      category
      availability
      createdAt
    }
  }
`;

//get package by id query with currency
export const GET_PACKAGE_BY_ID = gql`
  query GetPackageById($id: ID!, $currency: String) {
    getPackageById(id: $id, currency: $currency) {
      id
      title
      description
      price
      duration
      destination
      category
      availability
      createdAt
    }
  }
`;

//get user profile query
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUserProfile(userId: $userId) {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      createdAt
    }
  }
`;

//get bookings query
export const GET_BOOKINGS = gql`
  query GetBookings($userId: ID!) {
    getBookings(userId: $userId) {
      id
      userId
      username
      packageId {
        id
        title
        description
        price
        duration
        destination
        category
      }
      date
      status
      createdAt
    }
  }
`;

//get filtered packages query
export const GET_FILTERED_PACKAGES = gql`
  query GetPackages($search: String, $filter: FilterInput) {
    getPackages(search: $search, filter: $filter) {
      id
      title
      description
      price
      duration
      destination
      category
      availability
      createdAt
    }
  }
`;

//get all users query
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      createdAt
    }
  }
`;

//get all bookings query
export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    getAllBookings {
      id
      userId
      username
      packageId {
        id
        title
        destination
        price
        duration
      }
      date
      status
      createdAt
    }
  }
`;

// Add this new query for getting user's wishlist
export const GET_USER_WISHLIST = gql`
  query GetUserWishlist($userId: ID!) {
    getUserWishlist(userId: $userId) {
      id
      userId
      packageId {
        id
        title
        description
        price
        duration
        destination
        category
        availability
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_ADMIN_ANALYTICS = gql`
  query GetAdminAnalytics {
    getAdminAnalytics {
      totalRevenue
      totalBookings
      confirmedBookingsCount
      cancelledBookingsCount
      mostPopularPackages {
        id
        title
        price
        destination
      }
    }
  }
`;
