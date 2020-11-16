import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core'

export const theme = createMuiTheme({
  "palette": {
    "common": {
      "black": "#000",
      "white": "#fff"
    },
    "background": {
      "paper": "#fff",
      "default": "#fafafa"
    },
    "primary": {
      "light": "#4f5b62",
      "main": "#263238",
      "dark": "#000a12",
      "contrastText": "#fff"
    },
    "secondary": {
      "light": "#eeffff",
      "main": "#bbdefb",
      "dark": "#8aacc8",
      "contrastText": "#fff"
    },
  }
});
export default theme;