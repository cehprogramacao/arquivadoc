"use client"
import React from 'react';
import { Container } from '@mui/material';
import { Header } from '../Components/Header/Header';
// import {Main} from '../Components/Main/Main';
import {Sidebar} from '../Components/SideBar/Sidebar';
import Main from '../Components/Main/Main';
import Grid from '@mui/material/Grid';

export default function Home() {
  return (
    <React.Fragment>
      <Container style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        <div style={{
          background: 'red',
          display: 'flex',
          flexDirection: 'row',
          gap: '0',
        }}>
        <Sidebar/>
        <Main />
        </div>
      </Container>

    </React.Fragment>
  );
}