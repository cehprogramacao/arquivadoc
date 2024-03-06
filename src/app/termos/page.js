"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Drawer, Grid, FormControl, OutlinedInput } from "@mui/material"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { Buttons } from "@/Components/Button/Button"
import { CadastroTermosModal } from "@/Components/Modals/ModalCadastroTermo"
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes"
import ModalList from "@/Components/Modals/ModalList"
import CustomContainer from "@/Components/CustomContainer"
import { DocList } from "./components/tableTermos/table"
import Customer from "@/services/customer.service"
import ReactInputMask from "react-input-mask"
import ModalListTerm from "./components/modalList"


const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';
const PageTermos = () => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [dataOptions, setDataOptions] = useState({
        cpfcnpj: "",
        option: ""
    })
    const [openList, setOpenList] = useState(false);
    const [openPartes, setOpenPartes] = useState(false)
    const [data, setData] = useState([])
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleClosePartes = () => {
        setOpenPartes(false)
    }
    const handleOpenPartes = () => {
        setOpenPartes(true)
    }
    const handleOpenList = () => {
        setOpenList(true)
    }
    const handleCloseList = () => {
        setOpenList(false)
    }
    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setDataOptions({ ...dataOptions, cpfcnpj: e.target.value });
    };

    const handleInputBlur = () => {
        dataOptions.cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
    };
    const top100Films = [
        {
            label: 'CPF/CNPJ'
        },
    ];

    const handleFilterTermLGPD = async () => {
        console.log(dataOptions, '2929292929')
        const { getTermLGDP } = new Customer()
        let newData = []
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            setOpenModal(true)
            const response = await getTermLGDP(dataOptions.cpfcnpj, accessToken)
            console.log(response.data)
            newData.push(response.data)
            setData(newData)
            return response.data
        } catch (error) {
            console.error("Erro ao filtrar Termos", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            py: 12,
            px: 3
        }}>

            <CustomContainer>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                TERMOS
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={4} md={6} sm={12}>
                                <FormControl fullWidth error={Boolean(errors['cpfcnpj'])}>
                                    <ReactInputMask
                                        mask={cpfCnpjMask}
                                        value={dataOptions.cpfcnpj}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        name="cpfcnpj"
                                    >
                                        {(inputProps) => (
                                            <OutlinedInput
                                                {...inputProps}
                                                id={'id-documento'}
                                                color="success"
                                                placeholder={'CPF/CNPJ'}
                                                sx={{
                                                    borderRadius: '12.5px',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderRadius: '4px',
                                                    },
                                                }}
                                            />
                                        )}
                                    </ReactInputMask>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={top100Films}
                                    fullWidth
                                    autoHighlight
                                    value={dataOptions.option}
                                    getOptionLabel={(option) => option.label || ""}
                                    onChange={(e, newValue) => setDataOptions({ ...dataOptions, option: newValue })}
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            color="success"
                                            label="Buscar Por"
                                            sx={{
                                                color: "#237117",
                                                "& input": {
                                                    color: "success.main",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={12} sm={12}>
                                <Box sx={{ display: 'flex', justifyContent: "center", width: '100%', gap: '30px' }}>
                                    <Buttons color={'green'} title={'Buscar'} onClick={handleFilterTermLGPD} />
                                    <ButtonOpenModals onClick={handleOpen} />
                                    <ButtonLixeira href={"/termos/lixeira_termo"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        {openModal && <DocList data={data} onClick={handleOpenList} />}
                    </Grid>
                </Grid>
            </CustomContainer>
            {openModal && <ModalListTerm onClose={handleCloseList} open={openList} data={data} />}
            <Drawer anchor="left" open={open} onClose={handleClose} >
                <CadastroTermosModal onClose={handleClose} onClickPartes={handleOpenPartes} />
            </Drawer>
            <Drawer anchor="right" open={openPartes} onClose={handleClosePartes}>
                <CadastroPartes onClose={handleClosePartes} />
            </Drawer>
        </Box>
    )
}

export default PageTermos