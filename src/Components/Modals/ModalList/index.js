import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Modal,
    Typography,
    useMediaQuery,
    useTheme,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DocumentScannerOutlined } from '@mui/icons-material';
import { File } from 'lucide-react';

const ModalList = ({
    open,
    data,
    onClose,
    prenotation,
    deletePerm = 0,
    editPerm = 0,
    handleDeleteByPrenotation
}) => {
    const path = usePathname().split("/")[1];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState('doc');

    const createBlobUrl = (base64Data) => {
        if (!base64Data) return null;

        try {
            const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro ao criar blob URL:', error);
            return null;
        }
    };

    const documentTypes = [
        {
            id: 'doc',
            label: 'Documento Principal',
            icon: <DocumentScannerOutlined />,
            fileKey: 'file'
        },
        {
            id: 'matricula',
            label: 'Matrícula',
            icon: <File />,
            fileKey: 'matricula_acervo_file'
        }
    ];

    const availableDocuments = documentTypes.filter(
        doc => data?.[doc.fileKey]
    );

    const getCurrentDocument = () => {
        const docType = documentTypes.find(d => d.id === selectedDocument);
        if (!docType) return null;

        return {
            ...docType,
            file: data?.[docType.fileKey]
        };
    };

    useEffect(() => {
        if (availableDocuments.length > 0) {
            setSelectedDocument(availableDocuments[0].id);
        }
    }, [data]);

    const handlePrintFile = () => {
        const currentDoc = getCurrentDocument();

        if (!currentDoc?.file) {
            alert("Arquivo não disponível para impressão.");
            return;
        }

        const blobUrl = createBlobUrl(currentDoc.file);
        if (blobUrl) {
            window.open(blobUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } else {
            alert("Não foi possível abrir o arquivo PDF.");
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja deletar este documento?')) return;

        try {
            setLoading(true);
            await handleDeleteByPrenotation();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert('Erro ao deletar documento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderPDFViewer = () => {
        const currentDoc = getCurrentDocument();

        if (!currentDoc?.file) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '400px'
                    }}
                >
                    <Alert severity="warning">
                        <Typography>
                            Documento não disponível ou arquivo inválido.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        return (
            <iframe
                title={`${currentDoc.label} Viewer`}
                src={`data:application/pdf;base64,${currentDoc.file}`}
                width="100%"
                height="100%"
                style={{
                    border: 'none',
                    minHeight: isMobile ? '300px' : '500px'
                }}
            />
        );
    };

    const currentDoc = getCurrentDocument();

    return (
        <Modal open={open} onClose={onClose}>
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
                        <BookmarkIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Visualização de Documento
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {prenotation && (
                            <Chip
                                label={`Prenotação: ${prenotation}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                icon={<BookmarkIcon />}
                            />
                        )}
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {availableDocuments.length > 1 && (
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', px: 2 }}>
                        <Tabs
                            value={selectedDocument}
                            onChange={(e, newValue) => setSelectedDocument(newValue)}
                            variant={isMobile ? "scrollable" : "standard"}
                            scrollButtons="auto"
                        >
                            {availableDocuments.map(doc => (
                                <Tab
                                    key={doc.id}
                                    value={doc.id}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {doc.icon}
                                            <Typography variant="body2">
                                                {isMobile ? doc.label.split(' ')[0] : doc.label}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>
                )}

                <Box sx={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                    <Box sx={{ flex: 1, p: 2 }}>
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                                <VisibilityIcon fontSize="small" />
                                <Typography variant="body2">
                                    {currentDoc?.label || 'Documento'}
                                </Typography>
                                {currentDoc?.file && (
                                    <Chip label="Disponível" size="small" color="success" sx={{ ml: 'auto' }} />
                                )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                {renderPDFViewer()}
                            </Box>
                        </Paper>
                    </Box>

                    <Box sx={{
                        width: isMobile ? '100%' : '200px',
                        p: 2,
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        gap: 2
                    }}>
                        {editPerm === 1 && prenotation && (
                            <Tooltip title="Editar documento">
                                <Link href={`/${path}/${prenotation}`}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        fullWidth={!isMobile}
                                    >
                                        Editar
                                    </Button>
                                </Link>
                            </Tooltip>
                        )}

                        <Tooltip title="Imprimir documento">
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handlePrintFile}
                                disabled={!currentDoc?.file}
                                fullWidth={!isMobile}
                            >
                                Imprimir
                            </Button>
                        </Tooltip>

                        {deletePerm === 1 && (
                            <Tooltip title="Deletar documento">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
                                    onClick={handleDelete}
                                    disabled={loading}
                                    fullWidth={!isMobile}
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
