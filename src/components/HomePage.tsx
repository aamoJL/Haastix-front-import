import { Link } from 'react-router-dom';
import banner from '../assets/banner.svg';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box } from '@mui/material';
import { getTranslation, Language } from '../Translation';

interface Props{
  language: Language
}

function HomePage({language} : Props) {
  return (
    <Stack justifyContent="flex-end" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true}/>
      <Box component="img" src={banner} alt="Logo" sx={{mb:6, width: 0.75, height: 0.75, maxWidth: 824 , maxHeight: 282}}/>
      <Box sx={{height: 150}}/>
      <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">{getTranslation(language, "CreateAChallenge")}</Button>
      <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">{getTranslation(language, "JoinAChallenge")}</Button>
    </Stack>
  );
}

export default HomePage;