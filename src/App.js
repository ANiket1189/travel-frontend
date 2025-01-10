import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PackageList from "./components/packages/PackageList";
import PackageDetail from "./components/packages/PackageDetail";
import UserProfile from "./components/profile/UserProfile";
import BookingList from "./components/bookings/BookingList";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/home/Home";
import AdminDashboard from "./components/admin/AdminDashboard";
import AddPackageForm from "./components/admin/AddPackageForm";
import UsersList from "./components/admin/UsersList";
import BookingsList from "./components/admin/BookingsList";
import AdminRoute from "./components/routes/AdminRoute";
import WishlistPage from "./components/wishlist/WishlistPage";
import PrivateRoute from "./components/routes/PrivateRoute";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<PackageList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/packages/:id" element={<PackageDetail />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-package"
                element={
                  <AdminRoute>
                    <AddPackageForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UsersList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <BookingsList />
                  </AdminRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <PrivateRoute>
                    <WishlistPage />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
