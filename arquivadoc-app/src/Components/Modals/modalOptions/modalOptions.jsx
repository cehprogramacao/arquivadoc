
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Typography } from '@mui/material';
import createRoutes from '@/routes/index.routes';

export const ModalOptions = ({open, onClose, anchorEl}) => {
  const router = createRoutes()
  const handleRouter = () => {
    onClose(),
    router.goToPageLogs()
  }
  return (
    <React.Fragment>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={onClose}
        onClick={onClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            ml: 8,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 158,
              right: 0,
              left: -5,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <Typography sx={{padding: '4px', textAlign: "center"}}>
          Bem-vindo, kauan
        </Typography>
        <MenuItem onClick={onClose}>
          <Avatar /> Editar Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleRouter}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Logs
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Usuários
        </MenuItem>
        <MenuItem onClick={onClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
