"use client"
import { listItemIcon, button, listaConfig, listSx } from '../SideBar/styles';
import { Box, ListItemIcon, Typography, List, ListItem, useTheme, useMediaQuery } from '@mui/material';

import createRoutes from '@/routes/index.routes';
import PendingActionsSharpIcon from '@mui/icons-material/PendingActionsSharp';
import QueryBuilderSharpIcon from '@mui/icons-material/QueryBuilderSharp';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from 'next/link';

export const Sidebar = () => {
    const routes = createRoutes();


    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (

        <Box >
            <List sx={{
                width: '100%',
                display: 'flex',
                height: isSmallScreen ? 'auto' : 'max-content',
                alignItems: 'start',
                borderBottom: '1px solid #FFFFFF',
                backgroundColor: '#237117',
                overflowY: 'auto',
                flex: 1,

                '::-webkit-scrollbar': {
                    width: '15px',

                },
                '::-webkit-scrollbar-thumb': {
                    background: '#E9E9E9',
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
                        left: '0px',
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
                        }} onClick={routes.goToMainPage}>
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
                        }} onClick={routes.goToPageNotas}>
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
                        }} onClick={routes.goToPageRGI} >
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
                        }} onClick={routes.goToPageProtestos} >
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
                        }} onClick={routes.goToPageOficios} >
                            <NoteAltOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            Ofícios
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
                        }} onClick={routes.goToPageRTD} >
                            <NoteAltOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            RTD
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
                        }} onClick={routes.goToPageRPJ} >
                            <NoteAltOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            RPJ
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
                height:'auto',
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
                        }} >
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


        </Box>

    );
};
