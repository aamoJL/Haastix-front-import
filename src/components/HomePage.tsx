import { Link } from 'react-router-dom';
import {ReactComponent as Banner} from '../assets/banner.svg';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Palette, } from '@mui/material';
import LanguageContext from './Context/LanguageContext';
import { useContext } from 'react';

interface Props{
  palette: Palette
}

function HomePage({palette} : Props) {
  const translation = useContext(LanguageContext);

  return (
    <Stack justifyContent="flex-end" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true}/>
      <Banner style={{fill: palette.text.primary, color: palette.primary.main, maxWidth: "75%", maxHeight: "75%"}} />
      <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">{translation.inputs.buttons.createAChallenge}</Button>
      <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">{translation.inputs.buttons.joinAChallenge}</Button>
    </Stack>
  );
}

export default HomePage;