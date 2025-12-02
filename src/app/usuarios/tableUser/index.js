import { useAuth } from '@/context';
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
    Button,
    Chip,
    Tooltip,
    IconButton,
    Box
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#E9E9E9',
        color: theme.palette.common.black,
        fontWeight: 'bold',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    padding: '10px 16px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    }
}));

const ActionButton = styled(Button)(({ variant = 'default' }) => {
    const variants = {
        delete: {
            border: '1px solid #EA1010',
            color: '#EA1010',
            '&:hover': {
                background: '#EA1010',
                color: '#fff'
            }
        },
        edit: {
            border: '1px solid #FFD500',
            color: '#FFD500',
            '&:hover': {
                background: '#FFD500',
                color: '#fff'
            }
        },
        info: {
            border: '1px solid #0dcaf0',
            color: '#0dcaf0',
            '&:hover': {
                background: '#0dcaf0',
                color: '#fff'
            }
        }
    };

    return {
        fontSize: '13px',
        textTransform: 'none',
        background: 'transparent',
        minWidth: '100px',
        padding: '4px 12px',
        ...(variants[variant] || variants.info)
    };
});

const TableComponente = ({
    data,
    handleDeleteByID,
    handleSetAdmin,
    handleUnsetAdmin,
    handleEnable,
    handleDisabled
}) => {
    const { permissions } = useAuth();

    // Memoiza a conversão do array para evitar recalcular em cada render
    const dataArray = useMemo(() =>
        Array.isArray(data) ? data : Object.values(data),
        [data]
    );



    const [admin, setAdmin] = useState()


    useEffect(() => {
        const isAdminUser = sessionStorage.getItem('isAdmin')
        setAdmin(isAdminUser)
    }, [])

    const hasDeletePermission = admin === 1 || admin === '1';
    const hasEditPermission = admin === 1 || admin === '1';

    return (
        <TableContainer
            component={Paper}
            sx={{
                height: 400,
                width: '100%',
                overflowY: 'auto',
                boxShadow: 2
            }}
        >
            <Table sx={{ width: '100%' }} aria-label="tabela de usuários">
                <TableHead >
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align='center'>Nome</StyledTableCell>
                        <StyledTableCell align='center'>E-mail</StyledTableCell>
                        <StyledTableCell align='center'>Perfil</StyledTableCell>
                        <StyledTableCell align='center'>Status</StyledTableCell>
                        <StyledTableCell align='center'>Ações</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataArray.length > 0 ? (
                        dataArray.map((row) => (
                            <StyledTableRow
                                key={row?.id}
                                sx={{
                                    opacity: row?.active === 0 ? 0.6 : 1,
                                }}
                            >
                                <StyledTableCell align='left'>
                                    {row?.id}
                                </StyledTableCell>

                                <StyledTableCell align='center'>
                                    {row?.name}
                                </StyledTableCell>

                                <StyledTableCell align='center'>
                                    {row?.email}
                                </StyledTableCell>

                                <StyledTableCell align='center'>
                                    <Chip
                                        label={row?.is_admin === 1 ? 'Admin' : 'Usuário'}
                                        color={row?.is_admin === 1 ? 'primary' : 'default'}
                                        size="small"
                                        icon={row?.is_admin === 1 ? <AdminIcon /> : <PersonIcon />}
                                    />
                                </StyledTableCell>

                                <StyledTableCell align='center'>
                                    <Chip
                                        label={row?.active === 1 ? 'Ativo' : 'Inativo'}
                                        color={row?.active === 1 ? 'success' : 'error'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </StyledTableCell>

                                <StyledTableCell align='center'>
                                    <Box style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        {/* Editar */}
                                        {hasEditPermission && (
                                            <Tooltip title="Editar usuário">
                                                <Link
                                                    href={`/usuarios/[id]`}
                                                    as={`/usuarios/${row.id}`}
                                                    passHref
                                                    legacyBehavior
                                                >
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: '#FFD500',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 213, 0, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                        )}

                                        {/* Excluir */}
                                        {hasDeletePermission && (
                                            <Tooltip title="Excluir usuário">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteByID(row?.id)}
                                                    sx={{
                                                        color: '#EA1010',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(234, 16, 16, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {/* Toggle Admin */}
                                        <Tooltip title={row?.is_admin === 1 ? 'Remover privilégios de admin' : 'Tornar admin'}>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    row?.is_admin === 1
                                                        ? handleUnsetAdmin(row?.id)
                                                        : handleSetAdmin(row?.id)
                                                }
                                                sx={{
                                                    color: '#0dcaf0',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(13, 202, 240, 0.1)'
                                                    }
                                                }}
                                            >
                                                {row?.is_admin === 1 ? (
                                                    <PersonIcon fontSize="small" />
                                                ) : (
                                                    <AdminIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </Tooltip>

                                        {/* Toggle Ativo */}
                                        <Tooltip title={row?.active === 1 ? 'Desabilitar usuário' : 'Habilitar usuário'}>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    row?.active === 1
                                                        ? handleDisabled(row?.id)
                                                        : handleEnable(row?.id)
                                                }
                                                sx={{
                                                    color: row?.active === 1 ? '#EA1010' : '#198754',
                                                    '&:hover': {
                                                        backgroundColor: row?.active === 1
                                                            ? 'rgba(234, 16, 16, 0.1)'
                                                            : 'rgba(25, 135, 84, 0.1)'
                                                    }
                                                }}
                                            >
                                                {row?.active === 1 ? (
                                                    <LockIcon fontSize="small" />
                                                ) : (
                                                    <LockOpenIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))
                    ) : (
                        <TableRow>
                            <StyledTableCell colSpan={6} align='center'>
                                Nenhum usuário encontrado
                            </StyledTableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponente;