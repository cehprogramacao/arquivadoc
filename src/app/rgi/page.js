"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack, Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '@/Components/Modals/ModalList';
import { useEffect, useState } from 'react';
import { CadastroModalRGI } from '@/Components/Modals/ModalCadastroRGI';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CadastroRGITypes from '@/Components/ModalsRegistration/ModalTypesRGI';
import CustomContainer from '@/Components/CustomContainer';
import RGI from '@/services/rgi.service';
import { useSelector } from 'react-redux';
import Loading from '@/Components/loading';

const optionsFilter = [
    { label: 'Prenotação' },
    { label: 'Apresentante' },
];

const PageRGI = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const payload = useSelector(state => state.login)
    const [value, setValue] = useState({
        option: "",
        value: ""
    })
    const [loading, setLoading] = useState(false)
    const [openModalRGI, setOpenModalRGI] = useState(false)
    const [data, setData] = useState([])
    const [openFilterModalPDF, setOpenFilterModalPDF] = useState(false)
    const [openModalPartes, setOpenModalPartes] = useState(false)
    const handleOpenModalRGI = () => setOpenModalRGI(true)
    const handleCloseModalRGI = () => setOpenModalRGI(false)
    const handleOpenModalPartes = () => setOpenModalPartes(true)
    const handleCloseModalPartes = () => setOpenModalPartes(false)

    // Função para tratar o filtro de Prenotação
    const handlePrenotationFilter = async (value, accessToken) => {
        console.log('Filtrando por Prenotação com valor:', value);
        const { getByPrenotation } = new RGI();
        let newData = [];
        try {
            setLoading(true);
            const response = await getByPrenotation(value, accessToken);
            console.log('Resposta da Prenotação:', response.data);
            setOpenFilterModalPDF(!openFilterModalPDF)
            console.log(data, 9090)
            newData.push(response.data)
            setData(newData)
            return response
        } catch (error) {
            console.error("Erro ao filtrar por Prenotação", error);
        } finally {
            setLoading(false);
        }
    };

    console.log(data, 9090)

    // Função para tratar o filtro de Apresentante
    const handlePresenterFilter = async (value, accessToken) => {
        console.log('Filtrando por Apresentante com valor:', value);
        const { getByPresenter } = new RGI();
        let newData = [];
        try {
            setLoading(true);
            const response = await getByPresenter(value, accessToken);
            console.log('Resposta do Apresentante:', response.data);
            setOpenFilterModalPDF(!openFilterModalPDF)
            newData.push(response.data)
            setData(newData)
            return response.data
        } catch (error) {
            console.error("Erro ao filtrar por Apresentante", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async () => {
        console.log('Iniciando filtragem com valor:', value);

        const accessToken = sessionStorage.getItem("accessToken");
        console.log('AccessToken:', accessToken);

        if (value.option && value.value) {
            console.log('Opção selecionada:', value.option.label);

            try {
                if (value.option.label === "Prenotação") {
                    await handlePrenotationFilter(value.value, accessToken);
                } else if (value.option.label === "Apresentante") {
                    await handlePresenterFilter(value.value, accessToken);
                }

            } catch (error) {
                console.error("Erro ao filtrar", error);
            }
        } else {
            console.error("Opção ou valor não definidos.");
        }
    }
    const getDataRGI = async () => {
        const { getData } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getData(accessToken)
            console.log(response.data, 'Kauannnnnnnnnnnnnnnn')
            setData(Object.values(response.data))
            return response.data
        } catch (error) {
            console.error("error listing all rgi files", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getDataRGI()
        console.log(payload, '2002010kkkakakkakakakak')

    }, [])
    return (
        <>
            {loading ? <Loading />
                :
                <Box
                    sx={{
                        width: '100%',
                        height: '100vh',
                        py: 15,
                        px: 4,
                    }}
                >
                    <CustomContainer>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                        RGI
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={4} md={6} sm={6}>
                                        <TextField
                                            label="Buscar"
                                            fullWidth
                                            sx={{ '& input': { color: 'success.main' } }}
                                            color="success"
                                            value={value.value}
                                            onChange={(e) => setValue({ ...value, value: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={6} sm={6}>
                                        <Autocomplete
                                            disablePortal
                                            value={value.option}
                                            getOptionLabel={(option) => option.label || ""}
                                            onChange={(e, newValue) => setValue({ ...value, option: newValue })}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            id="combo-box-demo"
                                            options={optionsFilter}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Buscar Por"
                                                    color="success"
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            color: '#237117',
                                                        },
                                                        '& label.Mui-focused': {
                                                            color: '#237117',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#237117',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />

                                    </Grid>
                                    <Grid item xs={12} lg={4} md={12} sm={12}>
                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", alignItems: "center", gap: '30px' }}>
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleFilter} />
                                            <ButtonOpenModals onClick={handleOpenModalRGI} />
                                            <ButtonLixeira href={"/rgi/lixeira_rgi"} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} />
                            </Grid>
                        </Grid>
                    </CustomContainer>

                    {/* {openFilterModalPDF && <ModalList onClose={handleClose} data={data} open={open} />} */}
                    <Drawer anchor='left' open={openModalRGI} onClose={handleCloseModalRGI} >
                        <CadastroModalRGI onClose={handleCloseModalRGI} onClickPartes={handleOpenModalPartes} />
                    </Drawer>
                    <Drawer open={openModalPartes} onClose={handleCloseModalPartes} anchor='right' >
                        <CadastroPartes onClose={handleCloseModalPartes} />
                    </Drawer>
                </Box>
            }
        </>
    );
};

export default PageRGI;
