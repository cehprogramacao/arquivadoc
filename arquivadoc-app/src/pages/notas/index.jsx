import Header from "@/Components/Header/Header";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import createRoutes from '@/routes/index.routes';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
const StyledButton = styled(Button)({
    maxWidth: '200px',
    fontSize: '17px',
    //   background: '#217117',
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
            <Typography fontSize={30} fontWeight={'bold'}>
                Notas
            </Typography>
            <Stack sx={{
                width: 'auto',
                display: 'flex',
                flexDirection: 'row',
                marginTop: 6,
                flexWrap: 'wrap',
                placeContent: 'space-evenly',
                position: 'relative',
                right: 0,
                alignItems: 'center',
                gap: 10,
                
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
                        Escrituras, Procurações, etc
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageCartoes}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />
                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Cartões de Autógrafo
                    </Typography>
                </StyledButton>
                <StyledButton variant="outlined" onClick={routes.goToPageTermos}>
                    <FolderOpenOutlinedIcon sx={{
                        width: '80px',
                        height: 'auto'
                    }} />
                    <Typography sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: "1em"
                    }}>
                        Termos LGPD
                    </Typography>
                </StyledButton>
            </Stack>
        </Box>
    );
}

export default PageNotas;
