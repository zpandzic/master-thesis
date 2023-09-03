import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryFieldRow, getInitialValues } from '../../helper';
import { categoriesService, postsService } from '../../services';
import { CategoryFieldType, CategoryType } from '../../types';

export function CreatePost() {
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [allCategoryFields, setAllCategoryFields] = useState<CategoryFieldType[]>(
    []
  );
  const navigate = useNavigate();

  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await categoriesService.getCategoryById(
          Number(categoryId)
        );
        setCategory(categoryData);
        setAllCategoryFields([
          ...categoryData.parent_fields,
          ...categoryData.category_fields,
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
  }, []);

  const handleSubmit = async (values: any) => {
    const post_fields = allCategoryFields.map((field) => ({
      category_field_id: field.id,
      value: values[field.id],
    }));

    const payload = {
      title: values.title,
      content: values.content,
      category_id: Number(categoryId),
      post_fields,
    };

    try {
      await postsService.createPost(payload);
      navigate('/categories/' + categoryId);
    } catch (error) {
      console.error(error);
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  const initialValues = {
    title: '',
    content: '',
    ...getInitialValues(allCategoryFields, true),
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          {/* {JSON.stringify(values)}  {"46":"123","47":123,"48":""} */}

          <Box p={2} mb={2}>
            <Paper elevation={3}>
              <Box p={2}>
                <Typography variant="h5" gutterBottom>
                  Kreiraj objavu
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="title"
                      label="Naslov Objave"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="content"
                      label="Opis"
                      fullWidth
                      required
                    />
                  </Grid>

                  {allCategoryFields.map((field) => (
                    <Grid item xs={12} key={field.field_name}>
                      <Grid container alignItems="center">
                        {getCategoryFieldRow(field, true, true)}
                      </Grid>
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Button
                      style={{
                        float: 'right',
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
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
}
