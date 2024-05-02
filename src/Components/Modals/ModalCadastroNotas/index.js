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
  Grid
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import { ModalNotesTag } from "@/Components/ModalsRegistration/ModalNotesTag";
import CloseIcon from '@mui/icons-material/Close';
import CadastroNotesType from "@/Components/ModalsRegistration/ModalNotesTypes";
import CadastroNotesCurtomers from "@/Components/ModalsRegistration/ModalNotesCustomers";
import NoteService from "@/services/notes.service";
import Customer from "@/services/customer.service";
import { ModalNotesGroup } from "@/Components/ModalsRegistration/ModalNotesGroup";
import { CloseOutlined } from "@mui/icons-material";
import { useAuth } from "@/context";
import { showAlert } from "@/store/actions";
import { useDispatch } from "react-redux";



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

const ButtonScanner = styled("button")({
  width: "max-content",
  background: 'transparent',
  padding: '10px 20px',
  color: '#FED70B',
  borderRadius: "7px",
  border: '1px solid #FED70B',
  cursor: 'pointer',
  ":hover": {
    background: '#FED70B',
    border: '1px solid #FED70B',
    color: '#fff'
  }
});


const ButtonCadastrar = styled("button")({
  width: "max-content",
  background: '#237117',
  padding: '10px 45px',
  color: '#fff',
  borderRadius: "7px",
  border: 'none',
  cursor: 'pointer',
  ":hover": {
    background: 'transparent',
    border: '1px solid #237171',
    color: '#237117'
  }
});

