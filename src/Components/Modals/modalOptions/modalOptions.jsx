
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
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';


export const ModalOptions = ({ open, onClose, anchorEl }) => {

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
            marginBottom: 2,
            ml: 8,
            position: 'fixed',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
              background: ""
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'fixed',
              top: 178,
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
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Typography sx={{ padding: '4px', mb: '5px', textAlign: "center" }}>
          Bem-vindo, kauan
        </Typography>

        <Divider />
        <Link href={"/mudarSenha"}>
          <MenuItem>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon> Editar Perfil
          </MenuItem>
        </Link>
        <Link href={"/logs"}>
          <MenuItem >
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            Logs
          </MenuItem>
        </Link>
        <Link href={"/usuarios"}>
          <MenuItem>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            Usuários
          </MenuItem>
        </Link>
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
