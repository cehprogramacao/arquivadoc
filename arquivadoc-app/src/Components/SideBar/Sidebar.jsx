"use client"

import { Drawer, List, ListItem, ListItemIcon } from '@mui/material';
import { containerStyle,listSx, listItemIcon, button, listaSx } from './styles';
import { Container } from '@mui/material';
export const Sidebar = () => {

    const handleOpenConfig = () => {
        alert('Clicou')
    }

    return (

        <Container style={containerStyle}>
            <List sx={listSx}>
                <ListItem >
                    <ListItemIcon sx={listItemIcon}>
                        <button style={button}>
                            <img src="/relogio.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer',
                            }} alt="" />
                            Recentes
                        </button>
                        <button style={button}>
                            <img src="/notas.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                            Notas
                        </button>
                        <button style={button}>
                            <img src="/casa.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
    
                            }} alt="" />
                            RGI
                        </button>

                    </ListItemIcon>
                </ListItem>

            </List>

            <List sx={listaSx}>
                <ListItem>
                    <ListItemIcon sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        gap: '20px',
                        padding: '20px 0'
                    }}>
                        <button style={button}>
                            <img src="/icon-neutro.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </button>
                        <button style={button} onClick={handleOpenConfig}>
                            <img src="/config.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </button>
                    </ListItemIcon>
                </ListItem>
            </List>
        </Container>

    );
};
