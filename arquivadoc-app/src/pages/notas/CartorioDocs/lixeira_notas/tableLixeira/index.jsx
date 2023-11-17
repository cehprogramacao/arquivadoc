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

export const LixeiraTable = ({ data, onClick }) => {
 
  
  

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '1200px',marginTop: '30px' }}>
      <Table sx={{ maxWidth: '100%' }} >
        <TableHead>
          <TableRow>
            <StyledTableCell>Ordem</StyledTableCell>
            <StyledTableCell align='center'>Solicitação</StyledTableCell>
            <StyledTableCell align='center'>Tipo de Serviço</StyledTableCell>
            <StyledTableCell align='center'>Livro</StyledTableCell>
            <StyledTableCell align='center'>Folhas</StyledTableCell>
            <StyledTableCell align='center'>Orturgantes</StyledTableCell>
            <StyledTableCell align='center'>Orturgados</StyledTableCell>
            <StyledTableCell align='center'>Arquivo</StyledTableCell>
            <StyledTableCell align='right'>Excluir</StyledTableCell>
            <StyledTableCell align='right'>Restaurar</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align='left'>{row.ordem}</StyledTableCell>
              <StyledTableCell align='center'>{row.solicitacao}</StyledTableCell>
              <StyledTableCell align='center' >{row.tipoDeServico}</StyledTableCell>
              <StyledTableCell align='center'>{row.livro}</StyledTableCell>
              <StyledTableCell align='center'>{row.folhas}</StyledTableCell>
              <StyledTableCell align='center' >{row.outorgantes}</StyledTableCell>
              <StyledTableCell align='center' >{row.outorgados}</StyledTableCell>
              <StyledTableCell align='center'>
                <Button sx={{
                  fontSize: '12px',
                  textTransform: 'none',
                  left: 1,
                  color: 'black',
                  background: '#237117',
                  padding:'10px 9px ',
                  border: '1px solid #237117',
                  color: '#fff',
                  ":hover": {
                    background: 'transparent',
                    color: '#237117'
                  }
                }} onClick={() => onClick(row.id)}>
                  Ver Arquivo
                </Button>
              </StyledTableCell>
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
