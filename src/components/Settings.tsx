import { Modal, Typography, Stack, IconButton, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import * as React from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
};

interface Props {
  open: boolean,
  handleClose: () => void
};
const Settings = (props: Props) => {
  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Stack sx={style}>
          <Stack direction="row-reverse" alignItems="flex-start" justifyContent="space-between">
            <IconButton onClick={props.handleClose}>
              <CloseIcon/>
            </IconButton>
            <Typography variant="h6" component="h2">
              Settings
            </Typography>
          </Stack>
          <Switch />
        </Stack>
      </Modal>
    </div>
  );
}

export default Settings;