import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

export function Register() {
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const handleSubmit = async ({ email, password, username }: any) => {
    try {
      const resp = await authService.register({ email, password, username });
      setError(null);
      nav('/login');
    } catch (error: any) {
      if (error?.response?.data) {
        setError(error.response.data);
        return;
      }
      setError('Registracija neuspjela, pokušajte ponovno.');
    }
  };

  return (
    <>
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="start"
        height="100vh"
      >
        <Paper elevation={3} style={{ padding: '20px', width: 550 }}>
          <Formik
            initialValues={{ email: '', password: '', username: '' }}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ paddingBottom: '20px' }}
                >
                  Registriraj se
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="email"
                      label="E-mail"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="username"
                      label="Korisničko ime"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      type="password"
                      name="password"
                      label="Lozinka"
                      fullWidth
                      required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                      Registracija
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </>
  );
}
