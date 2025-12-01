"use client"
import Loading from '@/Components/loading'
import { AuthProvider } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CustomContainer from '@/Components/CustomContainer'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { useDispatch } from 'react-redux'
import { SET_ALERT, showAlert } from '@/store/actions'
import RPJService from '@/services/rpj.service'
import SnackBar from '@/Components/SnackBar'
import { useRouter } from 'next/navigation'
import ScannerIcon from '@mui/icons-material/Scanner'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'

const rpjSv = new RPJService()

const UpdateFileAutographCard = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        box: 0,
        card_file_url: "",
        doc_file_url: "",
        cpf_file_url: "",
        comp_resid_file_url: ""
    })

    const [fileNames, setFileNames] = useState({
        card_file_url: "",
        doc_file_url: "",
        cpf_file_url: "",
        comp_resid_file_url: ""
    })

    const fileLabels = {
        card_file_url: "Cartão de Autógrafo",
        doc_file_url: "Documento",
        cpf_file_url: "CPF",
        comp_resid_file_url: "Comprovante de Residência"
    }

    const handleChangeFileUrl = (name, event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setData(state => ({ ...state, [name]: fileResult }))
                setFileNames(state => ({ ...state, [name]: files.name }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const updateDataWithUrl = (fieldName, base64Url) => {
        setData(state => ({ ...state, [fieldName]: base64Url }))
        setFileNames(state => ({ ...state, [fieldName]: `Documento escaneado - ${new Date().toLocaleString()}` }))
    }

    const clearFile = (fieldName) => {
        setData(state => ({ ...state, [fieldName]: "" }))
        setFileNames(state => ({ ...state, [fieldName]: "" }))
    }

    // Função genérica de scan
    const handleScan = (fieldName, customSettings = {}) => {
        if (!window.scanner) {
            dispatch(showAlert("Scanner não disponível", "error", "file"))
            return
        }

        const defaultSettings = {
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": `${fileLabels[fieldName]} - Escaneado por \${USERNAME} em \${DATETIME}`
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 200
                }
            ]
        }

        const settings = { ...defaultSettings, ...customSettings }

        window.scanner.scan((successful, mesg, response) => {
            if (!successful) {
                console.error('Falha no scan: ' + mesg)
                dispatch(showAlert(`Erro no scan: ${mesg}`, "error", "file"))
                return
            }
            if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
                console.info('Usuário cancelou o scan')
                return
            }
            try {
                const responseJson = JSON.parse(response)
                const scannedPdfUrl = responseJson.output[0].result[0]
                updateDataWithUrl(fieldName, scannedPdfUrl)
                dispatch(showAlert(`${fileLabels[fieldName]} escaneado com sucesso!`, "success", "file"))
            } catch (error) {
                console.error('Erro ao processar resposta do scan:', error)
                dispatch(showAlert("Erro ao processar arquivo escaneado", "error", "file"))
            }
        }, settings)
    }

    // Funções específicas de scan para cada tipo de documento
    const handleCardScan = () => {
        handleScan('card_file_url', {
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "Cartão de Autógrafo - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 300
                }
            ]
        })
    }

    const handleDocScan = () => {
        handleScan('doc_file_url')
    }

    const handleCpfScan = () => {
        handleScan('cpf_file_url', {
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "CPF - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 250
                }
            ]
        })
    }

    const handleCompResidScan = () => {
        handleScan('comp_resid_file_url', {
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "Comprovante de Residência - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 250
                }
            ]
        })
    }

    const handleUpdateAutographCard = async () => {
        // Validação básica
        if (!data.card_file_url && !data.doc_file_url && !data.cpf_file_url && !data.comp_resid_file_url) {
            dispatch({type: SET_ALERT, message: "Pelo menos um arquivo deve ser carregado!", severity: "error", alertType: "file"})
            return
        }

        try {
            setLoading(true)
            const response = await rpjSv.updateRPJByNotation(params.cpfcnpj, data)
            dispatch({type: SET_ALERT, message: "Arquivos atualizados com sucesso!", severity: "success", alertType: "file"})
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", alertType: "file"})
            console.error("Erro ao atualizar arquivo", error)
            throw error
        } finally {
            setLoading(false)
            router.push("/autograph-card")
        }
    }

    const FileUploadSection = ({ fieldName, scanHandler, label }) => (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="subtitle1"
                gutterBottom
                color="text.primary"
                sx={{
                    fontWeight: 500,
                    mb: 2,
                    fontSize: '1rem'
                }}
            >
                {label}
            </Typography>

            <Box sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 2
            }}>
                <Button
                    variant="outlined"
                    startIcon={<ScannerIcon />}
                    onClick={scanHandler}
                    size="medium"
                    sx={{
                        borderColor: '#FFC117',
                        color: '#FFC117',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: '#FFC117',
                            color: '#000',
                            borderColor: '#FFC117'
                        }
                    }}
                >
                    Escanear
                </Button>

                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    size="medium"
                    sx={{
                        backgroundColor: '#237117',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: '#1e5f14'
                        }
                    }}
                >
                    Carregar Arquivo
                    <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleChangeFileUrl(fieldName, e)}
                    />
                </Button>

                {data[fieldName] && (
                    <IconButton
                        onClick={() => clearFile(fieldName)}
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>

            {data[fieldName] && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    backgroundColor: '#e8f5e8',
                    borderRadius: 1,
                    border: '1px solid #c8e6c9'
                }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                    <Typography
                        variant="body2"
                        sx={{ color: '#2e7d32', fontWeight: 500 }}
                    >
                        {fileNames[fieldName] || "Arquivo carregado"}
                    </Typography>
                </Box>
            )}
        </Box>
    )

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                <Box sx={{
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    px: 2,
                    py: 15,
                    justifyContent: "center",
                    bgcolor: "#fafafa"
                }}>
                    <Container maxWidth="lg">
                        <CustomContainer>
                            {/* Header */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    color="primary"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1
                                    }}
                                >
                                    Atualizar Arquivos
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                >
                                    Cartão de Autógrafo
                                </Typography>
                            </Box>

                            <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
                                <Grid container spacing={4}>
                                    {/* Campo Caixa */}
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                            sx={{ mb: 2, fontWeight: 500 }}
                                        >
                                            Informações Gerais
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="box"
                                            name="box"
                                            label="Número da Caixa"
                                            value={data.box}
                                            onChange={(e) => setData(state => ({ ...state, box: e.target.value }))}
                                            type='number'
                                            variant="outlined"
                                            helperText="Informe o número da caixa onde o documento será arquivado"
                                            size="medium"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                            sx={{ mb: 3, fontWeight: 500 }}
                                        >
                                            Documentos
                                        </Typography>
                                    </Grid>

                                    {/* Seções de upload de arquivos */}
                                    <Grid item xs={12} md={6}>
                                        <FileUploadSection
                                            fieldName="card_file_url"
                                            scanHandler={handleCardScan}
                                            label="Cartão de Autógrafo"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FileUploadSection
                                            fieldName="doc_file_url"
                                            scanHandler={handleDocScan}
                                            label="Documento de Identificação"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FileUploadSection
                                            fieldName="cpf_file_url"
                                            scanHandler={handleCpfScan}
                                            label="CPF"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FileUploadSection
                                            fieldName="comp_resid_file_url"
                                            scanHandler={handleCompResidScan}
                                            label="Comprovante de Residência"
                                        />
                                    </Grid>

                                    {/* Botões de ação */}
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 3 }} />
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: 2
                                        }}>
                                            <Button
                                                component="a"
                                                href='/autograph-card'
                                                variant="outlined"
                                                color="primary"
                                                size="large"
                                                sx={{
                                                    px: 4,
                                                    textTransform: 'none',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Voltar
                                            </Button>
                                            <Button
                                                onClick={handleUpdateAutographCard}
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                disabled={loading || (!data.card_file_url && !data.doc_file_url && !data.cpf_file_url && !data.comp_resid_file_url)}
                                                sx={{
                                                    display: 'flex',
                                                    width: '169px',
                                                    background: "#237117",
                                                    color: '#fff',
                                                    border: '1px solid #237117',
                                                    textTransform: 'capitalize',
                                                    fontSize: ".9rem",
                                                    borderRadius: '8px',
                                                    ":hover": {
                                                        background: 'transparent',
                                                        color: '#237117',

                                                    }
                                                }}
                                            >
                                                Atualizar Arquivos
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </CustomContainer>
                    </Container>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default UpdateFileAutographCard