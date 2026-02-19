"use client"

import {
    Box,
    Typography,
    Button,
    Tooltip,
    Divider,
    alpha
} from '@mui/material';
import {
    AccessTime,
    Description,
    Home,
    Gavel,
    Email,
    Assignment,
    Business,
    CreditCard,
    Article,
    People,
    PersonAdd,
    Person,
    Inventory2
} from '@mui/icons-material';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { ModalOptions } from '../Modals/modalOptions/modalOptions';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { SET_LOGOUT, SET_QUEUESIZE } from '@/store/actions';
import { useAuth } from '@/context';
import Image from 'next/image';

// ============================================================================
// CONFIGURAÇÃO DOS ITENS DO MENU COM ÍCONES APROPRIADOS
// ============================================================================
const MENU_ITEMS = [
    {
        href: '/recentes',
        icon: AccessTime,
        label: 'Recentes',
        color: '#4CAF50',
        alwaysShow: true,
    },
    {
        href: '/notes',
        icon: Description,
        label: 'Notas',
        color: '#FF9800',
        permissionIndex: 6,
    },
    {
        href: '/rgi',
        icon: Home,
        label: 'RGI',
        color: '#2196F3',
        permissionIndex: 1,
    },
    {
        href: '/protest',
        icon: Gavel,
        label: 'Protestos',
        color: '#F44336',
        permissionIndex: 0,
    },
    {
        href: '/calling',
        icon: Email,
        label: 'Ofícios',
        color: '#9C27B0',
        permissionIndex: 4,
    },
    {
        href: '/rtd',
        icon: Assignment,
        label: 'RTD',
        color: '#00BCD4',
        permissionIndex: 2,
    },
    {
        href: '/rpj',
        icon: Business,
        label: 'RPJ',
        color: '#3F51B5',
        permissionIndex: 3,
    },
    {
        href: '/autograph-card',
        icon: CreditCard,
        label: 'Cartões',
        color: '#E91E63',
        permissionIndex: 5,
    },
    {
        href: '/termos',
        icon: Article,
        label: 'Termos',
        color: '#795548',
        permissionIndex: 5,
    },
    {
        href: '/solicitantes',
        icon: PersonAdd,
        label: 'Solicitantes',
        color: '#607D8B',
        permissionIndex: 6,
    },
    {
        href: '/inventario',
        icon: Inventory2,
        label: 'Inventario',
        color: '#247117',
        permissionKey: 'Inventario',
    },
    {
        href: '/customers',
        icon: People,
        label: 'Cadastros',
        color: '#009688',
        alwaysShow: true,
    }
];

// ============================================================================
// COMPONENTE: MENU ITEM
// ============================================================================
const MenuItem = ({ item, isActive, permissions, isAdmin }) => {
    const { href, icon: IconComponent, label, color, permissionIndex, permissionKey, alwaysShow } = item;

    const shouldShow = useMemo(() => {
        if (alwaysShow) return true;
        if (permissionKey) return permissions?.some(p => p?.public_name === permissionKey && p?.view === 1);
        if (permissionIndex !== undefined) return permissions[permissionIndex]?.view === 1;
        return isAdmin;
    }, [alwaysShow, permissionIndex, permissionKey, permissions, isAdmin]);

    if (!shouldShow) return null;

    return (
        <Tooltip title={label} placement="right" arrow>
            <Link href={href} style={{ textDecoration: 'none', width: '100%' }}>
                <Button
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'column', md: 'row', lg: 'row'},
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 12px',
                        borderRadius: '12px',
                        justifyContent: "flex-start",
                        color: isActive ? color : 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: isActive 
                            ? alpha(color, 0.15)
                            : 'transparent',
                        border: isActive 
                            ? `2px solid ${alpha(color, 0.5)}`
                            : '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, transparent 100%)`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                            backgroundColor: alpha(color, 0.12),
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 16px ${alpha(color, 0.3)}`,
                            '&::before': {
                                opacity: 1,
                            }
                        },
                        '&:active': {
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    <IconComponent 
                        sx={{ 
                            fontSize: '30px',
                            filter: isActive ? `drop-shadow(0 0 8px ${alpha(color, 0.6)})` : 'none',
                            transition: 'all 0.3s ease',
                        }} 
                    />
                    <Typography 
                        sx={{ 
                            fontSize: '15px',
                            fontWeight: isActive ? 700 : 600,
                            letterSpacing: '0.3px',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            color: 'text.white'
                        }}
                    >
                        {label}
                    </Typography>
                    {isActive && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '4px',
                                height: '60%',
                                backgroundColor: color,
                                borderRadius: '0 4px 4px 0',
                                boxShadow: `0 0 12px ${alpha(color, 0.6)}`,
                            }}
                        />
                    )}
                </Button>
            </Link>
        </Tooltip>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL: SIDEBAR
// ============================================================================
export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { permissions } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const open = Boolean(anchorEl);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        dispatch({ type: SET_LOGOUT });
        router.push("/");
    }, [dispatch, router]);

    useEffect(() => {
        const adminStatus = localStorage.getItem("isAdmin");
        setIsAdmin(adminStatus === "1" || adminStatus === 1);
    }, []);

    useEffect(() => {
        dispatch({ type: SET_QUEUESIZE });
    }, [dispatch]);

    return (
        <Box
            sx={{
                width: '310px',
                height: '100vh',
                background: 'linear-gradient(180deg, #1a5c0f 0%, #237117 50%, #2d8a1f 100%)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }
            }}
        >
            {/* Logo/Header */}
            <Box
                sx={{
                    padding: '24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box sx={{ width: "100%", height: "50px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Link href={"/bem-vindo"} passHref>
                            <Image src="/image/logo.png" alt="logo" width={150} height={65} style={{ objectFit: "cover", cursor: 'pointer' }} />
                        </Link>
                    </Box>
            </Box>

            {/* Menu Items */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    '::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                        }
                    },
                    '::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                }}
            >
                {MENU_ITEMS.map((item) => (
                    <MenuItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        permissions={permissions}
                        isAdmin={isAdmin}
                    />
                ))}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* User Section */}
            <Box
                sx={{
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <Tooltip title="Configurações" placement="right" arrow>
                    <Button
                        onClick={handleClick}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: {xs: 'column', sm: 'column', md: 'row', lg: 'row'},
                            alignItems: 'center',
                            justifyContent: {xs: 'center', sm: 'center', md: 'flex-start', lg: 'flex-start'},
                            gap: '8px',
                            padding: '12px',
                            borderRadius: '12px',
                            color: '#fff',
                            backgroundColor: alpha('#fff', 0.08),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.15),
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        <Person sx={{ fontSize: '30px' }} />
                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.white' }}>
                            Perfil
                        </Typography>
                    </Button>
                </Tooltip>

                {/* <Typography
                    sx={{
                        fontSize: '9px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        letterSpacing: '0.5px',
                        lineHeight: 1.4,
                    }}
                >
                    Desenvolvido por<br />BrTech
                </Typography> */}
            </Box>

            <ModalOptions
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                logout={handleLogout}
            />
        </Box>
    );
};