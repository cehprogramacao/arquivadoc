
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
import KeyIcon from '@mui/icons-material/Key';


export const ModalOptions = ({ open, logout, onClose, anchorEl }) => {
  const [user, setUser] = useState("")
  const [isAdmin, setIsAdmin] = useState(false);



  const getUser = async () => {
    const { getUser } = new User()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await getUser(accessToken)
      console.log(data.user[0].name, '123123921')
      console.log(Object.values(data.user))
      setUser(data.user[0].name)
    } catch (error) {
      console.error("Erro ao buscar usuário!", error)
      throw error;
    }
  }

  useEffect(() => {
    getUser()
    const admin = sessionStorage.getItem("isAdmin");
    if (admin === "1") {
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
          {user && `Bem vindo, ${user}`}
        </Typography>

        <Divider />
        <Link href={"/update"}>
          <MenuItem>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon> Editar Perfil
          </MenuItem>
        </Link>
        <Link href={"/updatePassword"}>
          <MenuItem>
            <ListItemIcon>
              <KeyIcon fontSize="small" />
            </ListItemIcon> Mudar Senha
          </MenuItem>
        </Link>
        {isAdmin &&
          <Link href={"/logs"}>
            <MenuItem >
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              Logs
            </MenuItem>
          </Link>
        }
        {isAdmin &&
          <Link href={"/usuarios"}>
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
