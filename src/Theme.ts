import { createTheme, PaletteOptions } from "@mui/material";

const palette: PaletteOptions = {
  mode: "light",
  background: {
    default: '#525252',
    paper: "#525252"
  },
  text: {
    primary: '#e4e4e4',
    secondary: "#e4e4e4",
  },
  primary: {
    main: '#00CC92',
  },
  secondary:{
    main: "#00cc92",
  },
}

// const palette2: PaletteOptions = {
//   background: {
//     default: "#cfd8dc",
//     paper: "#cfd8dc"
//   },
//   text: {
//     primary: "#212121",
//     secondary: "#212121"
//   },
//   primary: {
//     main: "#6200ea"
//   }
// }


const theme = createTheme({
  palette: palette,
  components: {
    MuiIconButton: {
      defaultProps: {
        color: 'primary',
        size: 'large',
      }
    },
    MuiTextField: {
      defaultProps: {
        sx: {
          width: 200
        }
      },
      styleOverrides: {       
      //   root: {
      //     "& .MuiOutlinedInput-root": {
      //       "& fieldset": {
      //         borderColor: "#00CC92"
      //       }
      //     }
      //   },
      }
    },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     notchedOutline: {
    //       borderColor: "#00cc92"
    //     }
    //   }
    // },
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

export default theme ;