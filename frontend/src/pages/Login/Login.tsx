import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContextProvider';
import { authService } from '../../services';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const userContext = useContext(UserContext);

  const handleLoginSubmit = async ({ email, password }: any) => {
    try {
      const resp = await authService.login({ email, password });
      setError(null);
      userContext.authenticate(resp.data.token);
      nav('/');
    } catch (error) {
      console.error(error);
      setError('Neispravni podaci prijave, pokusajte ponovno.');
    }
  };

  return (
    <Box
      p={2}
      display="flex"
      justifyContent="center"
      alignItems="start"
      height="100vh"
    >
      <Paper elevation={3} style={{ padding: '20px', width: 550 }}>
        <Formik
          initialValues={{ email: 'admin@fer.hr', password: 'admin123' }}
          onSubmit={handleLoginSubmit}
        >
          {() => (
            <Form>
              <Typography
                variant="h5"
                gutterBottom
                style={{ paddingBottom: '20px' }}
              >
                Prijavi se
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="email"
                    label="email"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="password"
                    name="password"
                    label="Password"
                    fullWidth
                    required
                  />
                  {error && <Typography color="error">{error}</Typography>}
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Prijava
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
