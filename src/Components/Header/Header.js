import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { Sidebar } from '../SideBar/Sidebar';
import Image from 'next/image';

const Header = () => {
    const [openSideBar, setOpenSideBar] = useState(false);

    const handleToggleButton = () => {
        setOpenSideBar(!openSideBar);
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#247117', height: '90px' }}>
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
        </>
    );
};

export default Header;
