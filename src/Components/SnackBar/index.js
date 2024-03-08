import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const SnackBar = ({ data, handleClose }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'user':
        return <PersonIcon />;
      case 'file':
        return <InsertDriveFileIcon />;
      case 'error':
        return <LockIcon />;
      case 'success':
        return <LockOpenIcon />;
      default:
        return null;
    }
  };
  return (
    <Snackbar open={data.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={data.severity}
        icon={getIcon()}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {data.text}
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;
