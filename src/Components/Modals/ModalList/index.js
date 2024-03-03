import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ModalList = ({ open, onClose, data, link }) => {


    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const handlePrintFile = () => {
        const base64Data = link;
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




    return (
        <Box>


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
                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        mt: 2,
                        gap: " 80px",
                        flexWrap: "wrap",
                        placeContent: "center"
                    }}>
                        <Box sx={{
                            width: isSmallScreen ? '100%' : '700px',
                            height: isSmallScreen ? '300px' : "520px",
                            padding: '20px'
                        }}>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer fileUrl={`data:application/pdf;base64,${link}`} plugins={[defaultLayoutPluginInstance]} />
                        
                            </Worker>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: '25px',
                            alignItems: 'start',
                            flexDirection: isSmallScreen ? 'row' : "column"
                        }}>
                            {/* Add your buttons here */}
                            <Button variant="outlined" color='inherit' sx={{
                                color: '#FFD500',
                                ":hover": {
                                    color: '#FFD500'
                                }
                            }}>
                                <EditIcon />
                            </Button>
                            <Button variant="outlined" color='inherit' sx={{
                                color: "#0dcaf0",
                                ":hover": {
                                    color: "#0DCAF0"
                                }
                            }} onClick={handlePrintFile} >
                                <PrintIcon />
                            </Button>
                            <Button variant="outlined" color='error' >
                                <DeleteIcon sx={{
                                    fill: '#dc3545'
                                }} />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default ModalList;
