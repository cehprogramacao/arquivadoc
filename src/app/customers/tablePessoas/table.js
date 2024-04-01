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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const UserTable = ({ data, onClick }) => {

  const dataArray = Array.isArray(data) ? data : Object.values(data)



  return (
    <TableContainer component={Paper} sx={{ width: "100%", margin: '0 auto', marginTop: '30px' }}>
      <Table sx={{ maxWidth: '100%' }} >
        <TableHead>
          <TableRow>
            <StyledTableCell>DOCUMENTO</StyledTableCell>
            <StyledTableCell align='center'>TIPO</StyledTableCell>
            <StyledTableCell align='center'>NOME COMPLETO</StyledTableCell>
            <StyledTableCell align='center'>Excluir</StyledTableCell>
            <StyledTableCell align='center'>Editar</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
          {dataArray.length > 0 && dataArray.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align='left'>{row.cpfcnpj}</StyledTableCell>
              <StyledTableCell align='center' >{row.type}</StyledTableCell>
              <StyledTableCell align='center' sx={{ textTransform: 'uppercase' }}>{row.name}</StyledTableCell>
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
                }} onClick={() => onClick(row.cpfcnpj)}>
                  Excluir
                </Button>
              </StyledTableCell>
              <StyledTableCell align='center'>
                <Link href={`/customers/[cpfcnpj]`} as={`/customers/${row.cpfcnpj}`}>
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
    </TableContainer>
  );
}
