
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import Header from "@/Components/Header/Header"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import createRoutes from "@/routes/index.routes"
import { Buttons } from "@/Components/Button/Button"
import { UserTable } from "./tableUser/table"



const PageUsuarios = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const top100Films = [
        {
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
    ];
    const routes = createRoutes()
    const [rows, setRows] = useState([
        { id: 1, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin'},
        { id: 1, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin'},
        { id: 1, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin'}
    ]);

    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };
    const [select, setSelect] = useState(null);
    const [valueInput, setValueInput] = useState('')
    const handleBuscar = () => {

    };

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            marginTop: 11,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center'
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} >
                Usuários
            </Typography>
            <div style={{
                width: 'auto',
                height: 'auto',
                padding: '8px',
                gap: '30px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                placeContent: 'space-evenly',
                flexDirection: isSmallScreen ? 'column' : 'row'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
                    <TextField label="Buscar"
                        sx={{
                            width: isSmallScreen ? '100%' : 400,
                            '& input': {
                                color: 'success.main',
                            },
                        }} color="success" />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                color="success"
                                label="Buscar Por"
                                onChange={(e) => {
                                    const selected = top100Films.find(
                                        (item) => item.label === e.target.value
                                    );
                                    setSelect(selected)
                                }}
                                sx={{
                                    color: "#237117",
                                    "& input": {
                                        color: "success.main",
                                    },
                                }}
                            />
                        )}
                    />
                </div>
                <Box sx={{
                    display: 'flex',
                    width: 'auto',
                    gap: isSmallScreen ? '20px' : '50px'
                }}>
                    <Buttons color={'green'} title={'Buscar'} />
                    <ButtonOpenModals />
                </Box>
            </div>
            <UserTable data={rows} onClick={handleExcluir} />
        </Box>
    )
}

export default PageUsuarios