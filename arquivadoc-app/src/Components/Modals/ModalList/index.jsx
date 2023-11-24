import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Box, Button, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
const ModalList = ({ open, onClose }) => {

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
                    maxWidth: 640,
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
                        width:"100%",
                        display: "flex",
                        flexDirection: "row",
                        mt: 2,
                        gap:" 80px",
                        flexWrap:"wrap",
                        placeContent:"center"
                    }}>
                        <Box sx={{
                            width: isSmallScreen ? '100%' : '400px',
                            maxHeight: isSmallScreen ? '300px' : "400px",
                            
                        }}>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer fileUrl="/teste.pdf" />
                            </Worker>
                        </Box>

                        <Box sx={{
                            display:'flex',
                            gap:'25px',
                            alignItems:'start',
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
                            <Button variant="outlined" sx={{
                                color: "#0dcaf0",
                                ":hover": {
                                    color: "#0dcaf0"
                                }
                            }} >
                                <PrintIcon />
                            </Button>
                            <Button variant="outlined" color='error' >
                                <DeleteIcon sx={{
                                    fill: '#dc3545'
                                }}/>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default ModalList;
