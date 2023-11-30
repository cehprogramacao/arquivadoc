"use client"

import { Box, ListItemIcon, Typography, List, ListItem, useTheme, useMediaQuery } from '@mui/material';
import PendingActionsSharpIcon from '@mui/icons-material/PendingActionsSharp';
import QueryBuilderSharpIcon from '@mui/icons-material/QueryBuilderSharp';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useState } from 'react';
import { ModalOptions } from '../Modals/ModalOptions/modalOptions';
import Link from 'next/link';

export const Sidebar = () => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <Box sx={{
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
            <List sx={{
                width: '100%',
                display: 'flex',
                height: 'auto',
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
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>

                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                        <Link href="/rtd">
                            <button style={{
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
                            </button>
                        </Link>
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                        <button style={{
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
                        </button>
                    </ListItemIcon>
                </ListItem>

            </List>

            <List sx={{
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                padding: '0 21px',
                backgroundColor: '#237117',
                flexDirection: 'column',
                gap: '20px',
                height: isSmallScreen ? 'auto' : '219px',
                placeContent: 'center'
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
                        <button style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontSize: '12px',
                            border: 'none',
                            background: 'transparent',
                            color: "#fff",
                            gap: '2px',
                        }}>
                            <SettingsOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </button>
                        <button style={{
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
                        </button>



                    </ListItemIcon>

                </ListItem>
                <Typography component={'span'} sx={{
                    width: 'auto',
                    fontSize: '.7rem',
                    color: '#fff',
                    letterSpacing: '.8px'
                }}>
                    Desenvolvido por BrTech
                </Typography>
            </List>

            <ModalOptions anchorEl={anchorEl} open={open} onClose={handleClose} />
        </Box>

    );
};
