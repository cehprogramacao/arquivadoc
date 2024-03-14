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
  IconButton
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

const BoxInputs = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: '30px',
  height: "100vh",
  overflowY: "auto",
  padding: "5px 8px",
});













export const CadastroNotas = ({ onClose }) => {
  const [outorgantes, setOutorgantes] = useState([""]);
  const [outorgados, setOutorgados] = useState([""]);
  const [valuePresenter,setValuePresenter] = useState("")
  const [valueTag, setValueTag] = useState("")
  const [valueOutorgante, setValueOutorgante] = useState(Array(outorgantes.length).fill(''));
  const [valueOutorgado, setValueOutorgado] = useState(Array(outorgados.length).fill(''));
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
      console.log(allData.data)
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
      setValueOutorgante((prev) => [...prev, null]);
    } else if (tipo === "outorgado") {
      setOutorgados((prev) => [...prev, ""]);
      setValueOutorgado((prev) => [...prev, null]);
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
      console.log(allTags.data, '99999999999')
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
      console.log(allPresenter.data);
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
      console.log(groups.data, types.data, '88888')
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
      return allData.data
    } catch (error) {
      console.error("Erro ao criar nota!", error)
      throw error;
    }
  }
  return (
    <Box sx={{
      width: { lg: 420, md: 390, sm: 350, xs: 320 },
      height: "100vh",
      padding: "8px 10px",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      overflow: "hidden",
    }} >
      <BoxSearchTitle>
        <Typography sx={{ fontSize: "clamp(1.3rem, 1rem, 1.7rem)" }}>
          Cadastro - Notas Escrituras
        </Typography>
        <ButtonClose onClick={onClose} >
          <CloseIcon sx={{ fill: '#000000bc', width: '30px ', height: '30px' }} />
        </ButtonClose>
      </BoxSearchTitle>
      <BoxInputs ref={boxInputsRef}>
        <TextField
          color="success" label="Ordem"
          name="order_num"
          value={formData.order_num}
          onChange={handleChangeFile}
        />
        <Autocomplete
          value={valueTag}
          options={tag}
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
            setFormData({ ...formData, presenter: newValue.cpfcnpj })
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
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
        />

        <Autocomplete
          // value={formData.service_type}
          options={notesType}
          getOptionLabel={(option) => option.name || ''}
          onChange={(e, newValue) => setValueNotesType(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo"
              name="service_type"
              color="success"
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
              setFormData((prev) => ({...prev, service_type: newValue.id}))
            }}
            options={typesGroup.filter(item => item.id === valueNotesType.id)} // Assegurar que as opções sejam baseadas na seleção de valueNotesType
            getOptionLabel={(opcao) => opcao.name || ''} // Como opcao é uma string, apenas a retornamos
            fullWidth
            noOptionsText={<RenderNoOptions onClick={handleOpenNotesType}
              title={`Cadastrar Tipo de ${valueNotesType.name}`}
            />}
            renderInput={(params) => (
              <TextField {...params} label={`Selecione o tipo de ${valueNotesType.name}`} color="success" variant="outlined" />
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
          <Box key={`outorgante-${index}-${outorgantes.length}`} >
            <Autocomplete
              value={valueOutorgante[outorgante[index]]}
              options={outorganteArray}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgante'} onClick={handleOpenNotesCustomers} />}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgante];
                updatedValues[index] = value ? value.cpfcnpj  : ''; // Ensure value is a valid object
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
          <Box key={`outorgado-${index}-${outorgados.length}`}>
            <Autocomplete
              value={valueOutorgado[outorgado[index]]}
              options={outorgadoArray}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                const updatedValues = [...valueOutorgante];
                updatedValues[index] = value ? value.cpfcnpj  : ''; // Ensure value is a valid object
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
          <ButtonScanner>
            Scannear Arquivo
          </ButtonScanner>
          <ButtonCadastrar onClick={handleCreateNotes}>
            Cadastrar
          </ButtonCadastrar>

        </Stack>

      </BoxInputs>
      <ModalNotesTag open={openModalTag} onClose={handleCloseModalTag} />
      <CadastroPartes onClose={handleCloseModalPresenter} open={openModalPresenter} />
      <CadastroNotesType open={openModalNotesType} onClose={handleCloseNotesType} />
      <CadastroNotesCurtomers getData={getCustumers} open={openModalNotesCustomers} onClose={handleCloseNotesCustomers} />
    </Box >
  );
};
