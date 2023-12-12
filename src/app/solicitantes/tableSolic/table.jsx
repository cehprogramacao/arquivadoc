import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useTheme, useMediaQuery, Typography } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E9E9E9",
    color: theme.palette.common.black,
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    fontSize: 16
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  padding: '10px 22px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const UserTable = ({ data, onClick }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))


  return (
    <TableContainer component={Paper} sx={{ maxWidth: '1080px', margin: '0 auto', marginTop: '30px' }}>
      {isSmallScreen ?
        <Table sx={{ maxWidth: '100%' }} >
          <TableBody >
            {data.map((row, index) => (
              <React.Fragment key={index}>
                {Object.entries(row).map(([key, value]) => (
                  <StyledTableRow key={key} >
                    <TableCell>
                      <Typography variant="body1">{key}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{value}</Typography>
                    </TableCell>
                  </StyledTableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Button sx={{
                      fontSize: '15px',
                      textTransform: 'none',
                      color: '#ea1010',
                      background: 'transparent',
                      border: '1px solid #EA1010',
                      ":hover": {
                        background: '#EA1010',
                        color: '#fff'
                      }
                    }} onClick={() => onClick(row.id)}>
                      Excluir
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button sx={{
                      fontSize: '15px',
                      textTransform: 'none',
                      color: '#ffd500',
                      background: 'transparent',
                      border: '1px solid #FFD500',
                      ":hover": {
                        background: '#FFD500',
                        color: '#fff'
                      }
                    }} onClick={() => onClick(row.id)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        :
        <Table sx={{ maxWidth: '100%' }} >
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align='center'>Nome</StyledTableCell>
              <StyledTableCell align='center'>Excluir</StyledTableCell>
              <StyledTableCell align='center'>Editar</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align='left'>{row.id}</StyledTableCell>
                <StyledTableCell align='center'>{row.nome}</StyledTableCell>
                <StyledTableCell align='center'>
                  <Button sx={{
                    fontSize: '15px',
                    textTransform: 'none',
                    left: '0',
                    color: 'black',
                    background: 'transparent',
                    border: '1px solid #EA1010',
                    color: '#EA1010',
                    ":hover": {
                      background: '#EA1010',
                      color: '#fff'
                    }
                  }} onClick={() => onClick(row.id)}>
                    Excluir
                  </Button>
                </StyledTableCell>
                <StyledTableCell align='center' >
                  <Link href={"/editarSolicitantes"}>
                    <Button sx={{
                      fontSize: '15px',
                      textTransform: 'none',
                      color: 'black',
                      background: 'transparent',
                      border: '1px solid #FFD500',
                      color: '#FFD500',
                      ":hover": {
                        background: '#FFD500',
                        color: '#fff'
                      }
                    }}>
                      Editar
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      }
    </TableContainer>
  );
}
