import { createTheme, PaletteMode } from "@mui/material";

const makeTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "dark"
      ?{
        //Colors for dark mode
        background: {
          default: '#525252',
          paper: "#525252"
        },
        text: {
          primary: '#e4e4e4',
          secondary: "#e4e4e4",
        },
        primary: {
          main: '#00cc92',
        },
        secondary:{
          main: "#00cc92",
        },
      } 
      :{
        //Colors for light mode
        background: {
          default: '#fff',
          paper: "#fff"
        },
        text: {
          primary: '#191919',
          secondary: "#191919",
        },
        primary: {
          main: '#fc0303',
        },
        secondary:{
          main: "#fc0303",
        },   
      })
    }
  })

  theme = createTheme(theme, {
    components: {
      MuiTextField: {
        defaultProps: {
          sx: {
            width: 200,
          }
        },
        styleOverrides: {       
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.primary.main
              }
            }
          },
        }
      },
      MuiIconButton: {
        defaultProps: {
          color: 'primary',
          size: 'large',
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
            maxWidth: 160,
          },
          underline: {
            ":before":{
              borderBottomColor: theme.palette.primary.main
            },
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
  })

  return theme;
}

export default makeTheme ;