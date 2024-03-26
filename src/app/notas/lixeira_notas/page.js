"use client"
import { Autocomplete, Box, Button, Drawer, Grid, Stack, TextField, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from "react";
import { DocList } from "@/Components/List/DocList";
import { Buttons } from "@/Components/Button/Button";
import withAuth from "@/utils/withAuth";
import CustomContainer from "@/Components/CustomContainer";

const BoxMain = styled('section')({
    maxWidth: '1300px',
    width: '85%',
    display: 'flex',
    flexDirection: "column",
    padding: '5px 10px'
});


const LixeiraNotas = () => {


    const BoxSearch = styled('div')({
        maxWidth: '100%',
        width: '100%',
        padding: '0px',
        display: "flex",
        gap: "30px",
        alignItems: 'center',
        flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
        flexDirection: isSmallScreen ? 'column' : 'row'
    });

    return (
        <Box sx={{
            width: '100%',
            height: "100vh",
            display: "flex",
            flexDirection: 'column',
            placeItems: 'center',
            gap: '10px'
        }}>
            <CustomContainer>
                <Grid container>
                    <Grid item xs={12} >
                        <Box sx={{
                            width: "100%",
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Typography fontSize={40} marginTop={13} fontWeight={'bold'} color={"black"}>
                                Lixeira Notas
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <DocList data={data} />
                    </Grid>
                </Grid>
            </CustomContainer>


        </Box>
    );
}

export default withAuth(LixeiraNotas);
