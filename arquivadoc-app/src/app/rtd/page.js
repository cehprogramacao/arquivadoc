"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '../../Components/Button/Button';
import { ButtonLixeira } from '../../Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '../../Components/List/DocList';
import { ButtonOpenModals } from '../../Components/ButtonOpenModals';
import { Stack } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '../../Components/Modals/ModalList';
import { useEffect, useState } from 'react';
import { CadastroModalRTD } from '../../Components/Modals/ModalCadastroRTD';
import { CadastroPartes } from '../../Components/ModalsRegistration/ModalCadastroPartes';
import axios from 'axios'

const top100Films = [
    'Prenotação',
    'Nome',
    'Registro',
    'CPF/CNPJ',
    'Livro',
    'Folha'
];

const docs = [
    {
        id: 1,
        name: 'Ronaldo',
        text: 'Procuração',
        link: '/teste.pdf'
    },
    {
        id: 2,
        name: 'Kauan BrTech',
        text: 'Compra e Venda',
        link: '/'
    },

];

const PageRTD = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false)
    const [openModalCadastroRTD, setOpenModalCadastroRTD] = useState(false)
    const [openModalCadastroPartes, setOpenModalCadastroPartes] = useState(false)

    const [list, setList] = useState([]);
    const [selectOption, setSelectOption] = useState(null)
    const [selectValue, setSelectValue] = useState('')


    const [temp, setTemp] = useState(null)
    const handleOpenModalListFilePDF = (index) => {
        setTemp(index)
        setOpenModalListFilePDF(true)

    }
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/data/${selectValue}`);
            if (response.ok) {
                const data = await response.json();
                setList(data.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };
    // useEffect(() => {
    //     fetchData();

    // }, []);
    const handleCloseModalListFilePDF = () => {
        setOpenModalListFilePDF(false)
    }
    const handleOpenModalCadastroRTD = () => setOpenModalCadastroRTD(true)
    const handleCloseModalCadastroRTD = () => setOpenModalCadastroRTD(false)

    const handleOpenModalPartes = () => setOpenModalCadastroPartes(true)
    const handleCloseModalPartes = () => setOpenModalCadastroPartes(false)

    const handleOnChangeOptions = (_, value) => {
        setSelectOption(value)
        console.log(value)
    }
    const handleBuscar = () => {
        if (selectValue.trim() !== '' || selectOption !== '') {
            fetchData()
        }
        return false
    }

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
                gap: '10px',
            }}
        >
            <Typography fontSize={40} fontWeight={'bold'} color="black">
                RTD
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: isSmallScreen ? 'center' : 'flex-start',
                    gap: '30px',
                    margin: '0 auto',
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                    placeContent: 'center',
                    marginTop: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', placeContent: "center" }}>
                    <TextField
                        label="Buscar"
                        value={selectValue}
                        onChange={(e) => setSelectValue(e.target.value)}
                        sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        value={selectOption}
                        onChange={handleOnChangeOptions}
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
                <Buttons color={'green'} title={'Buscar'} onClick={handleBuscar} />
                <Box sx={{ display: 'flex', width: 'auto', gap: '30px' }}>
                    <ButtonOpenModals onClick={handleOpenModalCadastroRTD} />
                    <ButtonLixeira href={"/rtd/lixeira_rtd"} />
                </Box>
            </Box>
            {list.length > 0 && (
                <DocList
                    data={list}
                    sx={{ marginTop: isSmallScreen ? 2 : 0 }}
                    onClick={handleOpenModalListFilePDF}
                />
            )}

            {list.length === 0 && (
                <Typography fontSize={40} marginTop={12} color={'black'}>
                    Nenhum Arquivo Existente
                </Typography>
            )}
            <ModalList data={list} link={list[temp]?.data} onClose={handleCloseModalListFilePDF} open={openModalListFilePDF} />



            <Drawer anchor='left' open={openModalCadastroRTD} onClose={handleCloseModalCadastroRTD}>
                <CadastroModalRTD onClose={handleCloseModalCadastroRTD} onClickPartes={handleOpenModalPartes} />
            </Drawer>
            <Drawer anchor='right' open={openModalCadastroPartes} onClose={handleCloseModalPartes} >
                <CadastroPartes onClose={handleCloseModalPartes} />
            </Drawer>
        </Box>
    );
};

export default PageRTD;