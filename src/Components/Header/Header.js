"use client"
import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { Sidebar } from '../SideBar/Sidebar';
import Image from 'next/image';
import { AuthProvider } from '@/context';

const Header = () => {
    const theme = useTheme()
    const [openSideBar, setOpenSideBar] = useState(false);

    const handleToggleButton = () => {
        setOpenSideBar(!openSideBar);
    };

    return (
        <AuthProvider>
            <AppBar position="fixed" sx={{ backgroundColor: theme.palette.background.header, height: '90px' }}>
                <Toolbar sx={{ width: "100%" }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleToggleButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ width: "100%", height: "90px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Link href={"/"} passHref>
                            <Image src="/image/logo.png" alt="logo" width={200} height={80} style={{ objectFit: "cover", cursor: 'pointer' }} />
                        </Link>
                    </Box>


                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={openSideBar} onClose={handleToggleButton}>
                <Sidebar />
            </Drawer>
        </AuthProvider>
    );
};

export default Header;
