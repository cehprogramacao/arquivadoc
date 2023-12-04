"use client"
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Link from "next/link";
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
            <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                Notas
            </Typography>
            <Stack sx={{
                maxWidth: '900px',
                height:'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-between",
                marginTop: 0,
                flexWrap: 'wrap',
                position: 'relative',
                gap: 8,
                padding: "20px",
                placeContent: "center", 
            }}>
                <Link href={"/notas/CartorioDocs"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Escrituras
                        </Typography>
                    </StyledButton>
                </Link>
                <Link href={"/notas/procuracoes"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Procurações
                        </Typography>
                    </StyledButton>
                </Link>
                <Link href={"/notas/substabelecimento"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Substabelecimento
                        </Typography>
                    </StyledButton>
                </Link>
                <Link href={"/notas/inventario"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Inventário
                        </Typography>
                    </StyledButton>
                </Link>
                <Link href={"/notas/divorcio"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Divorcio
                        </Typography>
                    </StyledButton>
                </Link>
                <Link href={"/notas/ataNotarial"}>
                    <StyledButton variant="outlined" >
                        <FolderOpenOutlinedIcon sx={{
                            width: '80px',
                            height: 'auto'
                        }} />

                        <Typography sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: "clamp(14px, 1.5vw, 22px)"
                        }}>
                            Ata Notarial
                        </Typography>
                    </StyledButton>
                </Link>


            </Stack>
        </Box>
    );
}

export default PageNotas;
