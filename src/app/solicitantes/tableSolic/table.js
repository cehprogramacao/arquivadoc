import React, { useMemo } from 'react';
import {
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    alpha,
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import {
    Delete as DeleteIcon,
    PersonOff as PersonOffIcon,
    Tag as TagIcon
} from '@mui/icons-material';
import { useAuth } from '@/context';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#237117',
        color: '#fff',
        fontWeight: 700,
        fontSize: 15,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '16px 20px',
        borderBottom: `3px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '14px 20px',
        color: theme.palette.text.primary,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.action.hover, 0.3),
    },
    '&:hover': {
        backgroundColor: alpha('#237117', 0.08),
        transform: 'scale(1.001)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
    color: '#EA1010',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha('#EA1010', 0.1),
        transform: 'scale(1.1)',
    },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8, 2),
    textAlign: 'center',
    backgroundColor: alpha(theme.palette.action.hover, 0.2),
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2),
}));

// ============================================================================
// COMPONENTE: EMPTY STATE
// ============================================================================
const EmptyState = ({ message }) => (
    <EmptyStateBox>
        <PersonOffIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#666', fontWeight: 600, mb: 1 }}>
            Nenhum solicitante encontrado
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', maxWidth: 400 }}>
            {message || "Não há solicitantes cadastrados no momento. Adicione um novo solicitante para começar."}
        </Typography>
    </EmptyStateBox>
);

// ============================================================================
// COMPONENTE: MOBILE ROW
// ============================================================================
const MobileRow = ({ row, hasDeletePermission, onClick }) => (
    <Paper
        elevation={2}
        sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
            }
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip
                icon={<TagIcon />}
                label={`ID: ${row.id}`}
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
            />
            {hasDeletePermission && (
                <Tooltip title="Excluir solicitante">
                    <DeleteButton size="small" onClick={() => onClick(row.id)}>
                        <DeleteIcon />
                    </DeleteButton>
                </Tooltip>
            )}
        </Box>

        <Box>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                Nome
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#237117', mb: 2 }}>
                {row.name}
            </Typography>
        </Box>

        {Object.entries(row)
            .filter(([key]) => key !== 'id' && key !== 'name')
            .map(([key, value]) => (
                <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                        {key}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {value || '-'}
                    </Typography>
                </Box>
            ))}
    </Paper>
);

// ============================================================================
// COMPONENTE PRINCIPAL: USER TABLE
// ============================================================================
export const UserTable = ({ data = [], onClick, emptyMessage }) => {
    const { permissions } = useAuth();

    const hasDeletePermission = useMemo(() => 
        permissions[5]?.delete_permission === 1,
        [permissions]
    );

    const isMobileView = useMemo(() => 
        typeof window !== 'undefined' && window.innerWidth < 900,
        []
    );

    // Renderiza estado vazio
    if (!data || data.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    // Renderiza versão mobile
    if (isMobileView) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#237117', fontWeight: 600 }}>
                    Lista de Solicitantes ({data.length})
                </Typography>
                {data.map((row, index) => (
                    <MobileRow
                        key={row.id || index}
                        row={row}
                        hasDeletePermission={hasDeletePermission}
                        onClick={onClick}
                    />
                ))}
            </Box>
        );
    }

    // Renderiza versão desktop
    return (
        <TableContainer
            component={Paper}
            sx={{
                mt: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                maxHeight: 600,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: alpha('#237117', 0.3),
                    borderRadius: '10px',
                    '&:hover': {
                        background: alpha('#237117', 0.5),
                    }
                },
                '&::-webkit-scrollbar-track': {
                    borderRadius: '10px',
                },
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <StyledTableCell sx={{ width: 100 }}>ID</StyledTableCell>
                        <StyledTableCell>Nome do Solicitante</StyledTableCell>
                        {hasDeletePermission && (
                            <StyledTableCell align="center" sx={{ width: 150 }}>
                                Ações
                            </StyledTableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.id || index}>
                            <StyledTableCell>
                                <Chip
                                    label={row.id}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600 }}
                                />
                            </StyledTableCell>

                            <StyledTableCell>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#237117' }}>
                                    {row.name}
                                </Typography>
                            </StyledTableCell>

                            {hasDeletePermission && (
                                <StyledTableCell align="center">
                                    <Tooltip title="Excluir solicitante" arrow>
                                        <DeleteButton onClick={() => onClick(row.id)}>
                                            <DeleteIcon />
                                        </DeleteButton>
                                    </Tooltip>
                                </StyledTableCell>
                            )}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Footer com contador */}
            <Box
                sx={{
                    p: 2,
                    backgroundColor: alpha('#237117', 0.05),
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="body2" sx={{ color: '#237117', fontWeight: 600 }}>
                    Total de {data.length} solicitante{data.length !== 1 ? 's' : ''}
                </Typography>
            </Box>
        </TableContainer>
    );
};