import { Snackbar, Alert } from '@mui/material';

interface MessageProps {
  messageText: string;
  setMessage: (msg: string) => void;
  messageType: 'error' | 'success';
}

export default function Message({ messageText, setMessage, messageType }: MessageProps) {
  return (
    <Snackbar
      open={!!messageText}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={() => setMessage('')}
    >
      <Alert
        onClose={() => setMessage('')}
        severity={messageType === 'error' ? 'error' : 'success'}
      >
        {messageText}
      </Alert>
    </Snackbar>
  );
}
