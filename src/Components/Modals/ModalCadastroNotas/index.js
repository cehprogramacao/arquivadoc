import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  styled,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import { ModalNotesTag } from "@/Components/ModalsRegistration/ModalNotesTag";
import CloseIcon from '@mui/icons-material/Close';
import ScannerIcon from '@mui/icons-material/Scanner';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CadastroNotesType from "@/Components/ModalsRegistration/ModalNotesTypes";
import CadastroNotesCurtomers from "@/Components/ModalsRegistration/ModalNotesCustomers";
import NoteService from "@/services/notes.service";
import Customer from "@/services/customer.service";
import { ModalNotesGroup } from "@/Components/ModalsRegistration/ModalNotesGroup";



const BoxSearchTitle = styled(Box)({
  maxWidth: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const ButtonClose = styled("button")({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer'
});

const ButtonScanner = styled("button")(({ disabled }) => ({
  width: "100%",
  background: disabled ? '#cccccc' : 'transparent',
  padding: '12px 20px',
  color: disabled ? '#666666' : '#FED70B',
  borderRadius: "7px",
  border: disabled ? '1px solid #cccccc' : '1px solid #FED70B',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  ":hover": {
    background: disabled ? '#cccccc' : '#FED70B',
    color: disabled ? '#666666' : '#fff'
  }
}));

const ButtonUpload = styled("label")(({ disabled }) => ({
  width: "100%",
  background: disabled ? '#cccccc' : 'transparent',
  padding: '12px 20px',
  color: disabled ? '#666666' : '#247117',
  borderRadius: "7px",
  border: disabled ? '1px solid #cccccc' : '1px solid #247117',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  ":hover": {
    background: disabled ? '#cccccc' : '#247117',
    color: disabled ? '#666666' : '#fff'
  }
}));

const ButtonCadastrar = styled("button")({
  width: "100%",
  background: '#237117',
  padding: '12px 45px',
  color: '#fff',
  borderRadius: "7px",
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  ":hover": {
    background: '#1a5a11',
  },
  ":disabled": {
    background: '#cccccc',
    cursor: 'not-allowed',
    color: '#666666'
  }
});

const FileInfoBox = styled(Box)({
  width: '100%',
  padding: '12px',
  borderRadius: '7px',
  border: '1px solid #e0e0e0',
  background: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px'
});

const customerSv = new Customer()
const noteSv = new NoteService()

export const CadastroNotas = ({ onClose, getData, dataSnack }) => {
  const [outorgantes, setOutorgantes] = useState([""]);
  const [outorgados, setOutorgados] = useState([""]);
  const [valuePresenter, setValuePresenter] = useState("")
  const [valueTag, setValueTag] = useState("")
  const [valueOutorgante, setValueOutorgante] = useState(Array(outorgantes.length).fill(''));
  const [valueOutorgado, setValueOutorgado] = useState(Array(outorgados.length).fill(''));
  
  // Estados para controle de arquivo
  const [fileInfo, setFileInfo] = useState(null);
  const [fileSource, setFileSource] = useState(null); // 'scanner' ou 'upload'
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    order_num: 0,
    tag: 0,
    presenter: '',
    service_type: 0,
    book: 0,
    initial_sheet: 0,
    final_sheet: 0,
    box: 0,
    grantors: [],
    granteds: [],
    file_url: "",
    serviceName: ""
  });

  const fileInputRef = useRef(null);

  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (file.type !== 'application/pdf') {
        dataSnack({
          open: true,
          text: "Por favor, selecione apenas arquivos PDF",
          severity: "error",
          type: "file"
        });
        return;
      }

      // Validar tamanho (ex: máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        dataSnack({
          open: true,
          text: "O arquivo é muito grande. Tamanho máximo: 10MB",
          severity: "error",
          type: "file"
        });
        return;
      }

      setIsUploading(true);
      const fileReader = new FileReader();
      
      fileReader.onloadend = () => {
        const fileResult = fileReader.result.split(",")[1];
        setFormData((prevFormData) => ({ ...prevFormData, file_url: fileResult }));
        setFileInfo({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          type: file.type
        });
        setFileSource('upload');
        setIsUploading(false);
        
        dataSnack({

          
          open: true,
          text: "Arquivo carregado com sucesso!",
          severity: "success",
          type: "file"
        });
      };

      fileReader.onerror = () => {
        setIsUploading(false);
        dataSnack({
          open: true,
          text: "Erro ao carregar arquivo",
          severity: "error",
          type: "file"
        });
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleChangeFile = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const [outorganteArray, setOutorganteArray] = useState([])
  const [outorgadoArray, setOutorgadoArray] = useState([])

  const getCustumers = async () => {
    try {
      const allData = await customerSv.customers()
      setOutorganteArray(Object.values(allData))
      setOutorgadoArray(Object.values(allData))
      console.log(allData)
      return allData
    } catch (error) {
      console.error("Erro ao listar cliente!", error)
      throw error;
    }
  }

  const boxInputsRef = useRef(null);

  const adicionarInput = (tipo, event) => {
    event.preventDefault();
    const currentScrollPosition = boxInputsRef.current.scrollTop;
    if (tipo === "outorgante") {
      setOutorgantes((prev) => [...prev, ""]);
      setValueOutorgante((prev) => [...prev, null]); // null para novo autocomplete vazio
    } else if (tipo === "outorgado") {
      setOutorgados((prev) => [...prev, ""]);
      setValueOutorgado((prev) => [...prev, null]); // null para novo autocomplete vazio
    }
    setTimeout(() => {
      boxInputsRef.current.scrollTop = currentScrollPosition;
    }, 0);
  };

  const removerInput = (tipo, index) => {
    const currentScrollPosition = boxInputsRef.current.scrollTop;
    if (tipo === "outorgante" && outorgantes.length >= 2) {
      setOutorgantes((prev) => prev.filter((_, i) => i !== index));
      setValueOutorgante((prev) => prev.filter((_, i) => i !== index));
    } else if (tipo === "outorgado" && outorgados.length >= 2) {
      setOutorgados((prev) => prev.filter((_, i) => i !== index));
      setValueOutorgado((prev) => prev.filter((_, i) => i !== index));
    }
    setTimeout(() => {
      boxInputsRef.current.scrollTop = currentScrollPosition;
    }, 0);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      grantors: valueOutorgante.filter(Boolean).map(item => item?.cpfcnpj || item),
      granteds: valueOutorgado.filter(Boolean).map(item => item?.cpfcnpj || item),
    }));
  }, [valueOutorgante, valueOutorgado]);

  const handleChange = (tipo, index, valor) => {
    if (tipo === "outorgante") {
      const novosOutorgantes = [...outorgantes];
      novosOutorgantes[index] = valor;
      console.log(novosOutorgantes)
      setOutorgantes(novosOutorgantes);
    } else if (tipo === "outorgado") {
      const novosOutorgados = [...outorgados];
      novosOutorgados[index] = valor;
      console.log(novosOutorgados)
      setOutorgados(novosOutorgados);
    }
  };

  const [tag, setTag] = useState([])
  const [presenter, setPresenter] = useState([])

  const getAllNotesTag = async () => {
    try {
      const allTags = await noteSv.getAllNoteTags()
      setTag(Object.values(allTags))
      console.log(allTags, '99999999999')
      return allTags
    } catch (error) {
      console.error("Error list of tags", error)
      throw error;
    }
  }

  const getCustomersPresenter = async () => {
    try {
      const allPresenter = await customerSv.customers();
      const newData = Object.values(allPresenter);
      setPresenter(newData);
      console.log(allPresenter);
    } catch (error) {
      console.error("Error when listing presenters", error);
      throw error;
    }
  };

  const [notesType, setNotesType] = useState([]);
  const [valueNotesType, setValueNotesType] = useState(null);
  const [typesGroup, setTypesGroup] = useState([])
  const [option, setOption] = useState(null);

  const getTypeAndGroup = async () => {
    try {
      const groups = await noteSv.getAllNoteGroups();
      const types = await noteSv.getAllNoteTypes();
      setNotesType(Object.values(groups))
      setTypesGroup(Object.values(types))
      console.log(groups, types, '88888')
      return groups && types
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNotesTag()
    getCustomersPresenter()
    getTypeAndGroup()
    getCustumers()
  }, [])

  const [openModalTag, setOpenModalTag] = useState(false)
  const [openModalPresenter, setOpenModalPresenter] = useState(false)
  const [openModalNotesType, setOpenModalNotesType] = useState(false)
  const [openModalNotesCustomers, setOpenModalNotesCustomers] = useState(false)
  const [openModalGroup, setOpenModalGroup] = useState(false)

  const handleOpenGroup = () => {
    setOpenModalGroup(!openModalGroup)
  }
  const handleCloseGroup = () => {
    setOpenModalGroup(!openModalGroup)
  }
  const handleOpenModalTag = () => {
    setOpenModalTag(!openModalTag)
  }
  const handleCloseModalTag = () => {
    setOpenModalTag(!openModalTag)
  }
  const handleOpenModalPresenter = () => {
    setOpenModalPresenter(!openModalPresenter)
  }
  const handleCloseModalPresenter = () => {
    setOpenModalPresenter(!openModalPresenter)
  }
  const handleOpenNotesType = () => {
    setOpenModalNotesType(!openModalNotesType)
  }
  const handleCloseNotesType = () => {
    setOpenModalNotesType(!openModalNotesType)
  }
  const handleOpenNotesCustomers = () => {
    setOpenModalNotesCustomers(!openModalNotesCustomers)
  }
  const handleCloseNotesCustomers = () => {
    setOpenModalNotesCustomers(!openModalNotesCustomers)
  }

  const handleDocScan = () => {
    if (!window.scanner) {
      dataSnack({
        open: true,
        text: "Scanner não disponível neste dispositivo",
        severity: "error",
        type: "file"
      });
      return;
    }

    setIsScanning(true);

    window.scanner.scan(
      (successful, mesg, response) => {
        setIsScanning(false);

        if (!successful) {
          console.error('Failed: ' + mesg);
          dataSnack({
            open: true,
            text: "Erro ao escanear: " + mesg,
            severity: "error",
            type: "file"
          });
          return;
        }

        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
          console.info('User cancelled');
          dataSnack({
            open: true,
            text: "Escaneamento cancelado pelo usuário",
            severity: "info",
            type: "file"
          });
          return;
        }

        try {
          const responseJson = JSON.parse(response);
          const scannedPdfUrl = responseJson.output[0].result[0];
          
          setFormData(prevData => ({
            ...prevData,
            file_url: scannedPdfUrl
          }));

          setFileInfo({
            name: 'Documento Escaneado.pdf',
            size: 'Escaneado',
            type: 'application/pdf'
          });
          setFileSource('scanner');

          dataSnack({
            open: true,
            text: "Documento escaneado com sucesso!",
            severity: "success",
            type: "file"
          });
        } catch (error) {
          console.error('Error parsing scanner response:', error);
          dataSnack({
            open: true,
            text: "Erro ao processar documento escaneado",
            severity: "error",
            type: "file"
          });
        }
      },
      {
        "output_settings": [
          {
            "type": "return-base64",
            "format": "pdf",
            "pdf_text_line": "Escaneado em ${DATETIME}"
          }
        ],
        "use_asprise_dialog": true,
        "show_scanner_ui": true,
        "twain_cap_setting": {
          "ICAP_PIXELTYPE": "TWPT_RGB",
          "ICAP_SUPPORTEDSIZES": "TWSS_A4"
        }
      }
    );
  };

  const handleRemoveFile = () => {
    setFormData(prevData => ({
      ...prevData,
      file_url: ""
    }));
    setFileInfo(null);
    setFileSource(null);
    
    // Limpar input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    dataSnack({
      open: true,
      text: "Arquivo removido",
      severity: "info",
      type: "file"
    });
  };

  const handleCreateNotes = async () => {
    // Validações
    if (!formData.file_url) {
      dataSnack({
        open: true,
        text: "Por favor, adicione um arquivo PDF (upload ou scanner)",
        severity: "error",
        type: "file"
      });
      return;
    }

    if (!formData.order_num || !formData.tag || !formData.presenter || !formData.service_type) {
      dataSnack({
        open: true,
        text: "Por favor, preencha todos os campos obrigatórios",
        severity: "error",
        type: "file"
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        serviceName: valueNotesType?.name || ""
      }

      const allData = await noteSv.createNotes(payload)
      console.log(allData)
      dataSnack({
        open: true,
        text: "Nota cadastrada com sucesso!",
        severity: "success",
        type: "file"
      })
      
      getData()
      onClose()
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      
      return allData
    } catch (error) {
      dataSnack({
        open: true,
        text: error?.msg || "Erro ao criar nota",
        severity: "error",
        type: "file"
      })
      console.error("Erro ao criar nota!", error)
      throw error;
    }
  }

  return (
    <Box sx={{
      width: { lg: 420, md: 390, sm: 350, xs: 320 },
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      overflow: "hidden",
      px: 1
    }} >
      <BoxSearchTitle>
        <Typography sx={{ fontSize: "clamp(1.3rem, 1rem, 1.7rem)" }}>
          Cadastro - Notas Escrituras
        </Typography>
        <ButtonClose onClick={onClose} >
          <CloseIcon sx={{ fill: '#000000bc', width: '30px ', height: '30px' }} />
        </ButtonClose>
      </BoxSearchTitle>

      <Box sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: '30px',
        height: "100vh",
        overflowY: "auto",
        py: 2,
        px: 1,
      }} ref={boxInputsRef}>
        <TextField
          color="success" 
          label="Ordem *"
          name="order_num"
          type="number"
          value={formData.order_num}
          onChange={handleChangeFile}
          required
        />

        <Autocomplete
          value={valueTag}
          options={tag}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            handleAutocompleteChange("tag", newValue?.id || 0)
            setValueTag(newValue)
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTag} title="Cadastrar Tag" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag *"
              name="tag"
              color="success"
              required
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
        />

        <Autocomplete
          value={valuePresenter}
          options={presenter}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            setFormData({ ...formData, presenter: newValue?.cpfcnpj || '' })
            setValuePresenter(newValue)
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title="Cadastrar Apresentante" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Apresentante *"
              color="success"
              name="presenter"
              required
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
        />

        <Autocomplete
          value={valueNotesType}
          options={notesType}
          getOptionLabel={(option) => option.name || ''}
          onChange={(e, newValue) => setValueNotesType(newValue)}
          noOptionsText={<RenderNoOptions onClick={handleOpenGroup} title={"Cadastrar Grupo"} />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Grupo *"
              name="group"
              color="success"
              required
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
        />

        {valueNotesType && (
          <Autocomplete
            value={option}
            onChange={(event, newValue) => {
              setOption(newValue)
              setFormData((prev) => ({ ...prev, service_type: newValue?.id || 0 }))
            }}
            options={typesGroup.filter(item => item.group_id === valueNotesType.id)}
            getOptionLabel={(opcao) => opcao.name || ''}
            fullWidth
            noOptionsText={<RenderNoOptions onClick={handleOpenNotesType}
              title={`Cadastrar Tipo de ${valueNotesType.name}`}
            />}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label={`Tipo de ${valueNotesType.name} *`} 
                color="success" 
                variant="outlined"
                required
              />
            )}
          />
        )}

        <TextField
          label="Livro *"
          type="number"
          color="success"
          name="book"
          value={formData.book}
          onChange={handleChangeFile}
          required
        />

        <TextField
          label="Folha Inicial *"
          type="number"
          color="success"
          value={formData.initial_sheet}
          onChange={handleChangeFile}
          name="initial_sheet"
          required
        />

        <TextField
          label="Folha Final *"
          type="number"
          onChange={handleChangeFile}
          color="success"
          value={formData.final_sheet}
          name="final_sheet"
          required
        />

        {outorgantes.map((outorgante, index) => (
          <Box key={`outorgante-${index}-${outorgantes.length}`} >
            <Autocomplete
              value={valueOutorgante[index] || null}
              options={outorganteArray}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option?.cpfcnpj === value?.cpfcnpj}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgante'} onClick={handleOpenNotesCustomers} />}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgante];
                updatedValues[index] = value; // Armazena o objeto completo
                setValueOutorgante(updatedValues);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgantes"
                  color="success"
                  name="grantors"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.cpfcnpj}>
                  {option.name}
                </li>
              )}
            />
            <Box sx={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <IconButton
                type="button"
                sx={{
                  width: 30,
                  height: 30,
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer',
                  '&:hover': {
                    background: "#1a5a11"
                  }
                }}
                onClick={(e) => adicionarInput("outorgante", e)}
              >
                +
              </IconButton>
              <IconButton
                type="button"
                disabled={outorgantes.length === 1}
                sx={{
                  width: 30,
                  height: 30,
                  background: outorgantes.length === 1 ? "#cccccc" : "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: outorgantes.length === 1 ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    background: outorgantes.length === 1 ? "#cccccc" : "#1a5a11"
                  }
                }}
                onClick={() => removerInput("outorgante", index)}
              >
                -
              </IconButton>
            </Box>
          </Box>
        ))}

        {outorgados.map((outorgado, index) => (
          <Box key={`outorgado-${index}-${outorgados.length}`}>
            <Autocomplete
              value={valueOutorgado[index] || null}
              options={outorgadoArray}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option?.cpfcnpj === value?.cpfcnpj}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgado];
                updatedValues[index] = value; // Armazena o objeto completo
                setValueOutorgado(updatedValues);
              }}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgado'} onClick={handleOpenNotesCustomers} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgados"
                  color="success"
                  name="granteds"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.cpfcnpj}>
                  {option.name}
                </li>
              )}
            />
            <Box sx={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <IconButton
                type="button"
                sx={{
                  width: 30,
                  height: 30,
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer',
                  '&:hover': {
                    background: "#1a5a11"
                  }
                }}
                onClick={(e) => adicionarInput("outorgado", e)}
              >
                +
              </IconButton>
              <IconButton
                type="button"
                disabled={outorgados.length === 1}
                sx={{
                  width: 30,
                  height: 30,
                  background: outorgados.length === 1 ? "#cccccc" : "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: outorgados.length === 1 ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    background: outorgados.length === 1 ? "#cccccc" : "#1a5a11"
                  }
                }}
                onClick={() => removerInput("outorgado", index)}
              >
                -
              </IconButton>
            </Box>
          </Box>
        ))}

        <TextField
          value={formData.box}
          onChange={handleChangeFile}
          name="box"
          label="Caixa"
          color="success"
          type="number"
        />

        {/* Seção de Upload/Scanner */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
            Documento (PDF) *
          </Typography>

          {/* Informação do arquivo carregado */}
          {fileInfo && (
            <FileInfoBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '24px' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {fileInfo.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '10px', mt: 0.5 }}>
                    <Chip 
                      label={fileSource === 'scanner' ? 'Escaneado' : 'Upload'} 
                      size="small" 
                      color={fileSource === 'scanner' ? 'warning' : 'primary'}
                      sx={{ height: '20px', fontSize: '11px' }}
                    />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {fileInfo.size}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <IconButton 
                onClick={handleRemoveFile}
                size="small"
                sx={{ 
                  color: '#d32f2f',
                  '&:hover': {
                    background: '#ffebee'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </FileInfoBox>
          )}

          {/* Botões de Scanner e Upload */}
          {!fileInfo && (
            <Stack direction="row" spacing={2}>
              <ButtonScanner 
                onClick={handleDocScan} 
                disabled={isScanning || isUploading}
              >
                {isScanning ? (
                  <>
                    <CircularProgress size={18} sx={{ color: '#FED70B' }} />
                    <span>Escaneando...</span>
                  </>
                ) : (
                  <>
                    <ScannerIcon />
                    <span>Escanear</span>
                  </>
                )}
              </ButtonScanner>

              <ButtonUpload disabled={isScanning || isUploading}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleSelectedFile}
                  style={{ display: 'none' }}
                  disabled={isScanning || isUploading}
                />
                {isUploading ? (
                  <>
                    <CircularProgress size={18} sx={{ color: '#247117' }} />
                    <span>Carregando...</span>
                  </>
                ) : (
                  <>
                    <UploadFileIcon />
                    <span>Upload</span>
                  </>
                )}
              </ButtonUpload>
            </Stack>
          )}

          {!fileInfo && (
            <Alert severity="info" sx={{ fontSize: '12px' }}>
              Selecione um arquivo PDF ou use o scanner para digitalizar um documento
            </Alert>
          )}
        </Box>

        <ButtonCadastrar 
          onClick={handleCreateNotes}
          disabled={!formData.file_url || isScanning || isUploading}
        >
          {isScanning || isUploading ? 'Aguarde...' : 'Cadastrar'}
        </ButtonCadastrar>
      </Box>

      <ModalNotesTag open={openModalTag} onClose={handleCloseModalTag} getData={getAllNotesTag} />
      <CadastroPartes onClose={handleCloseModalPresenter} open={openModalPresenter} getAllPartes={getCustomersPresenter} />
      <CadastroNotesType open={openModalNotesType} onClose={handleCloseNotesType} getData={getTypeAndGroup} />
      <CadastroNotesCurtomers getData={getCustumers} open={openModalNotesCustomers} onClose={handleCloseNotesCustomers} />
      <ModalNotesGroup getData={getTypeAndGroup} onClose={handleCloseGroup} open={openModalGroup} />
    </Box>
  );
};