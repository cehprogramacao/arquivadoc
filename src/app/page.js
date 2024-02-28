"use client"
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@/Components/Search/Search";
import { DocList } from "@/Components/List/DocList";
import { Buttons } from "@/Components/Button/Button";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import ModalList from "@/Components/Modals/ModalList";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";
import CustomContainer from "@/Components/CustomContainer";

const Home = () => {
  const theme = useTheme();
  const router = useRouter()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreenWrap = useMediaQuery(theme.breakpoints.down("lg"));

  const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false);
  const [list, setList] = useState([]);
  const [temp, setTemp] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3004/");
      if (response.ok) {
        const data = await response.json();
        setList(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModalListFilePDF = (index) => {
    setTemp(index);
    setOpenModalListFilePDF(true);
  };

  const handleCloseModalListFilePDF = () => {
    setOpenModalListFilePDF(false);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("login")
    }
    else {
      fetchData();
    }
  }, []);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        placeContent: "center",
        flexDirection: "column",
        gap: "20px",
        py: 15,
        px: 3
      }}
    >
      <CustomContainer >
        <Grid container spacing={3} alignItems={"center"} justifyContent={"center"}>
          <Grid item xs={12} >
            <Grid container spacing={4}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Buscar"
                  sx={{
                    "& input": { color: "success.main" },
                  }}
                  fullWidth
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={["CPF", "CNPJ"]}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      color="success"
                      {...params}
                      label="Buscar Por"
                      sx={{
                        color: "#237117",
                        "& input": {
                          color: "success.main",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Box sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <Buttons
                    color={"green"}
                    title={"Buscar"}
                    onClick={() => alert("Oiii")}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Grid container >
              <Grid item xs={12} >
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "1.3rem",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Recentes
                </Typography>
              </Grid>
              <Grid item xs={12} >
                <Typography
                  sx={{
                    fontSize: "1.3rem",
                    color: "#C2C2C2",
                  }}>
                  More than {list.length} new members
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <DocList data={list} onClick={handleOpenModalListFilePDF} />
          </Grid>
        </Grid>
      </CustomContainer>
      <ModalList
        data={list}
        link={list[temp]?.data}
        onClose={handleCloseModalListFilePDF}
        open={openModalListFilePDF}
      />
    </Box>
  );
};
export default Home;
