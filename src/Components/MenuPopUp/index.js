import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/material';
import { Delete, FileOpen, Print } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModalList from '../Modals/ModalList';
import RGI from '@/services/rgi.service';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const MenuOptionsFile = ({ open, anchorEl,  handleClose, data, prenotation }) => {
  const path = usePathname().split("/")[1]
  const [openPDF, setOpenPDF] = useState(false)
  const [dataFile, setDataFile] = useState([])

  const handleOpenModalPDF = async () => {
    const { getByPrenotation } = new RGI()
    try {
      setOpenPDF(true)
      const accessToken = sessionStorage.getItem("accessToken")
      const response = await getByPrenotation(prenotation, accessToken)
      console.log(response.data, 'PDFF')
      setDataFile(response.data)
      return response.data
    } catch (error) {
        console.error("Erro ao listar dados!", error)
        throw error;
    }
  }

  const handleCloseModalPDF = async () => {
    setOpenPDF(false)
  }

  return (
    <>
      <Box>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Link href={`/${path}/[prenotation]`} as={`/${path}/${prenotation}`}>
            <MenuItem sx={{color: "#FFD500"}} onClick={handleClose} disableRipple >
              <EditIcon sx={{ fill: '#FFD500' }} />
              Editar
            </MenuItem>
          </Link>
          <MenuItem sx={{color: "#0088F0"}} onClick={() => {
            handleClose()
            handleOpenModalPDF()
          }} disableRipple>
            <FileOpen sx={{ fill: '#0088F0' }} />
            Abrir Arquivo
          </MenuItem>
          <Divider sx={{ my:0 }} />
          <MenuItem sx={{color: '#dc3545'}} onClick={handleClose} disableRipple>
            <Delete sx={{ fill: '#dc3545' }} />
            Deletar
          </MenuItem>
        </StyledMenu>
      </Box>
      <ModalList data={dataFile} onClose={handleCloseModalPDF} open={openPDF} prenotation={prenotation} />
    </>
  );
}

export default MenuOptionsFile