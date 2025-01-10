import { gql } from "@apollo/client";
//login mutation
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      token
      username
    }
  }
`;
//register mutation
export const REGISTER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      id
      email
      token
      username
    }
  }
`;
//create booking mutation
export const CREATE_BOOKING = gql`
  mutation CreateBooking($packageId: ID!, $userId: ID!, $date: String!) {
    createBooking(packageId: $packageId, userId: $userId, date: $date) {
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
      date
      status
      createdAt
    }
  }
`;
//update profile mutation
export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile($userId: ID!, $updateInput: UpdateUserInput!) {
    updateUserProfile(userId: $userId, updateInput: $updateInput) {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      token
    }
  }
`;
//cancel booking mutation
export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!, $userId: ID!) {
    cancelBooking(bookingId: $bookingId, userId: $userId) {
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
      date
      status
      createdAt
    }
  }
`;
//add travel package mutation
export const ADD_TRAVEL_PACKAGE = gql`
  mutation AddTravelPackage(
    $title: String!
    $description: String!
    $price: Float!
    $duration: String!
    $destination: String!
    $category: String!
    $availability: Int!
  ) {
    addTravelPackage(
      title: $title
      description: $description
      price: $price
      duration: $duration
      destination: $destination
      category: $category
      availability: $availability
    ) {
      id
      title
      description
      price
      duration
      destination
      category
      availability
    }
  }
`;
//edit travel package mutation
export const EDIT_TRAVEL_PACKAGE = gql`
  mutation EditTravelPackage(
    $packageId: ID!
    $title: String!
    $description: String!
    $price: Float!
    $duration: String!
    $destination: String!
    $category: String!
    $availability: Int!
  ) {
    editTravelPackage(
      packageId: $packageId
      title: $title
      description: $description
      price: $price
      duration: $duration
      destination: $destination
      category: $category
      availability: $availability
    ) {
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
//delete travel package mutation
export const DELETE_TRAVEL_PACKAGE = gql`
  mutation DeleteTravelPackage($packageId: ID!) {
    deleteTravelPackage(packageId: $packageId) {
      id
    }
  }
`;
//remove user mutation
export const REMOVE_USER = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      id
      message
    }
  }
`;
// Add to wishlist mutation
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($userId: ID!, $packageId: ID!) {
    addToWishlist(userId: $userId, packageId: $packageId) {
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
      }
      createdAt
    }
  }
`;

// Remove from wishlist mutation
export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($userId: ID!, $packageId: ID!) {
    removeFromWishlist(userId: $userId, packageId: $packageId) {
      id
      userId
      packageId {
        id
        title
      }
    }
  }
`;
