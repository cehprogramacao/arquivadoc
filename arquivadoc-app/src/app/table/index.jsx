import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Paper,
    Typography,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ResponsiveTable = () => {
    const theme = useTheme();
    const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [rows, setRows] = React.useState([
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        
    ]);

    const handleEdit = (row) => {
        // Lógica para editar
        console.log('Editar:', row);
    };

    const handleDelete = (row) => {
        // Lógica para excluir
        console.log('Excluir:', row);
    };

    return (
        <TableContainer component={Paper} sx={{
            maxWidth: "1200px",
            padding: '10px 0px',
            overflowY: "auto",
            maxHeight: '400px',
            position: 'relative',
        }}>
            {isSmScreen ? (
                <Table>
                    <TableBody>
                        {rows.map((row, index) => (
                            <React.Fragment key={index}>
                                {Object.entries(row).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            <Typography variant="body1">{key}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{value}</Typography>
                                        </TableCell>
                                    </TableRow>
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
                                        }} onClick={() => handleDelete(row)}>
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
                                        }} onClick={() => handleEdit(row)}>
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(rows[0]).map((key) => (
                                <TableCell key={key}>
                                    <Typography variant="h5">{key}</Typography>
                                </TableCell>
                            ))}
                            <TableCell>
                                <Typography variant="h5">Excluir</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h5">Editar</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, index) => (
                                    <TableCell key={index}>
                                        <Typography variant="body1">{value}</Typography>
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton color="secondary" onClick={() => handleDelete(row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

export default ResponsiveTable;
