import { Link } from 'react-router-dom';
import {ReactComponent as Banner} from '../assets/banner.svg';
import banner from '../assets/banner.svg'
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box, PaletteColor } from '@mui/material';
import { Translation } from '../translations';

interface Props{
  translation: Translation,
  themeColor: PaletteColor
}

function HomePage({translation, themeColor} : Props) {
  return (
    <Stack justifyContent="flex-end" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true}/>
      <Box component="img" src={banner} alt="Banner" sx={{mb:6, width: 0.75, height: 0.75, maxWidth: 824 , maxHeight: 282}}/>
      <Banner style={{color: themeColor.main}} />
      <Box sx={{height: 150}}/>
      <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">{translation.inputs.buttons.createAChallenge}</Button>
      <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">{translation.inputs.buttons.joinAChallenge}</Button>
    </Stack>
  );
}

export default HomePage;