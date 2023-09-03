import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { Container, CssBaseline, createTheme } from '@mui/material';
import { Header } from '../Header/Header';

export const Layout = ({ children }: any) => {
  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header />
          <main>{children}</main>
        </Container>
      </ThemeProvider>
    </>
  );
};