export const CadastroNotas = ({ onClose, getData, dataSnack }) => {
  const dispatch = useDispatch()
  const [outorgantes, setOutorgantes] = useState([""]);
  const [outorgados, setOutorgados] = useState([""]);
  const { permissions } = useAuth()
  const [valuePresenter, setValuePresenter] = useState(null)
  const [valueTag, setValueTag] = useState(null)
  const [valueOutorgante, setValueOutorgante] = useState(Array(outorgantes.length).fill(''));
  const [valueOutorgado, setValueOutorgado] = useState(Array(outorgados.length).fill(''));
  const [formData, setFormData] = useState({
    order_num: 0,
    tag: null,
    presenter: null,
    service_type: null,
    book: 0,
    initial_sheet: 0,
    final_sheet: 0,
    box: 0,
    grantors: [],
    granteds: [],
    file_url: ""
  });
  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const fileResult = fileReader.result.split(",")[1]
        setFormData((prevFormData) => ({ ...prevFormData, file_url: fileResult }));
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
    const { customers } = new Customer()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const allData = await customers(accessToken)
      setOutorganteArray(Object.values(allData.data))
      setOutorgadoArray(Object.values(allData.data))

      return allData.data
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
      setValueOutorgante((prev) => [...prev, ""]);
    } else if (tipo === "outorgado") {
      setOutorgados((prev) => [...prev, ""]);
      setValueOutorgado((prev) => [...prev, ""]);
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
      grantors: valueOutorgante.filter(Boolean),
      granteds: valueOutorgado.filter(Boolean),
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
    const { getAllNoteTags } = new NoteService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const allTags = await getAllNoteTags(accessToken)
      setTag(Object.values(allTags.data))
      return allTags.data
    } catch (error) {
      console.error("Error list of tags", error)
      throw error;
    }
  }

  const getCustomersPresenter = async () => {
    const customer = new Customer();
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const allPresenter = await customer.customers(accessToken);
      const newData = Object.values(allPresenter.data);
      setPresenter(newData);
      return allPresenter.data;
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
    const { getAllNoteGroups, getAllNoteTypes } = new NoteService();
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const groups = await getAllNoteGroups(accessToken);
      const types = await getAllNoteTypes(accessToken);
      setNotesType(Object.values(groups.data))
      setTypesGroup(Object.values(types.data))
      return groups.data && types.data
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

  const handleCreateNotes = async () => {
    const { createNotes } = new NoteService()
    console.log(formData)
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const allData = await createNotes(formData, accessToken)
      console.log(allData.data)
      dispatch(showAlert(allData.data.message, "success", "file"))
      return allData.data
    } catch (error) {
      dispatch(showAlert(error.msg, "error", "file"))
      console.error("Erro ao criar nota!", error)
      throw error;
    }
    finally {
      getData()
      onClose()
    }
  }


  const handleDeleteTagById = async (tagId) => {
    const { deleteNoteTag } = new NoteService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await deleteNoteTag(tagId, accessToken)
    } catch (error) {
      console.error("Erro ao deletar tag", error)
      throw error;
    }
    finally {
      getAllNotesTag()
    }
  }

  const handleDeletePresenterById = async (presenterId) => {
    const { deleteCustomer } = new Customer()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await deleteCustomer(presenterId, accessToken)
    } catch (error) {
      console.error("Erro ao deletar apresentante", error)
      throw error;
    }
    finally {
      getCustomersPresenter()
    }
  }

  const handleDeleteGroupNoteById = async (groupId) => {
    const { deleteNoteGroup } = new NoteService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await deleteNoteGroup(groupId, accessToken)
    } catch (error) {
      console.error("Erro ao deletar grupo de notas!", error)
      throw error;
    }
    finally {
      getTypeAndGroup()
    }
  }
  const handleDeleteTypeNoteById = async (typeId) => {
    const { deleteNoteType } = new NoteService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await deleteNoteType(typeId, accessToken)
    } catch (error) {
      console.error("Erro ao deletar tipo de notas!", error)
      throw error;
    }
    finally {
      getTypeAndGroup()
    }
  }

  const updateDataWithUrl = (fieldToUpdate, scannedPdfUrl) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldToUpdate]: scannedPdfUrl
    }));
  };
  const handleScanFile = () => {
    window.scanner.scan((successful, mesg, response) => {
      if (!successful) {
        console.error('Failed: ' + mesg);
        return;
      }
      if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
        console.info('User cancelled');
        return;
      }
      const responseJson = JSON.parse(response);
      const scannedPdfUrl = responseJson.output[0].result[0];
      updateDataWithUrl('file_url', scannedPdfUrl);
    }, {
      "output_settings": [
        {
          "type": "return-base64",
          "format": "pdf",
          "pdf_text_line": "By ${USERNAME} on ${DATETIME}"
        },
        {
          "type": "return-base64-thumbnail",
          "format": "jpg",
          "thumbnail_height": 200
        }
      ]
    });
  };

  useEffect(() => {
    if (window.scanner) {
      window.scanner.scanDisplayImagesOnPage = (successful, mesg, response) => {
        if (!successful) {
          console.error('Failed: ' + mesg);
          return;
        }
        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
          console.info('User cancelled');
          return;
        }
      };
    }
  }, []);



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
          color="success" label="Ordem"
          name="order_num"
          value={formData.order_num}
          onChange={handleChangeFile}
        />
        <Autocomplete
          value={valueTag}
          options={tag}
          isOptionEqualToValue={(option, label) => option.name === label.name}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            handleAutocompleteChange("tag", newValue.id)
            setValueTag(newValue)
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTag} title="Cadastrar Tag" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag"
              name="tag"
              color="success"
            />
          )}
          renderOption={(props, option) => (
            <Box
              {...props}
              key={option.id}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Grid container alignItems={"center"} justifyContent="space-between" >
                <Grid item xs={10} lg={10} md={10} sm={10}>
                  <Typography >
                    {option.name}
                  </Typography>
                </Grid>
                {permissions[6]?.delete_permission === 1 && (
                  <Grid item xs={2} lg={2} md={2} sm={2}>
                    <Box sx={{
                      width: "100%",
                      display: 'flex',
                      justifyContent: "flex-end"
                    }}>
                      <IconButton onClick={() => handleDeleteTagById(option.id)}>
                        <CloseOutlined sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>

            </Box>
          )}
        />

        <Autocomplete
          value={valuePresenter}
          options={presenter}
          isOptionEqualToValue={(option, label) => option.name === label.name}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => {
            setFormData({ ...formData, presenter: newValue.cpfcnpj || null })
            setValuePresenter(newValue)
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title="Cadastrar Apresentante" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Apresentante"
              color="success"
              name="presenter"
            />
          )}
          renderOption={(props, option) => (
            <Box
              {...props}
              key={option.cpfcnpj}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Grid container alignItems={"center"} justifyContent="space-between" >
                <Grid item xs={10} lg={10} md={10} sm={10}>
                  <Typography >
                    {option.name}
                  </Typography>
                </Grid>
                {permissions[5]?.delete_permission === 1 && (
                  <Grid item xs={2} lg={2} md={2} sm={2}>
                    <Box sx={{
                      width: "100%",
                      display: 'flex',
                      justifyContent: "flex-end"
                    }}>
                      <IconButton onClick={() => handleDeletePresenterById(option.cpfcnpj)}>
                        <CloseOutlined sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>

            </Box>
          )}
        />

        <Autocomplete
          // value={formData.service_type}
          options={notesType}
          isOptionEqualToValue={(option, label) => option.name === label.name}
          getOptionLabel={(option) => option.name || ''}
          onChange={(e, newValue) => setValueNotesType(newValue)}
          noOptionsText={<RenderNoOptions onClick={handleOpenGroup} title={"Cadastrar Grupo"} />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo"
              name="service_type"
              color="success"
            />
          )}
          renderOption={(props, option) => (
            <Box
              {...props}
              key={option.id}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Grid container alignItems={"center"} justifyContent="space-between" >
                <Grid item xs={10} lg={10} md={10} sm={10}>
                  <Typography >
                    {option.name}
                  </Typography>
                </Grid>
                {permissions[6]?.delete_permission === 1 && (
                  <Grid item xs={2} lg={2} md={2} sm={2}>
                    <Box sx={{
                      width: "100%",
                      display: 'flex',
                      justifyContent: "flex-end"
                    }}>
                      <IconButton onClick={() => handleDeleteGroupNoteById(option.id)}>
                        <CloseOutlined sx={{ width: 20, height: 20 }} />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>

            </Box>
          )}
        />

        {valueNotesType && (
          <Autocomplete
            value={option}
            onChange={(event, newValue) => {
              setOption(newValue)
              setFormData((prev) => ({ ...prev, service_type: newValue.id }))
            }}
            isOptionEqualToValue={(option, label) => option.name === label.name}
            options={typesGroup.filter(item => item.id === valueNotesType.id)} // Assegurar que as opções sejam baseadas na seleção de valueNotesType
            getOptionLabel={(opcao) => opcao.name || ''} // Como opcao é uma string, apenas a retornamos
            fullWidth
            noOptionsText={<RenderNoOptions onClick={handleOpenNotesType}
              title={`Cadastrar Tipo de ${valueNotesType.name}`}
            />}
            renderInput={(params) => (
              <TextField {...params} label={`Selecione o tipo de ${valueNotesType.name}`} color="success" variant="outlined" />
            )}
            renderOption={(props, option) => (
              <Box
                {...props}
                key={option.id}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Grid container alignItems={"center"} justifyContent="space-between" >
                  <Grid item xs={10} lg={10} md={10} sm={10}>
                    <Typography >
                      {option.name}
                    </Typography>
                  </Grid>
                  {permissions[6]?.delete_permission === 1 && (
                    <Grid item xs={2} lg={2} md={2} sm={2}>
                      <Box sx={{
                        width: "100%",
                        display: 'flex',
                        justifyContent: "flex-end"
                      }}>
                        <IconButton onClick={() => handleDeleteTypeNoteById(option.id)}>
                          <CloseOutlined sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>

              </Box>
            )}
          />
        )}
        <TextField
          label="Livro"
          type="number"
          color="success"
          name="book"
          value={formData.book}
          onChange={handleChangeFile}
        />
        <TextField
          label="Folha Inicial"
          type="number"
          color="success"
          value={formData.initial_sheet}
          onChange={handleChangeFile}
          name="initial_sheet"

        />
        <TextField
          label="Folha Final"
          type="number"
          onChange={handleChangeFile}
          color="success"
          value={formData.final_sheet}
          name="final_sheet"
        />
        {outorgantes.map((outorgante, index) => (
          <Box key={index} >
            <Autocomplete
              // value={valueOutorgante[index]}
              options={outorganteArray}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgante'} onClick={handleOpenNotesCustomers} />}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgante];
                updatedValues[index] = value ? value.cpfcnpj : ''; // Ensure value is a valid object
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
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgante", e)}
              >
                +
              </IconButton>
              <IconButton
                type="button"
                sx={{
                  width: 30,
                  height: 30,
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => removerInput("outorgante", index)}
              >
                -
              </IconButton>
            </Box>
          </Box>
        ))}

        {outorgados.map((outorgado, index) => (
          <Box key={index}>
            <Autocomplete
              // value={valueOutorgado[index]}
              options={outorgadoArray}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgante];
                updatedValues[index] = value ? value.cpfcnpj : ''; // Ensure value is a valid object
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
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgado", e)}
              >
                +
              </IconButton>
              <IconButton
                type="button"
                sx={{
                  width: 30,
                  height: 30,
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
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
        <TextField type="file" onChange={handleSelectedFile} color="success" />
        <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <ButtonScanner onClick={handleScanFile}>
            Scannear Arquivo
          </ButtonScanner>
          <ButtonCadastrar onClick={handleCreateNotes}>
            Cadastrar
          </ButtonCadastrar>

        </Stack>

      </Box>
      <ModalNotesTag open={openModalTag} onClose={handleCloseModalTag} getData={getAllNotesTag} />
      <CadastroPartes onClose={handleCloseModalPresenter} open={openModalPresenter} />
      <CadastroNotesType open={openModalNotesType} onClose={handleCloseNotesType} getData={getTypeAndGroup} />
      <CadastroNotesCurtomers getData={getCustumers} open={openModalNotesCustomers} onClose={handleCloseNotesCustomers} />
      <ModalNotesGroup getData={getTypeAndGroup} onClose={handleCloseGroup} open={openModalGroup} />
    </Box >
  );
};
