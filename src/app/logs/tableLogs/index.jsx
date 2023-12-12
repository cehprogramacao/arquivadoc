"use client"
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
import { useTheme, useMediaQuery, Typography } from '@mui/material'

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

export const LogsTable = ({ data }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))




  return (
    <TableContainer component={Paper} sx={{ maxWidth: '1200px', margin: '0 auto', marginTop: '30px' }}>
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
                
              </React.Fragment>
            ))}
          </TableBody>
        </Table> 
        : 
        <Table sx={{ maxWidth: '100%' }} >
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align='center'>USUÁRIO</StyledTableCell>
              <StyledTableCell align='center'>CATEGORIA</StyledTableCell>
              <StyledTableCell align='center'>REGISTRO</StyledTableCell>
              <StyledTableCell align='center'>AÇÃO</StyledTableCell>
              <StyledTableCell align='center'>DATA / HORA</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: '400px', overflowY: 'auto', }}>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align='left'>{row.id}</StyledTableCell>
                <StyledTableCell align='center'>{row.usuario}</StyledTableCell>
                <StyledTableCell align='center' >{row.categoria}</StyledTableCell>
                <StyledTableCell align='center'>{row.registro}</StyledTableCell>
                <StyledTableCell align='center'>{row.acao}</StyledTableCell>
                <StyledTableCell align='center'>{row.dataEhora}</StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>}
    </TableContainer>
  );
}
