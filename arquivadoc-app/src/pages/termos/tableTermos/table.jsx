

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    
      backgroundColor: "#E9E9E9",
      color: theme.palette.common.black,
      fontWeight: 'bold'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
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
  
export const TermosTable = ({data}) => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: '1200px', margin: '0 auto'}}> 
      <Table sx={{ maxWidth: '100%'}} >
        <TableHead>
          <TableRow>
            <StyledTableCell>Número</StyledTableCell>
            <StyledTableCell align='right' >Caixa</StyledTableCell>
            <StyledTableCell align='right' >Porte</StyledTableCell>
            <StyledTableCell align='right' >Cartão</StyledTableCell>
            <StyledTableCell align='right' >Excluir</StyledTableCell>
            <StyledTableCell align='right' >Editar</StyledTableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody> */}
      </Table>
    </TableContainer>
  );
}
