import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Modal, 
    Typography, 
    useMediaQuery, 
    useTheme,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ModalList = ({ 
    open, 
    data, 
    onClose, 
    notation, 
    deletePerm = 0, 
    editPerm = 0,
    handleDeleteByNotation 
}) => {
    const path = usePathname().split("/")[1];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [loading, setLoading] = useState(false);
    const [pdfError, setPdfError] = useState(false);

    const createBlobUrl = (base64Data) => {
        if (!base64Data) return null;
        
        try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro ao criar blob URL:', error);
            setPdfError(true);
            return null;
        }
    };

    const handlePrintFile = () => {
        if (!data?.file) {
            alert("Arquivo não disponível para impressão.");
            return;
        }

        try {
            const base64Data = data.file;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error('Erro ao imprimir:', error);
            alert("Não foi possível abrir o arquivo PDF.");
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja deletar este documento?')) return;
        
        try {
            setLoading(true);
            await handleDeleteByNotation();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert('Erro ao deletar documento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderPDFViewer = () => {
        if (!data?.file) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '400px'
                }}>
                    <Alert severity="warning" sx={{ textAlign: 'center' }}>
                        <Typography>
                            Documento não disponível ou arquivo inválido.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        if (pdfError) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '400px'
                }}>
                    <Alert severity="error" sx={{ textAlign: 'center' }}>
                        <Typography>
                            Erro ao carregar o documento PDF.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        const src = `data:application/pdf;base64,${data.file}`;

        return (
            <iframe
                title="PDF Viewer"
                src={src}
                width="100%"
                height="100%"
                style={{ 
                    border: 'none',
                    minHeight: isMobile ? '300px' : '500px'
                }}
                onError={() => setPdfError(true)}
            />
        );
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                width: isMobile ? '95%' : '90%',
                maxWidth: '1200px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                boxShadow: 24,
                borderRadius: "16px",
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Visualização de Documento
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {notation && (
                            <Chip 
                                label={`Notation: ${notation}`} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                            />
                        )}
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content Area */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                    {/* PDF Viewer */}
                    <Box sx={{ 
                        flex: 1, 
                        p: 2,
                        minHeight: isMobile ? '300px' : '500px'
                    }}>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                height: '100%',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{
                                p: 1,
                                borderBottom: '1px solid #e0e0e0',
                                bgcolor: '#fafafa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <VisibilityIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Documento PDF
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                {renderPDFViewer()}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Action Panel */}
                    <Box sx={{ 
                        width: isMobile ? '100%' : '200px',
                        p: 2,
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        gap: 2,
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                    }}>
                        {/* Edit Button - Only show if permission is granted */}
                        {editPerm === 1 && (
                            <Tooltip title="Editar documento">
                                <Link href={`/${path}/[notation]`} as={`/${path}/${notation}`}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth={!isMobile}
                                        sx={{
                                            color: '#ed6c02',
                                            borderColor: '#ed6c02',
                                            minWidth: isMobile ? '120px' : 'auto',
                                            ":hover": {
                                                backgroundColor: '#fff3e0',
                                                borderColor: '#ed6c02'
                                            }
                                        }}
                                        startIcon={<EditIcon />}
                                    >
                                        Editar
                                    </Button>
                                </Link>
                            </Tooltip>
                        )}

                        {/* Print Button */}
                        <Tooltip title="Imprimir documento">
                            <Button 
                                variant="outlined" 
                                fullWidth={!isMobile}
                                onClick={handlePrintFile}
                                disabled={!data?.file}
                                sx={{
                                    color: "#0dcaf0",
                                    borderColor: "#0dcaf0",
                                    minWidth: isMobile ? '120px' : 'auto',
                                    ":hover": {
                                        backgroundColor: '#e3f2fd',
                                        borderColor: "#0dcaf0"
                                    }
                                }}
                                startIcon={<PrintIcon />}
                            >
                                Imprimir
                            </Button>
                        </Tooltip>

                        {/* Delete Button - Only show if permission is granted */}
                        {deletePerm === 1 && (
                            <Tooltip title="Deletar documento">
                                <Button 
                                    variant="outlined" 
                                    color='error'
                                    fullWidth={!isMobile}
                                    onClick={handleDelete}
                                    disabled={loading}
                                    sx={{
                                        minWidth: isMobile ? '120px' : 'auto',
                                        ":hover": {
                                            backgroundColor: '#ffebee'
                                        }
                                    }}
                                    startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
                                >
                                    {loading ? 'Deletando...' : 'Deletar'}
                                </Button>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalList;