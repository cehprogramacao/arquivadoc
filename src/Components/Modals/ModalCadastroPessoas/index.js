import Loading from "@/Components/loading";
import Customer from "@/services/customer.service";
import { CloseOutlined } from "@mui/icons-material";
import {
  useMediaQuery,
  useTheme,
  TextField,
  Typography,
  Button,
  Autocomplete,
  FormControl,
  FormHelperText,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReactInputMask from "react-input-mask";

const cpfMask = "999.999.999-99";
const cnpjMask = "99.999.999/9999-99";
const customer = new Customer();

const opt = [
  { id: 1, label: "Física" },
  { id: 2, label: "Jurídica" },
];

export const CadastroPessoas = ({ onClose }) => {
  const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const initialValues = {
    name: "",
    type: "",
    cpfcnpj: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Nome é obrigatório";
    if (!values.type) errors.type = "Tipo é obrigatório";
    if (!values.cpfcnpj || values.cpfcnpj.length < 11)
      errors.cpfcnpj = "CPF/CNPJ inválido";
    return errors;
  };

  const handleCpfCnpjChange = (e, setFieldValue) => {
    const onlyDigits = e.target.value?.replace(/\D/g, "");
    setCpfCnpjMask(onlyDigits.length < 11 ? cpfMask : cnpjMask);
    setFieldValue("cpfcnpj", onlyDigits);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await customer.createCustomer(values);
      console.log(response);
      onClose();
    } catch (error) {
      console.error("Erro ao criar cliente:", error.message);
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form
          style={{
            width: isSmallScreen ? 320 : 440,
            height: "100vh",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  lg: "1.4rem",
                  md: "1.4rem",
                  sm: "1.2rem",
                  xs: "1rem",
                },
              }}
            >
              Cadastro - Pessoas
            </Typography>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </div>

          {/* Nome */}
          <Field
            as={TextField}
            fullWidth
            name="name"
            label="Nome completo"
            color="success"
            sx={{
              "& input": { color: "success.main" },
            }}
            error={touched.name && Boolean(errors.name)}
            helperText={<ErrorMessage name="name" />}
          />

          {/* Tipo */}
          <Autocomplete
            disablePortal
            options={opt}
            fullWidth
            value={opt.find((opt) => opt.label === values.type) || null}
            onChange={(e, value) =>
              setFieldValue("type", value ? value.label : "")
            }
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            renderInput={(params) => (
              <TextField
                {...params}
                name="type"
                label="Tipo de pessoa"
                color="success"
                error={touched.type && Boolean(errors.type)}
                helperText={<ErrorMessage name="type" />}
              />
            )}
          />

          {/* CPF/CNPJ */}
          <FormControl fullWidth error={Boolean(touched.cpfcnpj && errors.cpfcnpj)}>
            <ReactInputMask
              mask={cpfCnpjMask}
              value={values.cpfcnpj}
              onChange={(e) => handleCpfCnpjChange(e, setFieldValue)}
              onBlur={() => {
                if (values.cpfcnpj?.replace(/\D/g, "").length === 11) {
                  setCpfCnpjMask(cpfMask);
                }
              }}
            >
              {(inputProps) => (
                <OutlinedInput
                  {...inputProps}
                  id="cpfcnpj"
                  name="cpfcnpj"
                  label="CPF/CNPJ"
                  sx={{
                    borderRadius: "12.5px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "4px",
                    },
                  }}
                />
              )}
            </ReactInputMask>
            {touched.cpfcnpj && (
              <FormHelperText>{errors.cpfcnpj}</FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            sx={{
              display: "flex",
              width: "max-content",
              background: "#237117",
              color: "#fff",
              border: "1px solid #237117",
              textTransform: "capitalize",
              fontSize: ".9rem",
              borderRadius: "5px",
              ":hover": {
                background: "transparent",
                color: "#237117",
              },
            }}
          >
            Realizar Cadastro
          </Button>
        </Form>
      )}
    </Formik>
  );
};
