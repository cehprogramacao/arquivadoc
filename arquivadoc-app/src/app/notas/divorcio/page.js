"use client"

import { Buttons } from "@/Components/Button/Button"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { CadastroNotasDivorcio } from "@/Components/Modals/ModalCadastroNotasDivorcio"
import { CadastroPartes } from "@/Components/Modals/ModalCadastroPartes"

import { Box, TextField, Typography, Autocomplete, useTheme, useMediaQuery, Drawer } from '@mui/material'
import { useState } from "react"


const top100Films = ['Ordem', 'Livro', 'CPF']


const pageDivorcio = () => {
    const [openModalCadastro, setOpenModalCadastro] = useState(false)
    const [openModalCadastroPartes, setOpenModalCadastroPartes] = useState(false)
    const handleOpenModalCadastro = () => setOpenModalCadastro(!openModalCadastro)
    const handleCloseModalCadastro = () => setOpenModalCadastro(!openModalCadastro)
    const handleOpenModalCadastroPartes = () => setOpenModalCadastroPartes(!openModalCadastroPartes)
    const handleCloseModalCadastroPartes = () => setOpenModalCadastroPartes(!openModalCadastroPartes)
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                marginTop: 11,
                position: 'relative',
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <Typography fontSize={isSmallScreen ? 30 : 40} fontWeight={'bold'} color={"black"}>
                Divórcio
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    gap: '30px',
                    placeItems: 'center',
                    placeContent: "center",
                    flexWrap: 'wrap',
                    marginTop: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, placeContent: "center", flexWrap: 'wrap' }}>
                    <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        renderInput={(params) => (
                            <TextField
                                color="success"
                                {...params}
                                label="Buscar Por"
                                sx={{
                                    color: "#237117",
                                    '& input': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        )}
                    />
                </Box>
                <Buttons color={'green'} title={'Buscar'} />
                <Box sx={{ display: 'flex', width: 'fit-content', gap: '30px' }}>
                    <ButtonOpenModals onClick={handleOpenModalCadastro}  />
                    <ButtonLixeira href={""} />
                </Box>
            </Box>
            <Drawer anchor="left" open={openModalCadastro} onClose={handleCloseModalCadastro}>
                <CadastroNotasDivorcio onClose={handleCloseModalCadastro} onClickPartes={handleOpenModalCadastroPartes} />
            </Drawer>
            <Drawer anchor="right" open={openModalCadastroPartes} onClose={handleCloseModalCadastroPartes}>
                <CadastroPartes onClose={handleCloseModalCadastroPartes} />
            </Drawer>
        </Box>
    )
}

export default pageDivorcio