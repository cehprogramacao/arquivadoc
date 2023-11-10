"use client"
import { listItemIcon, button, listaConfig, listSx } from '../SideBar/styles';
import { ListItemIcon } from '@mui/material';
import { List, ListItem } from '@mui/material'
import createRoutes from '@/routes/index.routes';
export const Sidebar = () => {
    const routes = createRoutes();

    return (

        <div >
            <List sx={listSx}>
                <ListItem >
                    <ListItemIcon sx={listItemIcon} >
                        <button style={button} onClick={routes.goToMainPage}>
                            <img src="/image/relogio.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer',
                            }} alt="" />
                            Recentes
                        </button>
                        <button style={button}>
                            <img src="/image/notas.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                            Notas
                        </button>
                        <button style={button} onClick={routes.goToPageTermos}>
                            <img src="/image/notas.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                            Termos
                        </button>
                        <button style={button} onClick={routes.goToPageRGI} >
                            <img src="/image/casa.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            RGI
                        </button>
                        <button style={button} onClick={routes.goToPageProtestos} >
                            <img src="/image/casa.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'

                            }} alt="" />
                            Protestos
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
                            <img src="/image/icon-neutro.png" style={{
                                width: '35px',
                                height: '35px',
                                flexShrink: 0,
                                cursor: 'pointer'
                            }} alt="" />
                        </button>
                        <button style={button} >
                            <img src="/image/config.png" style={{
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
