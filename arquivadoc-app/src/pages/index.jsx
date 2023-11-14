"use client"


import React from 'react';
import Box from '@mui/material/Box';
import Header from '@/Components/Header/Header'
import { PageHome } from './home';



export default function Home() {


  return (
    <Box>
      <Header />
      <PageHome />
      
    </Box>
  );
}