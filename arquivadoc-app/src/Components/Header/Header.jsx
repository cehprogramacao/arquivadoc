"use client"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
export const Header = () => {
    return (
        <div>
            <AppBar style={{
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#247117',
                padding: '.7rem 1.5rem'
            }}>
                <Toolbar >
                    <img src="/logo.png" alt="" />
                </Toolbar>
            </AppBar>
        </div>
    )
}