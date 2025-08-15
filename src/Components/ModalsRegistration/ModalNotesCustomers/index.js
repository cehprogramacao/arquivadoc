import React, { useState } from "react";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, Modal, styled, IconButton, Grid, FormControl, OutlinedInput } from "@mui/material";
import Customer from "@/services/customer.service";
import { CloseOutlined } from "@mui/icons-material";
import ReactInputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { SET_ALERT } from "@/store/actions";

const ButtonClose = styled('button')({
    boxSizing: 'content-box',
    width: '1em',
    height: '1em',
    padding: '0.25em 0.25em',
    color: '#000',
    border: 0,
    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
    borderRadius: '0.375rem',
    opacity: '.5',
    alignSelf: 'end',
    cursor: 'pointer',
    '&:hover': {
        opacity: '1',
    },
})
const ButtonCadastrar = styled('button')({
    display: 'flex',
    width: 'max-content',
    background: "#237117",
    padding: '10px 22px',
    color: '#fff',
    border: '1px solid #237117',
    textTransform: 'capitalize',
    fontSize: ".9rem",
    borderRadius: '5px',
    alignSelf: 'center',
    cursor: 'pointer',
    ":hover": {
        background: 'transparent',
        color: '#237117',
    }
})
const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';

const customerSv = new Customer();
const CadastroNotesCurtomers = ({ open, onClose, getData }) => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        cpfcnpj: "",
        name: ""
    });


    const dispatch = useDispatch();
    const handleInputChange = (e) => {
        const onlyDigits = e.target.value?.replace(/\D/g, '');
        console.log(onlyDigits);
        onlyDigits.length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setData({ ...data, cpfcnpj: onlyDigits });
    };

    const handleInputBlur = () => {
        if (data.cpfcnpj?.replace(/\D/g, '').length === 11) {
            setCpfCnpjMask(cpfMask);
        }
    };

    const handleCreateCustomers = async () => {
        console.log(data)
        try {
            setLoading(true)
            const response = await customerSv.createCustomer(data);
            console.log(response)
            dispatch({type: SET_ALERT, message: "Cliente cadastrado com sucesso!", severity: "success", alertType: 'file'});
            return response;
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", alertType: 'file'});
            console.error("Error creating customer:", error.message);
            throw error;
        }
        finally {
            onClose()
            getData()
        }
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="cadastro-partes-modal"
            aria-describedby="cadastro-partes-modal-description"

        >
            <Box sx={{
                width: { lg: 440, md: 440, sm: 380, xs: 300 },
                height: 'auto',
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                gap: '20px',
                backgroundColor: '#fff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px'
            }} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <Typography sx={{
                                fontSize: 'clamp(2rem, 1rem, 1.7rem)',
                            }} color={"black"}>
                                Cadastro
                            </Typography>
                            <IconButton aria-label="" onClick={onClose}>
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField sx={{
                            '& input': { color: 'success.main' }
                        }}
                            fullWidth
                            label="Name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData({...data, name: e.target.value})}
                            color='success'
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <FormControl fullWidth error={Boolean(errors['cpfcnpj'])}>
                            <ReactInputMask
                                mask={cpfCnpjMask}
                                value={data.cpfcnpj}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                name="cpfcnpj"
                            >
                                {(inputProps) => (
                                    <OutlinedInput
                                        {...inputProps}
                                        id={'id-documento'}
                                        label={'CPF/CNPJ'}
                                        color="success"
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
                    <Grid item xs={12} >
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Button variant="contained" color="success" onClick={handleCreateCustomers}>
                                Realizar Cadastro
                            </Button>
                        </Box>
                    </Grid>
                </Grid>







            </Box>
        </Modal>
    );
}

export default CadastroNotesCurtomers