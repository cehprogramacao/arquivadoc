"use client"

import { Box, ListItemIcon, Typography, List, ListItem, useTheme, useMediaQuery, useRadioGroup, IconButton } from '@mui/material';
import PendingActionsSharpIcon from '@mui/icons-material/PendingActionsSharp';
import QueryBuilderSharpIcon from '@mui/icons-material/QueryBuilderSharp';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useEffect, useState } from 'react';
import { ModalOptions } from '../Modals/modalOptions/modalOptions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { SET_LOGOUT, SET_QUEUESIZE } from '@/store/actions';
import { useAuth } from '@/context';
import User from '@/services/user.service';

export const Sidebar = () => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter()
    const dispatch = useDispatch()
    const { permissions, updatePermissions} = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const isAdmin = sessionStorage.getItem("isAdmin")
    const handleLogout = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("isAdmin")
        dispatch({ type: SET_LOGOUT })
        router.push("/login")
    };
    const handleClose = () => {
        setAnchorEl(null);
    }
    // const getDataUserByAdmin = async (userId) => {
    //     try {
    //         const accessToken = sessionStorage.getItem("accessToken");
    //         const { getUserById } = new User();
    //         const { data } = await getUserById(userId, accessToken);
    //         await updatePermissions(data.permissions);
    //     } catch (error) {
    //         console.error("Erro ao buscar dados do usuário!", error);
    //         throw error;
    //     }
    // };

    // useEffect(() => {
    //     const getDataUser = async () => {
    //         try {
    //             const accessToken = sessionStorage.getItem("accessToken");
    //             const { getUser } = new User();
    //             const { data } = await getUser(accessToken);
    //             await getDataUserByAdmin(data.id);
    //         } catch (error) {
    //             console.error("Erro ao buscar dados do usuário!", error);
    //             throw error;
    //         }
    //     };

    //     getDataUser();
    // }, [updatePermissions]);


    useEffect(() => {
        dispatch({ type: SET_QUEUESIZE })
        console.log(permissions)
    }, [])


    
    return (

        <Box sx={{
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
        }}>
            <List sx={{
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
            }}>
                <ListItem >
                    <ListItemIcon sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        gap: '30px',

                        position: 'relative',
                        left: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} >
                        <Link href={"/"}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }} >
                                <QueryBuilderSharpIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer',

                                }} alt="" />
                                Recentes
                            </IconButton>
                        </Link>
                        <Link href={"/notes"} style={{
                            display: permissions[6]?.view === 1 ? "flex" : "none"
                        }} >
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }} >
                                <DescriptionOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'
                                }} alt="" />
                                Notas
                            </IconButton>
                        </Link>

                        <Link href={"/rgi"} style={{
                            display: permissions[1]?.view === 1 ? "flex" : "none"
                        }} >
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <HomeOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                RGI
                            </IconButton>
                        </Link>
                        <Link href={"/protest"} style={{
                            display: permissions[0]?.view === 1 ? "flex" : "none"
                        }} >
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <PendingActionsSharpIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Protestos
                            </IconButton>
                        </Link>
                        <Link href={"/calling"} style={{
                            display: permissions[4]?.view === 1 ? "flex" : "none"
                        }}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Ofícios
                            </IconButton>
                        </Link>
                        <Link href="/rtd" style={{
                            display: permissions[2]?.view === 1 ? "flex" : "none"
                        }}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                RTD
                            </IconButton>
                        </Link>
                        <Link href={"/rpj"} style={{
                            display: permissions[3]?.view === 1 ? "flex" : "none"
                        }}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                RPJ
                            </IconButton>
                        </Link>
                        <Link href={"/autograph-card"} style={{
                            display: permissions[5]?.view === 1 ? "flex" : "none"
                        }}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Cartões de Autógrafo
                            </IconButton>
                        </Link>
                        <Link href={"/termos"} style={{
                            display: permissions[5]?.view === 1 ? "flex" : "none"
                        }}>
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }} >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Termos
                            </IconButton>
                        </Link>
                        <Link href={"/solicitantes"} style={{
                            display:permissions[6]?.view === 1 ? "flex" : "none"
                        }} >
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Solicitantes
                            </IconButton>
                        </Link>
                        <Link href={"/customers"} style={{
                            display: isAdmin === "1" || permissions[5]?.view === 1 ? "flex" : "none"
                        }} >
                            <IconButton sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: "#fff",
                                gap: '2px',
                            }}  >
                                <NoteAltOutlinedIcon sx={{
                                    width: '40px',
                                    height: '40px',
                                    flexShrink: 0,
                                    cursor: 'pointer'

                                }} alt="" />
                                Pessoas
                            </IconButton>
                        </Link>
                    </ListItemIcon>
                </ListItem>

            </List>

            <List sx={{
                display: 'flex',
                padding: '17px 21px',
                backgroundColor: '#237117',
                flexDirection: 'column',
                gap: '0px',
            }}>
                <ListItem>
                    <ListItemIcon sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        gap: '20px',
                        padding: '10px 0',
                        margin: '0 auto'
                    }}>
                        <IconButton sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '12px',
                            border: 'none',
                            background: 'transparent',
                            color: "#fff",
                            gap: '2px',
                        }} onClick={handleClick}>
                            <PersonOutlineOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </IconButton>



                    </ListItemIcon>

                </ListItem>
                <Typography component={'span'} sx={{
                    fontSize: '.7rem',
                    color: '#fff',
                    letterSpacing: '.8px'
                }}>
                    Desenvolvido por BrTech
                </Typography>
            </List>

            <ModalOptions anchorEl={anchorEl} open={open} onClose={handleClose} logout={handleLogout} />
        </Box>

    );
};
