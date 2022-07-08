import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  Modal,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import LanguageContext from "./Context/LanguageContext";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.default",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

interface Props {
  open: boolean;
  onClose?: () => void;
}

/**
 * Modal that shows feedback form to send feedback.
 */
function FeedbackModal({ open, onClose }: Props) {
  const [feedbackText, setFeedbackText] = useState("");
  const [showLengthAlert, setShowLengthAlert] = useState(false);
  const translation = useContext(LanguageContext);

  const sendEmail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (feedbackText.length < 10) {
      setShowLengthAlert(true);
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/feedback/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: feedbackText,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode === 200) {
            setFeedbackText("");
            onClose && onClose();
          } else {
            throw Error(res.message);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Modal open={open} disableAutoFocus onClose={onClose}>
      <Stack sx={modalStyle} alignItems="center" direction="column" spacing={2}>
        <Typography variant="h3">{translation.titles.feedbackForm}</Typography>
        <Collapse in={showLengthAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                size="small"
                id="close-alert-btn"
                aria-label="close-alert"
                onClick={() => {
                  setShowLengthAlert(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {translation.alerts.alert.feedbackTooShort}
          </Alert>
        </Collapse>
        <Box sx={{ width: 1 }}>
          <TextField
            sx={{ width: 1 }}
            inputProps={{ maxLength: 256 }}
            multiline
            rows={4}
            onChange={(e) => {
              setFeedbackText(e.target.value);
              setShowLengthAlert(false);
            }}
            value={feedbackText}
          />
          <Typography id="fb-text-count-label" fontSize="small">
            {feedbackText.length}/256
          </Typography>
        </Box>
        <Button id="send-feedback-btn" onClick={(e) => sendEmail(e)}>
          {translation.inputs.buttons.send}
        </Button>
      </Stack>
    </Modal>
  );
}

export default FeedbackModal;
