import { createTheme } from "@mui/material";
import { hover } from "@testing-library/user-event/dist/hover";

const theme = createTheme({
    palette: {
        background: {
            default: '#525252'
        },
        text: {
            primary: '#E4E4E4',
            secondary: '#e4e4e4'
        },
        primary: {
            main: '#00CC92',
            contrastText: '#191919'
        },
        secondary: {
            main: '#FFFFFF',
            contrastText: '#1B1B1B'
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
                color: 'primary'
            }
        }
    }
});

export default theme;