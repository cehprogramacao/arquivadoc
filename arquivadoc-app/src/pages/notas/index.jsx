import Header from "@/Components/Header/Header";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import createRoutes from '@/routes/index.routes';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
const StyledButton = styled(Button)({
    width: '200px',
    fontSize: 'clamp(1rem, 1.3rem, 2rem)',
    display: 'flex',
    flexDirection: 'column',
    color: '#237117',
    border: 'none',
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
    '&:hover': {
        background: 'none',
        border: 'none'
    },
});

const PageNotas = () => {
    const routes = createRoutes();

    return (
        <Box sx={{
            width: '100%',
            marginTop: 11,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            placeItems: 'center'
        }}>
            <Header />
            <Typography fontSize={40} fontWeight={'bold'}>
                Notas
            </Typography>
            <Stack sx={{
                width: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-between",
                marginTop: 2,
                flexWrap: 'wrap',
                
                position: 'relative',
                gap: 5,
                placeContent: "center"
            }}>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Escrituras
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Procurações
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "19px",
                    }}>
                        Substabelecimento
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Iventrário
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Divorcio
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartorioDocs}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />

                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Ata Notarial
                    </Typography>
                </StyledButton>
                
                
            </Stack>
        </Box>
    );
}

export default PageNotas;
