import { createTheme, PaletteMode } from "@mui/material"

const makeTheme = (mode: PaletteMode, color: string, style: string) => {
  let theme = createTheme()
  //Switch different colors
  switch(color) {
    case "green":
      //Colors for green theme
      theme = createTheme({
        palette: {
          mode: mode,
          ...(mode === "dark" ? 
            {
              //Colors for dark mode
              background: {
                default: "#292929",
                paper: "#292929",
              },
              text: {
                primary: "#e4e4e4",
                secondary: "#e4e4e4",
              },
              primary: {
                main: "#00cc92",
              },
              secondary: {
                main: "#00cc92",
              },
            } : 
            {
              //Colors for light mode
              background: {
                default: "#f7f7f7",
                paper: "#f7f7f7",
              },
              text: {
                primary: "#1b1b1b",
                secondary: "#1b1b1b",
              },
              primary: {
                main: "#32b38e",
              },
              secondary: {
                main: "#32b38e",
              },
            }
          )
        }
      })
    break
    case "red":
      //Colors for theme2
      theme = createTheme({
        palette: {
          mode: mode,
          ...(mode === "dark" ? 
            {
              //Colors for dark mode
              background: {
                default: "#292929",
                paper: "#292929",
              },
              text: {
                primary: "#e4e4e4",
                secondary: "#e4e4e4",
              },
              primary: {
                main: "#fc0303",
              },
              secondary: {
                main: "#fc0303",
              },
            } : 
            {
              //Colors for light mode
              background: {
                default: "#f7f7f7",
                paper: "#f7f7f7",
              },
              text: {
                primary: "#1b1b1b",
                secondary: "#1b1b1b",
              },
              primary: {
                main: "#9e0001",
              },
              secondary: {
                main: "#9e0001",
              },
            }
          )
        }
      })
    break
    default:
    break
  }

  switch(style) {
    case "1":
      //Create global styling for components
      theme = createTheme(theme, {
        components: {
          MuiTypography: {
            styleOverrides: {
              h3: {
                textAlign: "center",
              },
              h2: {
                textAlign: "center",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              sx: {
                width: 200,
              },
              autoComplete: "off",
            },
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            },
          },
          MuiIconButton: {
            defaultProps: {
              color: "primary",
              size: "large",
            },
          },
          MuiInput: {
            defaultProps: {
              autoComplete: "off"
            },
            styleOverrides: {
              root: {
                maxWidth: 160,
              },
              underline: {
                ":before": {
                  borderBottomColor: theme.palette.primary.main,
                },
              },
            },
          },
          MuiButton: {
            defaultProps: {
              fullWidth: true,
              variant: "contained",
            },
            styleOverrides: {
              root: {
                maxWidth: 200,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              scrollPaper: {
                alignItems: "flex-start",
              },
            },
          },
          MuiTooltip: {
            defaultProps: {
              arrow: true,
              enterDelay: 800,
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderBottomColor: theme.palette.primary.contrastText,
              },
            },
          },
        },
      })
    break
    case "2":
      //Create global styling for components
      theme = createTheme(theme, {
        components: {
          MuiTypography: {
            styleOverrides: {
              h3: {
                textAlign: "center",
              },
              h2: {
                textAlign: "center",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "filled",
              sx: {
                width: 200,
              },
              autoComplete: "off",
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              underline: {
                ":before": {
                  borderColor: theme.palette.primary.main
                }
              }
            }
          },
          MuiIconButton: {
            defaultProps: {
              color: "primary",
              size: "large",
            },
          },
          MuiInput: {
            defaultProps: {
              autoComplete: "off"
            },
            styleOverrides: {
              root: {
                maxWidth: 160,
              },
              underline: {
                ":before": {
                  borderBottomColor: theme.palette.primary.main,
                },
              },
            },
          },
          MuiButton: {
            defaultProps: {
              fullWidth: true,
              variant: "outlined",
            },
            styleOverrides: {
              root: {
                maxWidth: 200,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              scrollPaper: {
                alignItems: "flex-start",
              },
            },
          },
          MuiTooltip: {
            defaultProps: {
              arrow: true,
              enterDelay: 800,
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderBottomColor: theme.palette.primary.contrastText,
              },
            },
          },
        },
      })
    break
    default:
    break
  }

  return theme
}

export default makeTheme
