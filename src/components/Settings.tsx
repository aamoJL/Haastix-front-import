import { Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean,
  handleClose: (close: boolean) => void
};
const Settings = (props: Props) => {
  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Settings
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Settings;