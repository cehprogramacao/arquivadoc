import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    Typography,
    Box,
    alpha,
    Skeleton
} from '@mui/material';
import {
    Logout,
    History as HistoryIcon,
    Group as GroupIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { extractDataFromSession } from '@/utils/auth';

// ============================================================================
// ESTILOS DO MENU
// ============================================================================
const MENU_STYLES = {
    paper: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
        mt: 1.5,
        minWidth: 220,
        borderRadius: 2,
        '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
    },
    
    header: {
        px: 2,
        py: 1.5,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
    },

    userName: {
        fontWeight: 600,
        fontSize: '14px',
        color: 'text.primary',
    },

    userEmail: {
        fontSize: '12px',
        color: 'text.secondary',
        mt: 0.5,
    },

    menuItem: {
        py: 1,
        px: 2,
        borderRadius: 1,
        mx: 0.5,
        my: 0.5,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }
    },

    logoutItem: {
        py: 1,
        px: 2,
        borderRadius: 1,
        mx: 0.5,
        my: 0.5,
        color: 'error.main',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
        }
    },

    icon: {
        minWidth: 36,
        color: 'text.secondary',
    },

    adminBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        color: 'primary.main',
        mt: 0.5,
    }
};

// ============================================================================
// ITENS DO MENU
// ============================================================================
const MENU_ITEMS = [
    {
        href: '/updatePassword',
        icon: LockIcon,
        label: 'Alterar Senha',
        adminOnly: false,
    },
    {
        href: '/logs',
        icon: HistoryIcon,
        label: 'Logs do Sistema',
        adminOnly: true,
    },
    {
        href: '/usuarios',
        icon: GroupIcon,
        label: 'Gerenciar Usuários',
        adminOnly: true,
    },
];

// ============================================================================
// COMPONENTE: HEADER DO USUÁRIO
// ============================================================================
const UserHeader = ({ user, isAdmin, loading }) => {
    if (loading) {
        return (
            <Box sx={MENU_STYLES.header}>
                <Skeleton variant="text" width={150} height={20} />
                <Skeleton variant="text" width={180} height={16} sx={{ mt: 0.5 }} />
            </Box>
        );
    }

    return (
        <Box sx={MENU_STYLES.header}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                    sx={{ 
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={MENU_STYLES.userName}>
                        {user?.name || 'Usuário'}
                    </Typography>
                    {user?.email && (
                        <Typography sx={MENU_STYLES.userEmail}>
                            {user.email}
                        </Typography>
                    )}
                    {isAdmin && (
                        <Box sx={MENU_STYLES.adminBadge}>
                            <AdminIcon sx={{ fontSize: 14 }} />
                            Administrador
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL: MODAL OPTIONS
// ============================================================================
export const ModalOptions = ({ open, logout, onClose, anchorEl }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Verifica status de admin
    useEffect(() => {
        const adminStatus = localStorage.getItem("isAdmin");
        setIsAdmin(adminStatus === "1" || adminStatus === 1);
    }, []);

    // Busca dados do usuário
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const userData = await extractDataFromSession();
            setUser(userData);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchUser();
        }
    }, [open, fetchUser]);

    // Filtra itens do menu baseado nas permissões
    const visibleMenuItems = useMemo(() => 
        MENU_ITEMS.filter(item => !item.adminOnly || isAdmin),
        [isAdmin]
    );

    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={onClose}
            transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: MENU_STYLES.paper,
                }
            }}
        >
            {/* Header com informações do usuário */}
            <UserHeader user={user} isAdmin={isAdmin} loading={loading} />

            <Divider sx={{ my: 1 }} />

            {/* Itens do menu */}
            {visibleMenuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <MenuItem sx={MENU_STYLES.menuItem}>
                        <ListItemIcon sx={MENU_STYLES.icon}>
                            <item.icon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body2">{item.label}</Typography>
                    </MenuItem>
                </Link>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Botão de logout */}
            <MenuItem onClick={logout} sx={MENU_STYLES.logoutItem}>
                <ListItemIcon sx={{ ...MENU_STYLES.icon, color: 'error.main' }}>
                    <Logout fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Sair
                </Typography>
            </MenuItem>
        </Menu>
    );
};