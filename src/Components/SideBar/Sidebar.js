"use client"

import {
    Box,
    ListItemIcon,
    Typography,
    List,
    ListItem,
    useTheme,
    useMediaQuery,
    Button
} from '@mui/material';
import PendingActionsSharpIcon from '@mui/icons-material/PendingActionsSharp';
import QueryBuilderSharpIcon from '@mui/icons-material/QueryBuilderSharp';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useEffect, useState } from 'react';
import { ModalOptions } from '../Modals/modalOptions/modalOptions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { SET_LOGOUT, SET_QUEUESIZE } from '@/store/actions';
import { useAuth } from '@/context';
import { People } from '@mui/icons-material';

// Configurações de estilo reutilizáveis
const SIDEBAR_STYLES = {
    container: (theme) => ({
        overflowY: 'auto',
        flex: 1,
        bgcolor: theme.palette.background.header,
        '::-webkit-scrollbar': {
            width: '15px',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#fff',
            borderRadius: '18px'
        },
        '::-webkit-scrollbar-track': {
            background: '#237117',
        },
    }),

    mainList: {
        width: '100%',
        display: 'flex',
        alignItems: 'start',
        borderBottom: '1px solid #FFFFFF',
        backgroundColor: '#237117',
        overflowY: 'auto',
        flex: 1,
        '::-webkit-scrollbar': {
            width: '15px',
        },
        '::-webkit-scrollbar-thumb': {
            background: '#fff',
            borderRadius: '18px'
        },
        '::-webkit-scrollbar-track': {
            background: '#237117',
        },
    },

    listItemIcon: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        gap: '30px',
        position: 'relative',
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '12px',
        color: '#fff',
        gap: '2px',
        textTransform: 'none',
        minWidth: 'auto',
        padding: '8px',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    },

    icon: {
        width: '40px',
        height: '40px',
        flexShrink: 0,
        cursor: 'pointer',
    },

    bottomList: {
        display: 'flex',
        padding: '17px 21px',
        backgroundColor: '#237117',
        flexDirection: 'column',
        gap: '0px',
    },

    bottomListIcon: {
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        gap: '20px',
        padding: '10px 0',
        margin: '0 auto'
    },

    footer: {
        fontSize: '.7rem',
        color: '#fff',
        letterSpacing: '.8px'
    }
};

// Configuração dos itens do menu
const MENU_ITEMS = [
    {
        href: '/recentes',
        icon: QueryBuilderSharpIcon,
        label: 'Recentes',
        showCondition: () => true,
    },
    {
        href: '/notes',
        icon: DescriptionOutlinedIcon,
        label: 'Notas',
        permissionIndex: 6,
    },
    {
        href: '/rgi',
        icon: HomeOutlinedIcon,
        label: 'RGI',
        permissionIndex: 1,
    },
    {
        href: '/protest',
        icon: PendingActionsSharpIcon,
        label: 'Protestos',
        permissionIndex: 0,
    },
    {
        href: '/calling',
        icon: NoteAltOutlinedIcon,
        label: 'Ofícios',
        permissionIndex: 4,
    },
    {
        href: '/rtd',
        icon: NoteAltOutlinedIcon,
        label: 'RTD',
        permissionIndex: 2,
    },
    {
        href: '/rpj',
        icon: NoteAltOutlinedIcon,
        label: 'RPJ',
        permissionIndex: 3,
    },
    {
        href: '/autograph-card',
        icon: NoteAltOutlinedIcon,
        label: 'Cartões de Autógrafo',
        permissionIndex: 5,
    },
    {
        href: '/termos',
        icon: NoteAltOutlinedIcon,
        label: 'Termos',
        permissionIndex: 5,
    },
    {
        href: '/solicitantes',
        icon: NoteAltOutlinedIcon,
        label: 'Solicitantes',
        permissionIndex: 6,
    },
    {
        href: '/customers',
        icon: People,
        label: 'Cadastros',
        // permissionIndex: null,
    }
];

const MenuItem = ({ item, permissions, isAdmin }) => {
    const { href, icon: IconComponent, label, permissionIndex, showCondition } = item;

    const shouldShow = () => {
        if (showCondition) return showCondition();
        if (permissionIndex !== undefined) return permissions[permissionIndex]?.view === 1;
        if (label === 'Pessoas') return isAdmin === "1";
        return true;
    };

    if (!shouldShow()) return null;

    return (
        <Link href={href} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Button sx={SIDEBAR_STYLES.iconButton}>
                <IconComponent sx={SIDEBAR_STYLES.icon} />
                {label}
            </Button>
        </Link>
    );
};

export const Sidebar = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const dispatch = useDispatch();
    const { permissions, updatePermissions } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const isAdmin = localStorage.getItem("isAdmin");

    // Handlers
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isAdmin");
        dispatch({ type: SET_LOGOUT });
        router.push("/");
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        dispatch({ type: SET_QUEUESIZE });
        console.log(permissions);
    }, [dispatch, permissions]);

    const menuItems = [...MENU_ITEMS];
    // if (isAdmin === "1" || isAdmin === 1) {
    //     menuItems.push({
    //         href: '/customers',
    //         icon: NoteAltOutlinedIcon,
    //         label: 'customers',
    //         showCondition: () => isAdmin === "1",
    //     });
    // }

    return (
        <Box sx={SIDEBAR_STYLES.container(theme)}>
            <List sx={SIDEBAR_STYLES.mainList}>
                <ListItem>
                    <ListItemIcon sx={SIDEBAR_STYLES.listItemIcon}>
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={`${item.href}-${index}`}
                                item={item}
                                permissions={permissions}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </ListItemIcon>
                </ListItem>
            </List>

            <List sx={SIDEBAR_STYLES.bottomList}>
                <ListItem>
                    <ListItemIcon sx={SIDEBAR_STYLES.bottomListIcon}>
                        <Button
                            sx={SIDEBAR_STYLES.iconButton}
                            onClick={handleClick}
                        >
                            <PersonOutlineOutlinedIcon sx={SIDEBAR_STYLES.icon} />
                        </Button>
                    </ListItemIcon>
                </ListItem>

                <Typography component="span" sx={SIDEBAR_STYLES.footer}>
                    Desenvolvido por BrTech
                </Typography>
            </List>

            <ModalOptions
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                logout={handleLogout}
            />
        </Box>
    );
};