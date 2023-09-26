"use client"
import React from 'react';
import { Container } from '@mui/material';
import { Header } from '../Components/Header/Header';
// import {Main} from '../Components/Main/Main';
import {Sidebar} from '../Components/SideBar/Sidebar';
import {Main} from '../Components/Main/Main';
import Grid from '@mui/material/Grid';

export default function Home() {
  return (
      <Container >
        <Header />
        <Sidebar />
        <Main />
      </Container>
  );
}