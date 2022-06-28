import { createTheme, PaletteMode } from "@mui/material";

const makeTheme = (mode: PaletteMode) => {
  let theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "dark"
      ?{
        //Colors for dark mode
        background: {
          default: '#292929',
          paper: "#292929"
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
          default: '#f7f7f7',
          paper: "#f7f7f7"
        },
        text: {
          primary: '#1b1b1b',
          secondary: "#1b1b1b",
        },
        primary: {
          main: '#32b38e',
        },
        secondary:{
          main: "#32b38e",
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
          },
          autoComplete:"off"
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
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderBottomColor: theme.palette.primary.contrastText    
          }
        }
      }
    }
  })

  return theme;
}

export default makeTheme ;