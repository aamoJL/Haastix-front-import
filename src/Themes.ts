import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: '#525252',
      paper: "#525252"
    },
    text: {
      primary: '#E4E4E4',
      secondary: "#e4e4e4",
    },
    primary: {
      main: '#00CC92',
      contrastText: '#191919'
    },
    secondary: {
      main: '#fff'
    },
    action: {
      active: '#00CC92',
      hover: '#fc0303'
    }
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        //color: 'primary',
        size: 'large',
      }
    },
    MuiTextField: {
      defaultProps: {
        //color: 'primary',
        sx: {
          width: 200
        }
      },
      // styleOverrides: {
      //   root: {
      //     "& .MuiOutlinedInput-root": {
      //       "& > fieldset": {
      //         borderColor: "#00CC92"
      //       }
      //     }
      //   }
      // }
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
          color: 'secondary'
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 800,
      }
    },
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

export {theme, darkTheme} ;