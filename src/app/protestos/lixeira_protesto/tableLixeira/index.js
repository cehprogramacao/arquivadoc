

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
import ProtestService from '@/services/protest.service';

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

  const handlePrintFile = (file) => {
    const base64Data = file;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }
  const handleOpenFile = async (notation) => {
    const { getProtestByNotation } = new ProtestService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await getProtestByNotation(notation, accessToken)
      handlePrintFile(data.file)
    } catch (error) {
      console.error("Erro ao buscar arquivo", error)
      throw error;
    }
  }



  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table sx={{ maxWidth: '100%' }} >
        <TableHead>
          <TableRow>
            <StyledTableCell>Número</StyledTableCell>
            <StyledTableCell align='center'>Caixa</StyledTableCell>
            <StyledTableCell align='center'>Status</StyledTableCell>
            <StyledTableCell align='center'>Apresentante</StyledTableCell>
            <StyledTableCell align='center'>Sacado</StyledTableCell>
            <StyledTableCell align='center'>Devedor</StyledTableCell>
            <StyledTableCell align='center'>Arquivo</StyledTableCell>
            {/* <StyledTableCell align='right'>Excluir</StyledTableCell> */}
            <StyledTableCell align='right'>Restaurar</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align='left'>{row.notation}</StyledTableCell>
              <StyledTableCell align='center'>{row.box}</StyledTableCell>
              <StyledTableCell align='center' >{row.situation}</StyledTableCell>
              <StyledTableCell align='center'>({`${row.presenterDocument}`})</StyledTableCell>
              <StyledTableCell align='center'>{row.draweeName}</StyledTableCell>
              <StyledTableCell align='center'>{row.debtorName}</StyledTableCell>
              <StyledTableCell align='center'>
                <Button sx={{
                  fontSize: '12px',
                  textTransform: 'none',
                  left: 1,
                  color: 'black',
                  background: '#237117',
                  padding: '10px 9px ',
                  border: '1px solid #237117',
                  color: '#fff',
                  ":hover": {
                    background: 'transparent',
                    color: '#237117'
                  }
                }} onClick={() => handleOpenFile(row.notation)}>
                  Ver Arquivo
                </Button>
              </StyledTableCell>
              {/* <StyledTableCell align='right'>
                <Button sx={{
                  fontSize: '15px',
                  textTransform: 'none',
                  left: '12px',
                  color: 'black',
                  background: 'transparent',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  ":hover": {
                    background: '#dc3545',
                    color: '#fff'
                  }
                }} onClick={() => onClick(row.id)}>
                  Excluir
                </Button>
              </StyledTableCell> */}
              <StyledTableCell align='right'>
                <Button sx={{
                  fontSize: '15px',
                  textTransform: 'none',
                  left: '14px',
                  color: 'black',
                  background: 'transparent',
                  border: '1px solid #0dcaf0',
                  color: '#0dcaf0',
                  ":hover": {
                    background: '#0dcaf0',
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
