import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: '#525252'
    },
    text: {
      primary: '#E4E4E4',
      secondary: '#1B1B1B'
    },
    primary: {
      main: '#00CC92',
      contrastText: '#191919'
    }
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
        size: 'large',
      }
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& > fieldset": {
              borderColor: "#00CC92"
            }
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#e4e4e4'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root:{
          color: '#e4e4e4',
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          ":before":{
            borderBottom: '2px solid #00CC92'
          }
        }
      }
    }
  }
});

export default theme;