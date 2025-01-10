import { gql } from '@apollo/client';

//booking created subscription
export const BOOKING_CREATED = gql`
  subscription OnBookingCreated {
    bookingCreated {
      id
      packageId
      userId
      date
      status
      createdAt
    }
  }
`;
//booking cancelled subscription
export const BOOKING_CANCELLED = gql`
  subscription OnBookingCancelled {
    bookingCancelled {
      id
      packageId
      userId
      date
      status
      createdAt
    }
  }
`; 