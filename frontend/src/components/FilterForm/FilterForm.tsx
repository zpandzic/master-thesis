import StarOutline from '@mui/icons-material/StarOutline';
import { Box, Button, FormControl, Grid } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContextProvider';
import { getCategoryFieldRow, mapFormikValuesForSubmit } from '../../helper';
import { CategoryFieldFilterType, CategoryFieldType } from '../../types';

type FilterFormProps = {
  fields: CategoryFieldType[];
  fieldsInitialValues: any;
  search?: (
    category_fields: CategoryFieldFilterType[],
    title: string,
    content: string
  ) => void;
  saveFilter?: (filter: {
    category_fields: CategoryFieldFilterType[];
    title: string;
    content: string;
  }) => void;
  hideSaveFilter?: boolean;
  hideSearch?: boolean;
};

export function FilterForm({
  fields,
  search,
  saveFilter,
  hideSaveFilter = false,
  hideSearch = false,
  fieldsInitialValues,
}: FilterFormProps) {
  const authContext = useContext(UserContext);

  const onSubmit = (values: any) => {
    const category_fields: CategoryFieldFilterType[] = mapFormikValuesForSubmit(
      fields,
      values
    );

    search && search(category_fields, values.title, values.content);
  };

  const saveFilterHandler = (filterValues: any) => {
    const category_fields: CategoryFieldFilterType[] = mapFormikValuesForSubmit(
      fields,
      filterValues
    );

    saveFilter &&
      saveFilter({
        category_fields: category_fields,
        title: filterValues.title,
        content: filterValues.content,
      });
  };

  return (
    <Formik
      initialValues={fieldsInitialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form>
          <h3>Filter</h3>
          <Grid container spacing={4} style={{}}>
            <Grid item xs={12} md={6} key={'title'}>
              <FormControl fullWidth>
                <Field
                  component={TextField}
                  name={'title'}
                  label={'Naslov'}
                  key={'title'}
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} key={'description'}>
              <FormControl fullWidth>
                <Field
                  component={TextField}
                  name={'content'}
                  label={'Opis'}
                  key={'content'}
                  fullWidth
                />
              </FormControl>
            </Grid>

            {fields.map((filter) => (
              <Grid item xs={12} md={6} key={filter.field_name}>
                {
                  <Grid container alignItems="center">
                    {getCategoryFieldRow(filter, false, true)}
                  </Grid>
                }
              </Grid>
            ))}
          </Grid>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              paddingTop: '20px',
            }}
          >
            {!hideSaveFilter && authContext.token && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveFilterHandler(values)}
                style={{ marginRight: '10px' }}
              >
                <StarOutline /> Spremi filter
              </Button>
            )}

            {!hideSearch && (
              <Button
                onClick={() => onSubmit(values)}
                variant="contained"
                color="primary"
              >
                Pretraži
              </Button>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
}
