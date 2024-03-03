import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    styled,
    tableCellClasses,
    Box,
    Button
} from '@mui/material'
import Link from 'next/link'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#E9E9E9',
        color: theme.palette.common.black,
        fontWeight: "bold"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
        color: '#000',
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,

    },

    '&:last-child td, &:last-child th': {
        border: 0,

    },
    background: '#E9E9E9'
}));

const TableComponente = ({ data, onClick }) => {
    console.log(data, 'kkkkkkkkkk912912129');

    const dataArray = Array.isArray(data) ? data : Object.values(data);

    console.log("Transformado em array:", dataArray);
    dataArray.forEach(item => console.log(item, 'MMMMMMMMMMMMMMMMMMMMMMkkkk'));


    return (
        <TableContainer component={Paper} sx={{
            maxHeight: 520,
            width: "100%",
            overflowY: 'auto',
        }}>
            <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                }}>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align='center'>Nome</StyledTableCell>
                        <StyledTableCell align='center'>E-mail</StyledTableCell>
                        <StyledTableCell align='center'>Setor</StyledTableCell>
                        <StyledTableCell align='center'>Excluir</StyledTableCell>
                        <StyledTableCell align='center'>Editar</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataArray.length > 0 && dataArray.map((row, index) => (
                        <StyledTableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell align='left'>{row?.id}</StyledTableCell>
                            <StyledTableCell align='center'>{row?.name}</StyledTableCell>
                            <StyledTableCell align='center'>{row?.email}</StyledTableCell>
                            <StyledTableCell align='center'>{row?.is_admin === 1 ? "admin" : "user"}</StyledTableCell>
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
                                }} >
                                    Excluir
                                </Button>
                            </StyledTableCell>
                            <StyledTableCell align='center'>
                                <Link href={`/usuarios/[id]`} as={`/usuarios/${row.id}`}>
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
                                    }} >
                                        Editar
                                    </Button>
                                </Link>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

}
export default TableComponente