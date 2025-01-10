import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFA500', // Orange
      light: '#FFB733',
      dark: '#CC8400',
    },
    secondary: {
      main: '#FFFFFF', // White
    },
    background: {
      default: '#000000', // Black
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
    },
    action: {
      hover: 'rgba(255, 165, 0, 0.1)', // Orange with opacity
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          color: '#FFFFFF',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#FFA500',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#FFB733',
          },
        },
        text: {
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        head: {
          color: '#FFA500',
          fontWeight: 'bold',
        },
      },
    },
  },
  typography: {
    fontFamily: ['Oswald', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Oswald, sans-serif',
    },
    h2: {
      fontFamily: 'Oswald, sans-serif',
    },
    h3: {
      fontFamily: 'Oswald, sans-serif',
    },
    h4: {
      fontFamily: 'Oswald, sans-serif',
    },
    h5: {
      fontFamily: 'Oswald, sans-serif',
    },
    h6: {
      fontFamily: 'Oswald, sans-serif',
    },
    body1: {
      fontFamily: 'Oswald, sans-serif',
    },
    body2: {
      fontFamily: 'Oswald, sans-serif',
    },
    button: {
      fontFamily: 'Oswald, sans-serif',
    },
  },
});

export default theme; 