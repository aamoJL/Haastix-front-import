import { Link } from 'react-router-dom';
import {ReactComponent as Banner} from '../assets/banner.svg';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box, Palette, } from '@mui/material';
import { Translation } from '../translations';

interface Props{
  translation: Translation,
  palette: Palette
}

function HomePage({translation, palette} : Props) {
  return (
    <Stack justifyContent="flex-end" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true}/>
      <Banner style={{fill: palette.text.primary, color: palette.primary.main, maxWidth: "75%", maxHeight: "75%"}} />
      <Box sx={{height: 150}}/>
      <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">{translation.inputs.buttons.createAChallenge}</Button>
      <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">{translation.inputs.buttons.joinAChallenge}</Button>
    </Stack>
  );
}

export default HomePage;