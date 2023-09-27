"use client"
import { listItemIcon, button, listaConfig, listSx } from '../SideBar/styles';
import { ListItemIcon } from '@mui/material';
import { List, ListItem } from '@mui/material'
export const Sidebar = () => {

    return (

        <div>
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

            <List sx={listaConfig}>
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
                        <button style={button} >
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
        </div>

    );
};
