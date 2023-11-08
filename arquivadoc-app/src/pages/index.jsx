"use client"

import { Main } from '@/pages/home';
import React from 'react';
import Box from '@mui/material/Box';
import Header from '@/Components/Header/Header'

import { PageRGI } from './rgi';

export default function Home() {
  return (
      <Box>
        <Header />
        <PageRGI />
      </Box>
  );
}