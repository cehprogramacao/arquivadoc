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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E9E9E9",
    color: theme.palette.common.black,
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  padding: '10px 30px' 
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

export const LixeiraTable = ({ data, onClick }) => {
 
  
  
  

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '1200px',marginTop: '30px' }}>
      <Table sx={{ maxWidth: '100%' }} >
        <TableHead>
          <TableRow>
            <StyledTableCell>Número</StyledTableCell>
            <StyledTableCell align='center'>Caixa</StyledTableCell>
            <StyledTableCell align='center'>Parte</StyledTableCell>
            <StyledTableCell align='right'>Documento</StyledTableCell>
            <StyledTableCell align='center'>CPF</StyledTableCell>
            <StyledTableCell align='center'>Comprovante</StyledTableCell>
            <StyledTableCell align='center'>Cartão</StyledTableCell>
            <StyledTableCell align='right'>Excluir</StyledTableCell>
            <StyledTableCell align='right'>Restaurar</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align='left'>{row.numero}</StyledTableCell>
              <StyledTableCell align='center'>{row.caixa}</StyledTableCell>
              <StyledTableCell align='center' >{row.parte}</StyledTableCell>
              <StyledTableCell align='center'>{row.documento}</StyledTableCell>
              <StyledTableCell align='center'>{row.cpf}</StyledTableCell>
              <StyledTableCell align='center' >{row.comprovante}</StyledTableCell>
              <StyledTableCell align='left'>{row.cartao}</StyledTableCell>
              <StyledTableCell align='right'>
                <Button sx={{
                  fontSize: '15px',
                  textTransform: 'none',
                  left: '12px',
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
              <StyledTableCell align='right'>
                <Button sx={{
                  fontSize: '15px',
                  textTransform: 'none',
                  left: '14px',
                  color: 'black',
                  background: 'transparent',
                  border: '1px solid #FFD500',
                  color: '#FFD500',
                  ":hover": {
                    background: '#FFD500',
                    color: '#fff'
                  }
                }}>
                  Restaurar
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
