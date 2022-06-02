import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: '#525252'
    },
    text: {
      primary: '#E4E4E4',
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
        color: 'primary',
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
          },
          ":after": {
            borderBottom: '2px solid #e4e4e4'
          }
        }
      }
    }
  }
});

export default theme;