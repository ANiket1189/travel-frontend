import { useQuery, useMutation } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { GET_ALL_USERS } from '../../graphql/queries';
import { REMOVE_USER } from '../../graphql/mutations';

function UsersList() {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Fetch the list of users
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  // Mutation to remove a user
  const [removeUser] = useMutation(REMOVE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }], // Refetch user list after deletion
    onError: (error) => {
      console.error('Error removing user:', error.message);
    },
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">Error loading users: {error.message}</Typography>
      </Box>
    );
  }

  const users = data?.getAllUsers || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            mb: 3,
          }}
        >
          Registered Users
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 35,
                          height: 35,
                        }}
                      >
                        {user.username[0].toUpperCase()}
                      </Avatar>
                      <Typography>{user.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                  </TableCell>
                  <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {
                        if (user.username === 'admin') {
                          console.log("Admin user cannot be deleted");
                        } else {
                          if (window.confirm(`Are you sure you want to remove ${user.username}?`)) {
                            removeUser({ variables: { userId: user.id } });
                          }
                        }
                      }}
                      disabled={user.username === 'admin'}
                      sx={{ display: user.username === 'admin' ? 'none' : 'block' }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Container>
  );
}

export default UsersList;
