"use client"
import { listItemIcon, button, listaConfig, listSx } from '../SideBar/styles';
import { Box, ListItemIcon, Typography } from '@mui/material';
import { List, ListItem } from '@mui/material'
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

    return (

        <Box >
            <List sx={listSx}>
                <ListItem >
                    <ListItemIcon sx={listItemIcon} >
                        <button style={button} onClick={routes.goToMainPage}>
                            <QueryBuilderSharpIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer',

                            }} alt="" />
                            Recentes
                        </button>
                        <button style={button} onClick={routes.goToPageNotas}>
                            <DescriptionOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                            Notas
                        </button>

                        <button style={button} onClick={routes.goToPageRGI} >
                            <HomeOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            RGI
                        </button>
                        <button style={button} onClick={routes.goToPageProtestos} >
                            <PendingActionsSharpIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            Protestos
                        </button>
                        <button style={button} onClick={routes.goToPageOficios} >
                            <NoteAltOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            Ofícios
                        </button>
                        <button style={button} onClick={routes.goToPageRTD} >
                            <NoteAltOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            RTD
                        </button>
                        <button style={button} onClick={routes.goToPageRPJ} >
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

            <List sx={listaConfig}>
                <ListItem>
                    <ListItemIcon sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        gap: '20px',
                        padding: '10px 0',
                        margin: '0 auto'
                    }}>
                        <button style={button}>
                            <SettingsOutlinedIcon sx={{
                                width: '40px',
                                height: '40px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </button>
                        <button style={button} >
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
