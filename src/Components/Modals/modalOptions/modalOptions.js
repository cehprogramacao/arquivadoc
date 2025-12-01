
import React, { useEffect, useState } from 'react';
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
import User from '@/services/user.service';
import { extractDataFromSession } from '@/utils/auth';

const userSv = new User()

export const ModalOptions = ({ open, logout, onClose, anchorEl }) => {
  const [user, setUser] = useState([])
  const [isAdmin, setIsAdmin] = useState(false);
  const admin = localStorage.getItem("isAdmin");



  const getUser = async () => {
    try {
      const data = await extractDataFromSession()
      console.log(data, '91239219')
      setUser(data)
    } catch (error) {
      console.error("Erro ao buscar usuário!", error)
      throw error;
    }
  }

  useEffect(() => {
    getUser()
    if (admin === "1" || admin === 1) {
      setIsAdmin(true);
    }
  }, []);


  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={onClose}
        onClick={onClose}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Typography sx={{ padding: '4px', mb: '5px', textAlign: "center" }}>
          {user?.name && `Bem vindo, ${user?.name}`}
        </Typography>

        <Divider />
        <Link style={{
          textDecoration: "none"
        }} href={"/updatePassword"}>
          <MenuItem>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon> Alterar senha
          </MenuItem>
        </Link>
        {isAdmin &&
          <Link style={{
            textDecoration: "none"
          }} href={"/logs"} >
            <MenuItem >
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              Logs
            </MenuItem>
          </Link>
        }
        {isAdmin &&
          <Link style={{
            textDecoration: "none"
          }} href={"/usuarios"}>
            <MenuItem>
              <ListItemIcon>
                <GroupIcon fontSize="small" />
              </ListItemIcon>
              Usuários
            </MenuItem>
          </Link>
        }

        <MenuItem onClick={logout} >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
}
