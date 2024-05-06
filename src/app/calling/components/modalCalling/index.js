import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import RGI from '@/services/rgi.service';
import CustomContainer from '@/Components/CustomContainer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Calling from '@/services/calling.service';

const ModalCalling = ({ open, data, onClose, number, handleDeleteByNumber, deletePerm, editPerm }) => {
    const path = usePathname().split("/")[1]
    // console.log(data, '696969696996969696')
    const theme = useTheme()
    const createBlobUrl = (base64Data) => {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        return URL.createObjectURL(blob);
    };
    const handlePrintFile = () => {
        const base64Data = data.file;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Criar uma URL do Blob e abrir em uma nova janela
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // console.log(data, 'ModalListaaaaaaaaaaaaaaaaaaaaaaa')
    // console.log(data.file, 'Index e Filllllllllllllllllllllllle')



    return (
        <>


            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    width: '80%',
                    maxWidth: '100%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '1px solid #e9e9e9',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "20px"
                }}>
                    <Grid container alignItems={"flex-start"} justifyContent={"space-between"}>
                        <Grid item xs={12} lg={8} md={8} sm={12}>
                            <Box sx={{
                                width: "100%",
                                py: 2,
                                px: 2,
                                height: { lg: 500, md: 500, sm: 400, xs: 350 }
                            }}>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                    <Viewer fileUrl={`data:application/pdf;base64,${data.file}`} plugins={[defaultLayoutPluginInstance]} />
                                    {/* <Viewer fileUrl={createBlobUrl(data[index]?.file)} plugins={[defaultLayoutPluginInstance]} /> */}
                                    {/* <Viewer fileUrl={data[0]?.file} plugins={[defaultLayoutPluginInstance]} /> */}
                                </Worker>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={4} md={4} sm={12}>
                            <Box sx={{
                                width: "100%",
                                display: 'flex',
                                gap: '25px',
                                alignItems: { lg: "flex-end", md: "flex-end", sm: "center", xs: "center" },
                                flexDirection: { lg: "column", md: "column", sm: "row", xs: "row" },
                                py: 2,
                                justifyContent: { lg: "flex-end", md: "flex-end", sm: "center", xs: "center" }
                            }}>
                                {/* Add your buttons here */}
                                {editPerm === 1 &&
                                    <Link href={`/${path}/[number]`} as={`/${path}/${number}`}>
                                        <Button variant="outlined" color='inherit' sx={{
                                            color: '#FFD500',
                                            ":hover": {
                                                color: '#FFD500'
                                            }
                                        }}>
                                            <EditIcon />
                                        </Button>
                                    </Link>
                                }

                                <Button variant="outlined" color='inherit' sx={{
                                    color: "#0dcaf0",
                                    ":hover": {
                                        color: "#0DCAF0"
                                    }
                                }} onClick={() => handlePrintFile()} >
                                    <PrintIcon />
                                </Button>
                                {deletePerm === 1 &&
                                    <Button variant="outlined" color='error' onClick={handleDeleteByNumber}>
                                        <DeleteIcon sx={{
                                            fill: '#dc3545'
                                        }} />
                                    </Button>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                    {/* <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        mt: 2,
                        gap: " 80px",
                        flexWrap: "wrap",
                        placeContent: "center"
                    }}>


                        
                    </Box> */}
                </Box>
            </Modal>
        </>
    );
}

export default ModalCalling;
