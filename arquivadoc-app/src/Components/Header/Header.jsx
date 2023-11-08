"use client"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from 'react';
import { Sidebar } from '../SideBar/Sidebar';

import { Drawer, IconButton} from '@mui/material'

 const Header = () => {
    const [openSideBar, setOpenSideBar] = useState(false)
    const handleToggleButton = () => {
        setOpenSideBar(!openSideBar)
    }
    
    return (
        <div>
            <AppBar style={{
                width: '100%',
                display: "flex",
                alignItems: 'center',
                backgroundColor: '#247117',
                padding: '.8rem 1.5rem',
                flexDirection: 'row',
                flexWrap: 'wrap-reverse',
                justifyContent: 'center'
            }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleToggleButton}
                >
                    <MenuIcon />
                </IconButton>


                <Toolbar sx={{
                    display: 'flex',
                    margin: '0 auto'
                }}>
                    <img src="/image/logo.png" style={{
                        width: '150px',
                        maxWidth: '100%',
                        flexShrink: '0',
                        objectFit: 'cover',
                        
                    }} alt="" />
                </Toolbar>
            </AppBar>

            <Drawer anchor="left"  open={openSideBar} onClose={handleToggleButton}>
                <Sidebar />
            </Drawer>
        </div>
    )
}
export default Header