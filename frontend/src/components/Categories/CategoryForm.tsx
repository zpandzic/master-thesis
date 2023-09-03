import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import { FieldTypeEnum } from '../../enums';
import { CategoryType } from '../../types';

export const CategoryForm = ({
  initialValues,
  onSubmit,
  categories,
  title,
}: {
  initialValues: any;
  onSubmit: any;
  categories: CategoryType[];
  title: string;
}) => (
  <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
    {({ values }) => (
      <Form>
        <Box p={2} mb={2}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h5" gutterBottom>
                {title}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="title"
                    label="Naslov kategorije"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="description"
                    label="Opis"
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      name="parent_id"
                      label="Roditeljska kategorija"
                      defaultValue=""
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>

                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="image"
                    label="Slika kategorije URL"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Polja Kategorije
                  </Typography>
                  <FieldArray name="category_fields">
                    {({ push, remove }) => (
                      <>
                        {values.category_fields.map(
                          (field: any, index: number) => (
                            <Box mb={2} key={index}>
                              <Grid item xs={12} container alignItems="center">
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <Field
                                      component={TextField}
                                      label="Ime polja"
                                      name={`category_fields.${index}.field_name`}
                                      fullWidth
                                      required
                                    />
                                  </Grid>

                                  <Grid item xs={3}>
                                    <FormControl fullWidth>
                                      <Field
                                        component={Select}
                                        name={`category_fields.${index}.field_type_id`}
                                        label="Tip polja"
                                        defaultValue=""
                                        required
                                      >
                                        <MenuItem value="">None</MenuItem>
                                        {Object.entries(FieldTypeEnum).map(
                                          ([key, value]) => (
                                            <MenuItem key={key} value={value}>
                                              {key}
                                            </MenuItem>
                                          )
                                        )}
                                      </Field>
                                    </FormControl>
                                  </Grid>

                                  <Grid item xs={4}>
                                    {[
                                      FieldTypeEnum.SELECT,
                                      FieldTypeEnum.MULTI_SELECT,
                                    ].includes(field.field_type_id) && (
                                      <Field
                                        name={`category_fields.${index}.options`}
                                        component={TextField}
                                        label="Opcije (odvojene zarezom)"
                                        fullWidth
                                      />
                                    )}
                                  </Grid>
                                  <Grid item xs={1} style={{ paddingTop: 20 }}>
                                    <IconButton
                                      onClick={() => remove(index)}
                                      key={index}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Box>
                          )
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            push({
                              field_name: '',
                              field_type_id: '',
                              options: '',
                            })
                          }
                        >
                          Add field
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Form>
    )}
  </Formik>
);
