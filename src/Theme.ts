import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: '#525252'
    },
    text: {
      primary: '#E4E4E4',
      secondary: "#e4e4e4"
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
        fullWidth: true
      },
      styleOverrides: {
        root: {
          maxWidth: 200,
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
        root: {
          maxWidth: 160
        },
        underline: {
          ":before":{
            borderBottom: '2px solid #00CC92'
          },
          ":after": {
            borderBottom: '2px solid #e4e4e4'
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        fullWidth: true,
        variant: 'contained'
      },
      styleOverrides: {
        root: {
          maxWidth: 200,
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        scrollPaper: {
          alignItems: 'flex-start',
        },
        paper: {
          color: '#191919'
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 800,
      }
    }
  }
});

export default theme;