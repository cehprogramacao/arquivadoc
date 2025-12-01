import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyIcon from '@mui/icons-material/Key'
import { useDispatch, useSelector } from 'react-redux';
import { hideAlert } from '@/store/actions';


const SnackBar = ({ open, message, alertType, severity, onClose}) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose()
  };
  const getIcon = () => {
    switch (alertType) {
      case 'user':
        return <PersonIcon />;
      case 'key':
        return <KeyIcon />;
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
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} >
      <Alert
        variant='filled'
        onClose={handleClose}
        severity={severity === "success" ? "success" : "error"}
        icon={getIcon()}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;
