import { Link } from "react-router-dom"
import { ReactComponent as Banner } from "../assets/banner.svg"
import SettingsHomeButtons from "./SettingsHomeButtons"
import { Stack, Button, Palette } from "@mui/material"
import LanguageContext from "./Context/LanguageContext"
import { useContext } from "react"

interface Props {
  palette: Palette
}

/**
 * Component that will be rendered when the route has been set to "/"
 * Renders buttons to join or create a challenge room.
 */
function HomePage({ palette }: Props) {
  const translation = useContext(LanguageContext)

  return (
    <Stack justifyContent="flex-end" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true} />
      <Banner style={{ fill: palette.text.primary, color: palette.primary.main, maxWidth: "75%", maxHeight: "75%" }} />
      <Button sx={{ maxWidth: 200 }} component={Link} to="/create" id="createChallenge-btn">
        {translation.inputs.buttons.createAChallenge}
      </Button>
      <Button sx={{ maxWidth: 200 }} component={Link} to="/game" id="joinChallenge-btn">
        {translation.inputs.buttons.joinAChallenge}
      </Button>
    </Stack>
  )
}

export default HomePage
